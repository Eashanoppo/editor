"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import type { PyodideRuntimeState } from "@/lib/pyodide/runner";

export type PlaygroundViewStatus =
  | PyodideRuntimeState
  | "completed";

export function ExecutionStatus({
  status,
}: {
  status: PlaygroundViewStatus;
}) {
  if (status === "loading") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand-accent">
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
        <span>Loading Python runtime...</span>
      </span>
    );
  }

  if (status === "waiting-input") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-warning-border bg-warning-bg px-2.5 py-0.5 text-xs font-medium text-warning">
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-yellow-accent"
          aria-hidden="true"
        />
        <span>Waiting for input...</span>
      </span>
    );
  }

  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand-accent">
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
        <span>Running...</span>
      </span>
    );
  }

  if (status === "completed" || status === "ready") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-success-border bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success">
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
        <span>{status === "completed" ? "Completed" : "Python Ready"}</span>
      </span>
    );
  }

  if (status === "timeout") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-warning-border bg-warning-bg px-2.5 py-0.5 text-xs font-medium text-warning">
        <Clock className="h-3 w-3" aria-hidden="true" />
        <span>Timed out</span>
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-error-border bg-error-bg px-2.5 py-0.5 text-xs font-medium text-error">
        <AlertCircle className="h-3 w-3" aria-hidden="true" />
        <span>Error</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-secondary px-2.5 py-0.5 text-xs font-medium text-ink-secondary">
      <span className="h-1.5 w-1.5 rounded-full bg-ink-muted" aria-hidden="true" />
      <span>Ready on first run</span>
    </span>
  );
}

