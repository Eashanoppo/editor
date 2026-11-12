"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Play, RotateCcw, Square } from "lucide-react";
import { PYTHON_EXAMPLES, getExampleById } from "@/data/examples";
import { CopyButton } from "@/components/common/CopyButton";
import { PythonEditor } from "@/components/playground/PythonEditor";
import {
  ExecutionStatus,
  type PlaygroundViewStatus,
} from "@/components/playground/ExecutionStatus";
import { OutputPanel } from "@/components/playground/OutputPanel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePyodide } from "@/hooks/usePyodide";
import type { PythonExecutionResult } from "@/lib/pyodide/runner";

const DEFAULT_STARTER = PYTHON_EXAMPLES[0];

export function PlaygroundWorkspace() {
  const searchParams = useSearchParams();
  const rawCode = searchParams.get("code");
  const exampleParam = searchParams.get("example");

  const resolved = useMemo(() => {
    if (rawCode && rawCode.trim().length > 0) {
      return {
        key: `code:${rawCode}`,
        code: rawCode,
        exampleId: "",
      };
    }
    if (exampleParam) {
      const found = getExampleById(exampleParam);
      if (found) {
        return {
          key: `example:${found.id}`,
          code: found.code,
          exampleId: found.id,
        };
      }
    }
    return {
      key: `default:${DEFAULT_STARTER.id}`,
      code: DEFAULT_STARTER.code,
      exampleId: DEFAULT_STARTER.id,
    };
  }, [rawCode, exampleParam]);

  return (
    <PlaygroundWorkspaceInner
      key={resolved.key}
      initialCode={resolved.code}
      initialExampleId={resolved.exampleId}
    />
  );
}

function PlaygroundWorkspaceInner({
  initialCode,
  initialExampleId,
}: {
  initialCode: string;
  initialExampleId: string;
}) {
  const {
    runtimeState,
    runtimeError,
    streamingStdout,
    pendingInput,
    runCode,
    submitInput,
    cancelRun,
  } = usePyodide({
    preloadOnMount: true,
  });

  const [code, setCode] = useState(initialCode);
  const [baselineCode, setBaselineCode] = useState(initialCode);
  const [activeExampleId, setActiveExampleId] = useState(initialExampleId);
  const [result, setResult] = useState<PythonExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const [pendingAction, setPendingAction] = useState<
    | { type: "reset" }
    | { type: "loadExample"; exampleId: string }
    | null
  >(null);

  const hasUnsavedChanges = code !== baselineCode;

  const handleRun = useCallback(async () => {
    if (isExecuting) return;
    setResult(null);
    setIsExecuting(true);
    const execResult = await runCode(code, 5000);
    setResult(execResult);
    setIsExecuting(false);
  }, [code, isExecuting, runCode]);

  const applyReset = () => {
    setCode(baselineCode);
    setResult(null);
    setPendingAction(null);
  };

  const applyLoadExample = (exampleId: string) => {
    const found = getExampleById(exampleId);
    if (!found) return;
    setActiveExampleId(found.id);
    setCode(found.code);
    setBaselineCode(found.code);
    setResult(null);
    setPendingAction(null);
  };

  const requestReset = () => {
    if (hasUnsavedChanges) {
      setPendingAction({ type: "reset" });
    } else {
      applyReset();
    }
  };

  const requestExampleSelect = (exampleId: string) => {
    if (hasUnsavedChanges) {
      setPendingAction({ type: "loadExample", exampleId });
    } else {
      applyLoadExample(exampleId);
    }
  };

  const viewStatus: PlaygroundViewStatus = useMemo(() => {
    if (runtimeState === "loading") return "loading";
    if (isExecuting && runtimeState === "waiting-input") return "waiting-input";
    if (isExecuting || runtimeState === "running") return "running";
    if (result?.status === "timeout") return "timeout";
    if (result?.status === "error" || runtimeState === "error") return "error";
    if (result?.status === "completed") return "completed";
    return runtimeState;
  }, [isExecuting, result, runtimeState]);

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col gap-3 rounded-[10px] border border-border bg-surface p-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-[6px] border border-border bg-surface-muted px-2.5 py-1 font-mono text-xs font-semibold text-ink">
              Python 3 (Pyodide)
            </span>
            <ExecutionStatus status={viewStatus} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isExecuting ? (
            <Button variant="danger" size="sm" onClick={cancelRun}>
              <Square className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Stop</span>
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleRun}
              disabled={runtimeState === "loading"}
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Run Code</span>
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={requestReset}>
            <RotateCcw className="h-3.5 w-3.5 text-ink-secondary" aria-hidden="true" />
            <span>Reset</span>
          </Button>

          <CopyButton text={code} size="sm" />
        </div>
      </div>

      {/* Desktop split layout / Mobile vertical stack */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7 overflow-hidden rounded-[10px] border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-2.5">
            <span className="font-mono text-xs font-semibold text-ink">
              main.py
            </span>
            <span className="text-[11px] text-ink-secondary">
              Ctrl+Enter to run · Esc to exit editor focus
            </span>
          </div>
          <PythonEditor
            value={code}
            onChange={setCode}
            onRunShortcut={handleRun}
            minHeight="360px"
          />
        </div>

        <div className="lg:col-span-5">
          <OutputPanel
            status={viewStatus}
            result={result}
            runtimeError={runtimeError}
            streamingStdout={isExecuting ? streamingStdout : ""}
            pendingInput={isExecuting ? pendingInput : null}
            onSubmitInput={submitInput}
            onClear={() => setResult(null)}
          />
        </div>
      </div>

      {/* Example Selector & Usage Notes */}
      <div className="rounded-[12px] border border-border bg-surface p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">
              Starter Examples
            </h2>
            <p className="text-xs text-ink-secondary">
              Click any example to load it into the editor and test changes.
            </p>
          </div>
          <p className="text-xs text-ink-secondary">
            Runs locally inside a browser WebAssembly worker (5s timeout guard).
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {PYTHON_EXAMPLES.map((example) => {
            const isSelected = activeExampleId === example.id && !hasUnsavedChanges;
            return (
              <button
                key={example.id}
                type="button"
                onClick={() => requestExampleSelect(example.id)}
                className={`rounded-[8px] border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "border-brand bg-brand-light text-brand-accent"
                    : "border-border bg-surface-muted text-ink hover:border-border-strong hover:bg-surface-secondary"
                }`}
              >
                {example.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog for Unsaved Changes */}
      <Dialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Discard your code edits?</DialogTitle>
          <DialogDescription>
            {pendingAction?.type === "reset"
              ? "Resetting will restore the starter code and replace your current changes in the editor."
              : "Loading a new example will replace your current changes in the editor."}
          </DialogDescription>
          <div className="mt-5 flex justify-end gap-2.5">
            <Button variant="outline" onClick={() => setPendingAction(null)}>
              Keep Editing
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (pendingAction?.type === "reset") applyReset();
                else if (pendingAction?.type === "loadExample") {
                  applyLoadExample(pendingAction.exampleId);
                }
              }}
            >
              {pendingAction?.type === "reset" ? "Reset Code" : "Load Example"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
