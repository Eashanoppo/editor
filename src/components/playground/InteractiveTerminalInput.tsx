"use client";

import React, { useEffect, useRef, useState } from "react";
import { CornerDownLeft } from "lucide-react";
import type { PendingInputRequest } from "@/lib/pyodide/runner";

interface InlinePromptFormProps {
  prompt: string;
  onSubmitInput: (value: string, eof?: boolean) => void;
}

function InlinePromptForm({ prompt, onSubmitInput }: InlinePromptFormProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const submitted = value;
        setValue("");
        onSubmitInput(submitted, false);
      }}
      className="inline"
    >
      {prompt ? <span>{prompt}</span> : null}
      <span className="inline-flex max-w-full flex-wrap items-center gap-1.5 align-baseline">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              setValue("");
              onSubmitInput("", true);
            }
          }}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="Type input & press Enter"
          aria-label={prompt || "Python standard input"}
          className="min-w-[170px] max-w-full rounded-[5px] border border-brand-border bg-surface-muted px-2 py-0.5 font-mono text-[16px] sm:text-[13px] text-ink placeholder:text-ink-muted outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded-[5px] bg-brand px-2 py-0.5 font-sans text-[11px] font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer"
        >
          <span>Enter</span>
          <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
        </button>
      </span>
    </form>
  );
}

interface InteractiveTerminalInputProps {
  streamingStdout: string;
  pendingInput: PendingInputRequest | null;
  onSubmitInput?: (value: string, eof?: boolean) => void;
}

export function InteractiveTerminalInput({
  streamingStdout,
  pendingInput,
  onSubmitInput,
}: InteractiveTerminalInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "BUTTON" || target.closest("button"))) {
          return;
        }
        containerRef.current?.querySelector("input")?.focus();
      }}
      className="space-y-2.5"
    >
      <div className="whitespace-pre-wrap break-words font-mono text-[13.5px] leading-[1.6] text-ink">
        {streamingStdout ? <span>{streamingStdout}</span> : null}
        {pendingInput && onSubmitInput ? (
          <InlinePromptForm
            key={pendingInput.requestId}
            prompt={pendingInput.prompt}
            onSubmitInput={onSubmitInput}
          />
        ) : null}
      </div>

      {pendingInput ? (
        <p className="font-sans text-[11px] text-ink-secondary">
          Program waiting on <code className="font-mono text-ink">input()</code> — type a value and press{" "}
          <kbd className="rounded border border-border bg-surface-muted px-1 py-0.5 text-[10px]">
            Enter
          </kbd>{" "}
          (or <kbd className="rounded border border-border bg-surface-muted px-1 py-0.5 text-[10px]">Ctrl+D</kbd> for EOF).
        </p>
      ) : null}
    </div>
  );
}

