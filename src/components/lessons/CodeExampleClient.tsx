"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2, Play, Square, Terminal } from "lucide-react";
import { CopyButton } from "@/components/common/CopyButton";
import { InteractiveTerminalInput } from "@/components/playground/InteractiveTerminalInput";
import { usePyodide } from "@/hooks/usePyodide";
import type { PythonExecutionResult } from "@/lib/pyodide/runner";

interface CodeExampleClientProps {
  title?: string;
  description?: string;
  code: string;
  expectedOutput?: string;
  highlightedHtml: string;
  showLineNumbers?: boolean;
}

export function CodeExampleClient({
  title = "Example",
  description,
  code,
  expectedOutput,
  highlightedHtml,
}: CodeExampleClientProps) {
  const { runCode, cancelRun, streamingStdout, pendingInput, submitInput } =
    usePyodide();
  const [isRunning, setIsRunning] = useState(false);
  const [liveResult, setLiveResult] = useState<PythonExecutionResult | null>(null);

  const handleRun = async () => {
    setLiveResult(null);
    setIsRunning(true);
    const result = await runCode(code, 5000);
    setLiveResult(result);
    setIsRunning(false);
  };

  const playgroundHref = `/playground?code=${encodeURIComponent(code)}`;

  return (
    <div className="my-5 overflow-hidden rounded-[10px] border border-border bg-surface">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-muted px-4 py-2.5">
        <div className="min-w-0">
          <span className="text-xs font-semibold text-ink">{title}</span>
          {description ? (
            <p className="mt-0.5 text-xs text-ink-secondary">{description}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <CopyButton text={code} />
          <Link
            href={playgroundHref}
            className="inline-flex h-7 items-center gap-1 rounded-[6px] border border-border bg-surface px-2.5 text-xs font-medium text-ink transition-colors hover:bg-surface-secondary"
            title="Open this snippet in the full Python Playground"
          >
            <ExternalLink className="h-3 w-3 text-ink-secondary" aria-hidden="true" />
            <span className="hidden sm:inline">Playground</span>
          </Link>
          {isRunning ? (
            <button
              type="button"
              onClick={cancelRun}
              className="inline-flex h-7 items-center gap-1.5 rounded-[6px] bg-[#DC2626] px-2.5 text-xs font-medium text-white transition-colors hover:bg-[#B91C1C] cursor-pointer"
            >
              <Square className="h-3 w-3" aria-hidden="true" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRun}
              className="inline-flex h-7 items-center gap-1.5 rounded-[6px] bg-brand px-2.5 text-xs font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer"
            >
              <Play className="h-3 w-3" aria-hidden="true" />
              <span>Run</span>
            </button>
          )}
        </div>
      </div>

      {/* Syntax-highlighted Python code */}
      <div
        className="shiki-container bg-surface"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />

      {/* Expected output (static) when not yet run, or live Pyodide output after Run */}
      {liveResult ? (
        <div
          aria-live="polite"
          className={`border-t px-4 py-3 ${
            liveResult.status === "error" || liveResult.status === "timeout"
              ? "border-error-border bg-error-bg"
              : "border-border bg-surface-muted"
          }`}
        >
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider">
            <span
              className={`inline-flex items-center gap-1.5 ${
                liveResult.status === "error" || liveResult.status === "timeout"
                  ? "text-error"
                  : "text-success"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
              {liveResult.status === "error"
                ? "Python Error"
                : liveResult.status === "timeout"
                  ? "Execution Timeout"
                  : "Actual Output (Pyodide)"}
            </span>
            <span className="font-normal normal-case text-ink-secondary">
              {liveResult.durationMs}ms
            </span>
          </div>
          {liveResult.stdout ? (
            <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-ink">
              {liveResult.stdout}
            </pre>
          ) : null}
          {liveResult.error || liveResult.stderr ? (
            <pre className="mt-1 overflow-x-auto font-mono text-[13px] leading-relaxed text-error">
              {liveResult.error || liveResult.stderr}
            </pre>
          ) : !liveResult.stdout ? (
            <p className="font-mono text-xs italic text-ink-secondary">
              (Program finished with no printed output)
            </p>
          ) : null}
        </div>
      ) : isRunning ? (
        streamingStdout || pendingInput ? (
          <div className="border-t border-border bg-surface-muted px-4 py-3">
            <InteractiveTerminalInput
              streamingStdout={streamingStdout}
              pendingInput={pendingInput}
              onSubmitInput={submitInput}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 border-t border-border bg-surface-muted px-4 py-3 text-xs text-ink-secondary">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-accent" aria-hidden="true" />
            <span>Running Python in browser worker...</span>
          </div>
        )
      ) : expectedOutput ? (
        <div className="border-t border-border bg-surface-muted px-4 py-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
            Expected Output
          </p>
          <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-ink">
            {expectedOutput}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

