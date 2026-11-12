export type PyodideRuntimeState =
  | "idle"
  | "loading"
  | "ready"
  | "running"
  | "waiting-input"
  | "error"
  | "timeout";

export interface PythonExecutionResult {
  status: "completed" | "error" | "timeout" | "cancelled";
  stdout: string;
  stderr: string;
  error: string;
  durationMs: number;
  truncated?: boolean;
}

export interface PendingInputRequest {
  runId: string;
  requestId: number;
  prompt: string;
}

export interface InteractiveExecutionState {
  streamingStdout: string;
  pendingInput: PendingInputRequest | null;
}

type StatusListener = (state: PyodideRuntimeState, errorMsg?: string) => void;
type InteractiveListener = (interactive: InteractiveExecutionState) => void;

interface PendingRun {
  id: string;
  resolve: (result: PythonExecutionResult) => void;
  timeoutId: ReturnType<typeof setTimeout> | null;
  timeoutMs: number;
  startedAt: number;
}

const INIT_TIMEOUT_MS = 45000;

class PyodideWorkerManager {
  private worker: Worker | null = null;
  private state: PyodideRuntimeState = "idle";
  private lastError: string | undefined;
  private pending: PendingRun | null = null;
  private statusListeners = new Set<StatusListener>();
  private interactiveListeners = new Set<InteractiveListener>();
  private interactiveState: InteractiveExecutionState = {
    streamingStdout: "",
    pendingInput: null,
  };
  private runCounter = 0;
  private inputCounter = 0;

  getState(): { state: PyodideRuntimeState; error?: string } {
    return { state: this.state, error: this.lastError };
  }

  getInteractiveState(): InteractiveExecutionState {
    return this.interactiveState;
  }

  subscribe(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.state, this.lastError);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  subscribeInteractive(listener: InteractiveListener): () => void {
    this.interactiveListeners.add(listener);
    listener(this.interactiveState);
    return () => {
      this.interactiveListeners.delete(listener);
    };
  }

  private setState(next: PyodideRuntimeState, errorMsg?: string) {
    this.state = next;
    this.lastError = errorMsg;
    this.statusListeners.forEach((fn) => fn(next, errorMsg));
  }

  private setInteractiveState(next: InteractiveExecutionState) {
    this.interactiveState = next;
    this.interactiveListeners.forEach((fn) => fn(next));
  }

  private pauseExecutionTimeout(active: PendingRun) {
    if (active.timeoutId !== null) {
      clearTimeout(active.timeoutId);
      active.timeoutId = null;
    }
  }

  private startExecutionTimeout(active: PendingRun) {
    this.pauseExecutionTimeout(active);
    active.startedAt = performance.now();
    active.timeoutId = setTimeout(() => {
      if (this.pending && this.pending.id === active.id) {
        const partialStdout = this.interactiveState.streamingStdout;
        this.pending = null;
        this.setInteractiveState({ streamingStdout: "", pendingInput: null });
        // Terminate hung worker immediately so it recreates on next run
        this.disposeWorker();
        const secs = Math.round(active.timeoutMs / 1000);
        this.setState(
          "timeout",
          `Execution stopped after ${secs} seconds (timeout).`
        );
        active.resolve({
          status: "timeout",
          stdout: partialStdout,
          stderr: "",
          error: `Execution timed out after ${secs}s. Check for infinite loops (for example: while True). The Python worker was safely restarted.`,
          durationMs: Math.round(performance.now() - active.startedAt),
        });
      }
    }, active.timeoutMs);
  }

  private createWorker(): Worker {
    if (typeof window === "undefined" || typeof Worker === "undefined") {
      throw new Error(
        "Web Workers are not supported in this browser environment."
      );
    }

    const worker = new Worker("/workers/pyodide-worker.js");

    worker.onmessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "status") {
        if (data.status === "loading") {
          this.setState("loading");
        } else if (data.status === "ready") {
          if (!this.pending) this.setState("ready");
        } else if (data.status === "running") {
          this.setState("running");
          if (this.pending && data.id === this.pending.id) {
            this.startExecutionTimeout(this.pending);
          }
        }
        return;
      }

      if (data.type === "input-request" && this.pending && data.id === this.pending.id) {
        this.pauseExecutionTimeout(this.pending);
        const chunk =
          typeof data.stdoutChunk === "string"
            ? data.stdoutChunk
            : String(data.stdoutChunk ?? "");
        const prompt =
          typeof data.prompt === "string"
            ? data.prompt
            : String(data.prompt ?? "");
        this.setInteractiveState({
          streamingStdout: this.interactiveState.streamingStdout + chunk,
          pendingInput: {
            runId: this.pending.id,
            requestId: ++this.inputCounter,
            prompt,
          },
        });
        this.setState("waiting-input");
        return;
      }

      if (data.type === "init-error") {
        const msg =
          typeof data.error === "string"
            ? data.error
            : "Python runtime failed to initialize.";
        this.setState("error", msg);
        if (this.pending) {
          const active = this.pending;
          this.pending = null;
          this.pauseExecutionTimeout(active);
          this.setInteractiveState({ streamingStdout: "", pendingInput: null });
          active.resolve({
            status: "error",
            stdout: "",
            stderr: "",
            error: msg,
            durationMs: Math.round(performance.now() - active.startedAt),
          });
        }
        this.disposeWorker();
        return;
      }

