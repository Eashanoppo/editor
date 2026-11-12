export type PyodideRuntimeState =
  | "idle"
  | "loading"
  | "ready"
  | "running"
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

type StatusListener = (state: PyodideRuntimeState, errorMsg?: string) => void;

interface PendingRun {
  id: string;
  resolve: (result: PythonExecutionResult) => void;
  timeoutId: ReturnType<typeof setTimeout>;
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
  private runCounter = 0;

  getState(): { state: PyodideRuntimeState; error?: string } {
    return { state: this.state, error: this.lastError };
  }

  subscribe(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.state, this.lastError);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private setState(next: PyodideRuntimeState, errorMsg?: string) {
    this.state = next;
    this.lastError = errorMsg;
    this.statusListeners.forEach((fn) => fn(next, errorMsg));
  }

  private startExecutionTimeout(active: PendingRun) {
    clearTimeout(active.timeoutId);
    active.startedAt = performance.now();
    active.timeoutId = setTimeout(() => {
      if (this.pending && this.pending.id === active.id) {
        this.pending = null;
        // Terminate hung worker immediately so it recreates on next run
        this.disposeWorker();
        const secs = Math.round(active.timeoutMs / 1000);
        this.setState(
          "timeout",
          `Execution stopped after ${secs} seconds (timeout).`
        );
        active.resolve({
          status: "timeout",
          stdout: "",
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

      if (data.type === "init-error") {
        const msg =
          typeof data.error === "string"
            ? data.error
            : "Python runtime failed to initialize.";
        this.setState("error", msg);
        if (this.pending) {
          const active = this.pending;
          this.pending = null;
          clearTimeout(active.timeoutId);
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
        clearTimeout(active.timeoutId);

        const hasError = Boolean(data.error || data.stderr);
        this.setState("ready");

        active.resolve({
          status: hasError ? "error" : "completed",
          stdout: String(data.stdout ?? ""),
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
        this.pending = null;
        clearTimeout(active.timeoutId);
        active.resolve({
          status: "error",
          stdout: "",
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

    this.setState(needsLoad ? "loading" : "running");

    return new Promise<PythonExecutionResult>((resolve) => {
      // Generous timeout while runtime downloads; switched to strict timeoutMs once 'running' starts
      const initialWaitMs = needsLoad ? INIT_TIMEOUT_MS : timeoutMs;
      const timeoutId = setTimeout(() => {
        if (this.pending && this.pending.id === id) {
          this.pending = null;
          this.disposeWorker();
          this.setState(
            "error",
            "Python runtime timed out while loading. Please check your internet connection and try again."
          );
          resolve({
            status: "timeout",
            stdout: "",
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

  cancel() {
    if (!this.pending) return;
    const active = this.pending;
    this.pending = null;
    clearTimeout(active.timeoutId);
    this.disposeWorker();
    this.setState("idle");
    active.resolve({
      status: "cancelled",
      stdout: "",
      stderr: "",
      error: "Execution cancelled by user. Worker restarted.",
      durationMs: Math.round(performance.now() - active.startedAt),
    });
  }
}

export const pyodideRunner = new PyodideWorkerManager();
