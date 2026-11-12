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
import ast
import inspect
import io
import json
import linecache
import sys
import traceback


class _FunctionAnalyzer:
    """Identifies functions that call builtin input() directly or transitively."""

    def __init__(self, tree):
        self.tree = tree
        self.func_nodes = {}
        self.promoted_ids = set()
        self.promoted_names = set()
        self.promoted_method_names = set()
        self.scope_shadows_input = {}

    def _walk_own_scope(self, node, include_defs=False):
        yield node
        for child in ast.iter_child_nodes(node):
            if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                if include_defs:
                    yield child
                continue
            yield from self._walk_own_scope(child, include_defs=include_defs)

    def _collect_local_bindings(self, fn):
        bound = set()
        global_or_nonlocal = set()

        for arg in (
            list(fn.args.posonlyargs)
            + list(fn.args.args)
            + list(fn.args.kwonlyargs)
        ):
            bound.add(arg.arg)
        if fn.args.vararg:
            bound.add(fn.args.vararg.arg)
        if fn.args.kwarg:
            bound.add(fn.args.kwarg.arg)

        for stmt in fn.body:
            for node in self._walk_own_scope(stmt, include_defs=True):
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)) and node is not fn:
                    bound.add(node.name)
                elif isinstance(node, ast.Global):
                    global_or_nonlocal.update(node.names)
                elif isinstance(node, ast.Nonlocal):
                    global_or_nonlocal.update(node.names)
                elif isinstance(node, ast.Name) and isinstance(node.ctx, (ast.Store, ast.Del)):
                    bound.add(node.id)
                elif isinstance(node, (ast.Import, ast.ImportFrom)):
                    for alias in node.names:
                        bound.add(alias.asname or alias.name.split(".")[0])
                elif isinstance(node, ast.ExceptHandler) and node.name:
                    bound.add(node.name)

        return bound - global_or_nonlocal

    def _module_defines_custom_input(self):
        for stmt in self.tree.body:
            if isinstance(stmt, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                if stmt.name == "input":
                    return True
            elif isinstance(stmt, (ast.Import, ast.ImportFrom)):
                for alias in stmt.names:
                    if (alias.asname or alias.name.split(".")[0]) == "input":
                        return True
        return False

    def analyze(self):
        module_custom_input = self._module_defines_custom_input()
        fn_is_method = {}

        def register_tree(root, in_class):
            for child in ast.iter_child_nodes(root):
                if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    fid = id(child)
                    self.func_nodes[fid] = child
                    fn_is_method[fid] = in_class
                    local_bound = self._collect_local_bindings(child)
                    self.scope_shadows_input[fid] = module_custom_input or ("input" in local_bound)
                    register_tree(child, False)
                elif isinstance(child, ast.ClassDef):
                    register_tree(child, True)
                else:
                    register_tree(child, False)

        register_tree(self.tree, False)

        changed = True
        while changed:
            changed = False
            for fid, fn in self.func_nodes.items():
                if fid in self.promoted_ids:
                    continue
                if fn_is_method[fid] and fn.name.startswith("__") and fn.name.endswith("__"):
                    continue
                shadows_input = self.scope_shadows_input[fid]
                needs_promote = False
                for stmt in fn.body:
                    for sub in self._walk_own_scope(stmt):
                        if isinstance(sub, ast.Call):
                            if isinstance(sub.func, ast.Name):
                                if sub.func.id == "input" and not shadows_input:
                                    needs_promote = True
                                    break
                                if sub.func.id in self.promoted_names:
                                    needs_promote = True
                                    break
                            elif isinstance(sub.func, ast.Attribute):
                                if sub.func.attr in self.promoted_method_names:
                                    needs_promote = True
                                    break
                    if needs_promote:
                        break
                if needs_promote:
                    self.promoted_ids.add(fid)
                    if fn_is_method[fid]:
                        self.promoted_method_names.add(fn.name)
                    else:
                        self.promoted_names.add(fn.name)
                    changed = True

        if self.promoted_ids:
            return True

        if not module_custom_input:
            for node in ast.walk(self.tree):
                if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "input":
                    return True
        return False


class _AsyncInputTransformer(ast.NodeTransformer):
    """Transforms direct input() calls and callers into async/await calls."""

    def __init__(self, analyzer):
        self.analyzer = analyzer
        self.shadows_stack = [analyzer._module_defines_custom_input()]
        self.async_stack = [True]

    def _transform_body(self, stmts):
        out = []
        shadowed_in_block = False
        for stmt in stmts:
            if shadowed_in_block and not self.shadows_stack[-1]:
                self.shadows_stack.append(True)
                new_stmt = self.visit(stmt)
                self.shadows_stack.pop()
            else:
                new_stmt = self.visit(stmt)
            out.append(new_stmt)

            if isinstance(stmt, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)) and stmt.name == "input":
                shadowed_in_block = True
            elif isinstance(stmt, ast.Assign):
                for target in stmt.targets:
                    if isinstance(target, ast.Name) and target.id == "input":
                        shadowed_in_block = True
            elif isinstance(stmt, ast.AnnAssign) and isinstance(stmt.target, ast.Name) and stmt.target.id == "input":
                shadowed_in_block = True
        return out

    def visit_Module(self, node):
        node.body = self._transform_body(node.body)
        return node

    def visit_FunctionDef(self, node):
        fid = id(node)
        promoted = fid in self.analyzer.promoted_ids
        shadows = self.analyzer.scope_shadows_input.get(fid, self.shadows_stack[-1])
        node.decorator_list = [self.visit(d) for d in node.decorator_list]
        node.args = self.visit(node.args)
        self.shadows_stack.append(shadows)
        self.async_stack.append(promoted)
        node.body = [self.visit(s) for s in node.body]
        self.async_stack.pop()
        self.shadows_stack.pop()

        if promoted:
            async_fn = ast.AsyncFunctionDef(
                name=node.name,
                args=node.args,
                body=node.body,
                decorator_list=node.decorator_list,
                returns=node.returns,
                type_comment=node.type_comment,
                type_params=getattr(node, "type_params", []),
            )
            return ast.copy_location(async_fn, node)
        return node

    def visit_AsyncFunctionDef(self, node):
        fid = id(node)
        shadows = self.analyzer.scope_shadows_input.get(fid, self.shadows_stack[-1])
        self.shadows_stack.append(shadows)
        self.async_stack.append(True)
        self.generic_visit(node)
        self.async_stack.pop()
        self.shadows_stack.pop()
        return node

    def visit_Lambda(self, node):
        self.async_stack.append(False)
        self.generic_visit(node)
        self.async_stack.pop()
        return node

    def visit_GeneratorExp(self, node):
        self.generic_visit(node)
        if self.async_stack[-1] and any(isinstance(sub, ast.Await) for sub in ast.walk(node)):
            comp = ast.ListComp(elt=node.elt, generators=node.generators)
            return ast.copy_location(comp, node)
        return node

    def visit_Call(self, node):
        self.generic_visit(node)
        if not self.async_stack[-1]:
            return node

        if isinstance(node.func, ast.Name):
            if node.func.id == "input" and not self.shadows_stack[-1]:
                new_call = ast.Call(
                    func=ast.copy_location(ast.Name(id="__async_input__", ctx=ast.Load()), node.func),
                    args=node.args,
                    keywords=node.keywords,
                )
                ast.copy_location(new_call, node)
                return ast.copy_location(ast.Await(value=new_call), node)
            if node.func.id in self.analyzer.promoted_names:
                wrapped = ast.Call(
                    func=ast.copy_location(ast.Name(id="__maybe_await__", ctx=ast.Load()), node),
                    args=[node],
                    keywords=[],
                )
                ast.copy_location(wrapped, node)
                return ast.copy_location(ast.Await(value=wrapped), node)
        elif isinstance(node.func, ast.Attribute):
            if node.func.attr in self.analyzer.promoted_method_names:
                wrapped = ast.Call(
                    func=ast.copy_location(ast.Name(id="__maybe_await__", ctx=ast.Load()), node),
                    args=[node],
                    keywords=[],
                )
                ast.copy_location(wrapped, node)
                return ast.copy_location(ast.Await(value=wrapped), node)
        return node


