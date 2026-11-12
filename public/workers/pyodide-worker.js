const PYODIDE_BASE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";
const MAX_OUTPUT_CHARS = 50000;

let pyodideInstance = null;
let pyodideLoadingPromise = null;

async function ensurePyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadingPromise) return pyodideLoadingPromise;

  self.postMessage({ type: "status", status: "loading" });

  pyodideLoadingPromise = (async () => {
    try {
      importScripts(`${PYODIDE_BASE_URL}pyodide.js`);
      const instance = await self.loadPyodide({
        indexURL: PYODIDE_BASE_URL,
      });
      pyodideInstance = instance;
      self.postMessage({ type: "status", status: "ready" });
      return instance;
    } catch (err) {
      pyodideLoadingPromise = null;
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load the Python WebAssembly runtime.";
      throw new Error(message);
    }
  })();

  return pyodideLoadingPromise;
}

const PYTHON_HARNESS = `
import io
import sys
import traceback

def __run_user_code__(source_code, max_chars):
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()
    old_stdout = sys.stdout
    old_stderr = sys.stderr

    def _disabled_input(prompt=""):
        raise RuntimeError(
            "Interactive input() is not available in this browser runner. "
            "Assign a value directly to your variable instead (for example: name = 'Alex')."
        )

    namespace = {"__name__": "__main__", "input": _disabled_input}
    error_text = ""

    try:
        sys.stdout = stdout_buf
        sys.stderr = stderr_buf
        compiled = compile(source_code, "<main.py>", "exec")
        exec(compiled, namespace, namespace)
    except SyntaxError as exc:
        lines = traceback.format_exception_only(type(exc), exc)
        loc = f'File "<main.py>", line {exc.lineno}\\n' if exc.lineno else ""
        text_line = f"  {exc.text.rstrip()}\\n" if exc.text else ""
        caret = ""
        if exc.offset and exc.text:
            caret = "  " + (" " * max(exc.offset - 1, 0)) + "^\\n"
        error_text = f"{loc}{text_line}{caret}{''.join(lines)}".rstrip()
    except Exception as exc:
        tb_entries = traceback.extract_tb(exc.__traceback__)
        user_frames = [frame for frame in tb_entries if frame.filename == "<main.py>"]
        if user_frames:
            formatted_frames = "".join(traceback.format_list(user_frames))
            exc_only = "".join(traceback.format_exception_only(type(exc), exc))
            error_text = f"Traceback (most recent call last):\\n{formatted_frames}{exc_only}".rstrip()
        else:
            error_text = "".join(traceback.format_exception_only(type(exc), exc)).rstrip()
    finally:
        sys.stdout = old_stdout
        sys.stderr = old_stderr

    out_val = stdout_buf.getvalue()
    err_val = stderr_buf.getvalue()

    truncated = False
    if len(out_val) > max_chars:
        out_val = out_val[:max_chars] + "\\n[Output truncated: exceeded 50,000 characters]"
        truncated = True
    if len(err_val) > max_chars:
        err_val = err_val[:max_chars] + "\\n[Error output truncated]"

    return {
        "stdout": out_val,
        "stderr": err_val,
        "error": error_text,
        "truncated": truncated,
    }
`;

let harnessLoaded = false;

self.onmessage = async (event) => {
  const payload = event.data;
  if (!payload || typeof payload !== "object") return;

  if (payload.type === "init") {
    try {
      await ensurePyodide();
    } catch (err) {
      self.postMessage({
        type: "init-error",
        error:
          err instanceof Error
            ? err.message
            : "Could not initialize Python runtime.",
      });
    }
    return;
  }

  if (payload.type === "run") {
    const { id, code } = payload;
    const startTime = performance.now();

    try {
      const pyodide = await ensurePyodide();

      if (!harnessLoaded) {
        await pyodide.runPythonAsync(PYTHON_HARNESS);
        harnessLoaded = true;
      }

      self.postMessage({ type: "status", status: "running", id });

      pyodide.globals.set("__user_source__", String(code ?? ""));
      pyodide.globals.set("__max_chars__", MAX_OUTPUT_CHARS);

      const pyResult = pyodide.runPython(
        "__run_user_code__(__user_source__, __max_chars__)"
      );
      const jsResult = pyResult.toJs({ dict_converter: Object.fromEntries });
      if (typeof pyResult.destroy === "function") {
        pyResult.destroy();
      }

      const durationMs = Math.round(performance.now() - startTime);

      self.postMessage({
        type: "result",
        id,
        stdout: jsResult.stdout || "",
        stderr: jsResult.stderr || "",
        error: jsResult.error || "",
        truncated: Boolean(jsResult.truncated),
        durationMs,
      });
    } catch (err) {
      const durationMs = Math.round(performance.now() - startTime);
      self.postMessage({
        type: "result",
        id,
        stdout: "",
        stderr: "",
        error:
          err instanceof Error
            ? err.message
            : "Failed to run Python code in WebAssembly.",
        truncated: false,
        durationMs,
      });
    }
  }
};