      if (data.type === "result" && this.pending && data.id === this.pending.id) {
        const active = this.pending;
        this.pending = null;
        this.pauseExecutionTimeout(active);

        const hasError = Boolean(data.error || data.stderr);
        const finalStdout = String(data.stdout ?? "");
        this.setInteractiveState({
          streamingStdout: finalStdout,
          pendingInput: null,
        });
        this.setState("ready");

        active.resolve({
          status: hasError ? "error" : "completed",
          stdout: finalStdout,
          stderr: String(data.stderr ?? ""),
          error: String(data.error ?? ""),
          durationMs: Number(data.durationMs ?? 0),
          truncated: Boolean(data.truncated),
        });
      }
    };

    worker.onerror = (err: ErrorEvent) => {
      const msg =
        err.message ||
        "The Python execution worker crashed unexpectedly and will restart on next run.";
      if (this.pending) {
        const active = this.pending;
        const partialStdout = this.interactiveState.streamingStdout;
        this.pending = null;
        this.pauseExecutionTimeout(active);
        this.setInteractiveState({ streamingStdout: "", pendingInput: null });
        active.resolve({
          status: "error",
          stdout: partialStdout,
          stderr: "",
          error: msg,
          durationMs: Math.round(performance.now() - active.startedAt),
        });
      }
      this.disposeWorker();
      this.setState("error", msg);
    };

    this.worker = worker;
    return worker;
  }

  private disposeWorker() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  /** Lazily warm up Pyodide in background without executing user code */
  preload() {
    if (this.worker || this.state === "loading" || this.state === "ready") {
      return;
    }
    try {
      const worker = this.createWorker();
      this.setState("loading");
      worker.postMessage({ type: "init" });
    } catch (err) {
      this.setState(
        "error",
        err instanceof Error ? err.message : "Failed to start Python worker."
      );
    }
  }

  async run(
    code: string,
    timeoutMs = 5000
  ): Promise<PythonExecutionResult> {
    if (this.pending) {
      return {
        status: "error",
        stdout: "",
        stderr: "",
        error: "Python code is already executing. Please wait or stop the current run.",
        durationMs: 0,
      };
    }

    let worker: Worker;
    try {
      worker = this.worker ?? this.createWorker();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Web Workers are unavailable in this browser.";
      this.setState("error", message);
      return {
        status: "error",
        stdout: "",
        stderr: "",
        error: message,
        durationMs: 0,
      };
    }

    const id = `run_${++this.runCounter}`;
    const startedAt = performance.now();
    const needsLoad =
      this.state === "idle" || this.state === "error" || this.state === "timeout";

    this.setInteractiveState({ streamingStdout: "", pendingInput: null });
    this.setState(needsLoad ? "loading" : "running");

    return new Promise<PythonExecutionResult>((resolve) => {
      // Generous timeout while runtime downloads; switched to strict timeoutMs once 'running' starts
      const initialWaitMs = needsLoad ? INIT_TIMEOUT_MS : timeoutMs;
      const timeoutId = setTimeout(() => {
        if (this.pending && this.pending.id === id) {
          const partialStdout = this.interactiveState.streamingStdout;
          this.pending = null;
          this.setInteractiveState({ streamingStdout: "", pendingInput: null });
          this.disposeWorker();
          this.setState(
            "error",
            "Python runtime timed out while loading. Please check your internet connection and try again."
          );
          resolve({
            status: "timeout",
            stdout: partialStdout,
            stderr: "",
            error: needsLoad
              ? "Python runtime took too long to download or initialize. Please check your network connection and click Run again."
              : `Execution timed out after ${Math.round(timeoutMs / 1000)}s.`,
            durationMs: Math.round(performance.now() - startedAt),
          });
        }
      }, initialWaitMs);

      this.pending = {
        id,
        resolve,
        timeoutId,
        timeoutMs,
        startedAt,
      };

      worker.postMessage({ type: "run", id, code });
    });
  }

  submitInput(value: string, eof = false) {
    if (
      !this.pending ||
      !this.interactiveState.pendingInput ||
      this.interactiveState.pendingInput.runId !== this.pending.id ||
      !this.worker
    ) {
      return;
    }

    const active = this.pending;
    const currentPrompt = this.interactiveState.pendingInput.prompt;
    const normalizedVal = value.replace(/\r\n/g, "\n").replace(/\n+$/, "");
    const nextStdout = eof
      ? this.interactiveState.streamingStdout
      : `${this.interactiveState.streamingStdout}${currentPrompt}${normalizedVal}\n`;

    this.setInteractiveState({
      streamingStdout: nextStdout,
      pendingInput: null,
    });
    this.setState("running");
    this.startExecutionTimeout(active);
    this.worker.postMessage({
      type: "input-response",
      id: active.id,
      value,
      eof,
    });
  }

  cancel() {
    if (!this.pending) return;
    const active = this.pending;
    const partialStdout = this.interactiveState.streamingStdout;
    this.pending = null;
    this.pauseExecutionTimeout(active);
    this.setInteractiveState({ streamingStdout: "", pendingInput: null });
    this.disposeWorker();
    this.setState("idle");
    active.resolve({
      status: "cancelled",
      stdout: partialStdout,
      stderr: "",
      error: "Execution cancelled by user. Worker restarted.",
      durationMs: Math.round(performance.now() - active.startedAt),
    });
  }
}

export const pyodideRunner = new PyodideWorkerManager();