async def __run_user_code__(source_code, max_chars, run_id, request_input_fn):
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    flushed_len = [0]

    async def __async_input__(prompt="", /):
        prompt_str = "" if prompt is None else str(prompt)
        current_out = stdout_buf.getvalue()
        chunk = current_out[flushed_len[0]:]
        raw_resp = await request_input_fn(run_id, prompt_str, chunk)
        resp = json.loads(raw_resp)
        if resp.get("eof"):
            flushed_len[0] = len(current_out)
            raise EOFError("EOF when reading a line")
        user_val = str(resp.get("value", "")).replace("\\r\\n", "\\n").rstrip("\\n")
        stdout_buf.write(f"{prompt_str}{user_val}\\n")
        flushed_len[0] = len(stdout_buf.getvalue())
        return user_val

    async def __maybe_await__(value):
        if inspect.isawaitable(value):
            return await value
        return value

    def _unsupported_sync_input(prompt="", /):
        raise RuntimeError(
            "input() cannot be called inside a lambda, dunder method, or via alias (such as fn = input) in this browser runner. "
            "Call input(...) directly inside module code or a named def function instead."
        )

    namespace = {
        "__name__": "__main__",
        "input": _unsupported_sync_input,
        "__async_input__": __async_input__,
        "__maybe_await__": __maybe_await__,
    }
    error_text = ""

    linecache.cache["<main.py>"] = (
        len(source_code),
        None,
        source_code.splitlines(keepends=True),
        "<main.py>",
    )

    try:
        sys.stdout = stdout_buf
        sys.stderr = stderr_buf
        orig_tree = ast.parse(source_code, filename="<main.py>", mode="exec")
        sync_compiled = compile(orig_tree, "<main.py>", "exec")

        analyzer = _FunctionAnalyzer(orig_tree)
        if analyzer.analyze():
            transformed = _AsyncInputTransformer(analyzer).visit(orig_tree)
            ast.fix_missing_locations(transformed)
            compiled = compile(
                transformed,
                "<main.py>",
                "exec",
                flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT,
            )
            result = eval(compiled, namespace, namespace)
            if inspect.iscoroutine(result):
                await result
        else:
            exec(sync_compiled, namespace, namespace)
    except SyntaxError as exc:
        error_text = "".join(traceback.format_exception_only(type(exc), exc)).rstrip()
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
        linecache.cache.pop("<main.py>", None)

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
let pendingInput = null;
let pausedInputMs = 0;

