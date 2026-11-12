"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Eraser, Loader2, Terminal } from "lucide-react";
import type { PythonExecutionResult } from "@/lib/pyodide/runner";
import type { PlaygroundViewStatus } from "@/components/playground/ExecutionStatus";

interface OutputPanelProps {
  status: PlaygroundViewStatus;
  result: PythonExecutionResult | null;
  runtimeError?: string;
  onClear: () => void;
}

export function OutputPanel({
  status,
  result,
  runtimeError,
  onClear,
}: OutputPanelProps) {
  const hasContent = Boolean(result || runtimeError);

  return (
    <div className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-[10px] border border-border bg-surface">
      {/* Output Header */}
      <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink">
          <Terminal className="h-3.5 w-3.5 text-brand-accent" aria-hidden="true" />
          <span>Output Console</span>
        </div>

        <div className="flex items-center gap-3">
          {result ? (
            <span className="font-mono text-[11px] text-ink-secondary">
              {result.durationMs}ms
            </span>
          ) : null}
          <button
            type="button"
            onClick={onClear}
            disabled={!hasContent}
            className="inline-flex h-7 items-center gap-1.5 rounded-[6px] border border-border bg-surface px-2.5 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface-secondary hover:text-ink disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <Eraser className="h-3 w-3" aria-hidden="true" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Output Body */}
      <div
        aria-live="polite"
        className="flex-1 overflow-auto p-4 font-mono text-[13.5px] leading-[1.6]"
      >
        {status === "loading" ? (
          <div className="flex items-start gap-2.5 rounded-[8px] border border-brand-border bg-brand-light p-3 font-sans text-sm text-ink">
            <Loader2
              className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-brand-accent"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium text-brand-accent">
                Loading Python WebAssembly runtime...
              </p>
              <p className="mt-0.5 text-xs text-ink-secondary">
                First-time setup downloads Pyodide in a background worker so your
                browser stays responsive.
              </p>
            </div>
          </div>
        ) : status === "running" ? (
          <div className="flex items-center gap-2 font-sans text-sm text-brand-accent">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Executing Python code...</span>
          </div>
        ) : runtimeError && !result ? (
          <div className="rounded-[8px] border border-error-border bg-error-bg p-3.5 text-error">
            <div className="mb-1 flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              Runtime Initialization Error
            </div>
            <pre className="whitespace-pre-wrap break-words text-[13px]">
              {runtimeError}
            </pre>
          </div>
        ) : !result ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center font-sans">
            <p className="text-sm font-medium text-ink">
              Waiting for code execution
            </p>
            <p className="mt-1 max-w-xs text-xs text-ink-secondary">
              Click <span className="font-semibold text-brand-accent">Run Code</span>{" "}
              or press <kbd className="rounded border border-border bg-surface-muted px-1.5 py-0.5 text-[11px]">Ctrl+Enter</kbd> to see real Python output here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {result.stdout ? (
              <pre className="whitespace-pre-wrap break-words text-ink">
                {result.stdout}
              </pre>
            ) : null}

            {result.stderr ? (
              <pre className="whitespace-pre-wrap break-words rounded-[8px] border border-error-border bg-error-bg p-3 text-error">
                {result.stderr}
              </pre>
            ) : null}

            {result.error ? (
              <div
                className={`rounded-[8px] border p-3.5 ${
                  result.status === "timeout"
                    ? "border-warning-border bg-warning-bg text-warning"
                    : "border-error-border bg-error-bg text-error"
                }`}
              >
                <div className="mb-1.5 flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {result.status === "timeout"
                      ? "Execution Timeout"
                      : result.status === "cancelled"
                        ? "Execution Cancelled"
                        : "Python Error"}
                  </span>
                </div>
                <pre className="whitespace-pre-wrap break-words text-[13px] leading-relaxed">
                  {result.error}
                </pre>
              </div>
            ) : null}

            {!result.stdout && !result.stderr && !result.error ? (
              <div className="flex items-center gap-2 font-sans text-xs text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>
                  Program completed with no printed output. Use print() to
                  display results.
                </span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