function requestInputFromMain(runId, prompt, stdoutChunk) {
  const waitStartedAt = performance.now();
  return new Promise((resolve) => {
    if (pendingInput) {
      pendingInput.resolve(JSON.stringify({ value: "", eof: true }));
      pendingInput = null;
    }
    pendingInput = {
      id: runId,
      resolve: (jsonResponse) => {
        pausedInputMs += performance.now() - waitStartedAt;
        resolve(jsonResponse);
      },
    };
    self.postMessage({
      type: "input-request",
      id: runId,
      prompt: typeof prompt === "string" ? prompt : String(prompt ?? ""),
      stdoutChunk: typeof stdoutChunk === "string" ? stdoutChunk : String(stdoutChunk ?? ""),
    });
  });
}

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

  if (payload.type === "input-response") {
    const { id, value, eof } = payload;
    if (pendingInput && pendingInput.id === id) {
      const resolver = pendingInput.resolve;
      pendingInput = null;
      resolver(
        JSON.stringify({
          value: typeof value === "string" ? value : String(value ?? ""),
          eof: Boolean(eof),
        })
      );
    }
    return;
  }

  if (payload.type === "run") {
    const { id, code } = payload;
    const startTime = performance.now();
    pausedInputMs = 0;

    try {
      const pyodide = await ensurePyodide();

      if (!harnessLoaded) {
        await pyodide.runPythonAsync(PYTHON_HARNESS);
        harnessLoaded = true;
      }

      self.postMessage({ type: "status", status: "running", id });

      pyodide.globals.set("__user_source__", String(code ?? ""));
      pyodide.globals.set("__max_chars__", MAX_OUTPUT_CHARS);
      pyodide.globals.set("__run_id__", String(id ?? ""));
      pyodide.globals.set("__request_input_js__", requestInputFromMain);

      const pyResult = await pyodide.runPythonAsync(
        "await __run_user_code__(__user_source__, __max_chars__, __run_id__, __request_input_js__)"
      );
      const jsResult = pyResult.toJs({ dict_converter: Object.fromEntries });
      if (typeof pyResult.destroy === "function") {
        pyResult.destroy();
      }

      const durationMs = Math.max(
        0,
        Math.round(performance.now() - startTime - pausedInputMs)
      );

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
      const durationMs = Math.max(
        0,
        Math.round(performance.now() - startTime - pausedInputMs)
      );
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
    } finally {
      if (pendingInput && pendingInput.id === id) {
        pendingInput = null;
      }
    }
  }
};

