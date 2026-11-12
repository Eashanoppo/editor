"use client";

import React, { useState } from "react";
import { CheckCircle2, HelpCircle, RotateCcw, XCircle } from "lucide-react";
import { PythonCodeView } from "@/components/common/PythonCodeView";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

export interface QuickPracticeProps {
  id: string;
  chapterSlug: string;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function QuickPractice({
  id,
  chapterSlug,
  question,
  code,
  options,
  correctIndex,
  explanation,
}: QuickPracticeProps) {
  const { recordQuickPractice, progress, hydrated } = useProgress();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const previouslyCompleted = hydrated
    ? Boolean(progress.quickPracticeCompleted[id])
    : false;

  const isCorrect = submitted && selectedIndex === correctIndex;

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);
    recordQuickPractice(id, chapterSlug, selectedIndex === correctIndex);
  };

  const handleRetry = () => {
    setSelectedIndex(null);
    setSubmitted(false);
  };

  return (
    <div className="my-6 rounded-[10px] border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-accent">
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          <span>Quick Practice</span>
        </div>
        {previouslyCompleted ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2.5 py-0.5 text-[11px] font-medium text-success">
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            Completed
          </span>
        ) : null}
      </div>

      <p className="mt-2.5 text-[15px] font-medium text-ink">{question}</p>

      {code ? (
        <div className="mt-3 overflow-hidden rounded-[8px] border border-border">
          <PythonCodeView code={code} />
        </div>
      ) : null}

      <div className="mt-4 space-y-2" role="radiogroup" aria-label={question}>
        {options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const showCorrect = submitted && idx === correctIndex;
          const showWrong = submitted && isSelected && idx !== correctIndex;

          return (
            <button
              key={idx}
              type="button"
              disabled={submitted}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "flex w-full items-center justify-between rounded-[8px] border px-3.5 py-2.5 text-left text-sm transition-colors cursor-pointer disabled:cursor-default",
                !submitted && isSelected
                  ? "border-brand bg-brand-light text-ink font-medium"
                  : !submitted
                    ? "border-border bg-surface-muted text-ink hover:bg-surface-secondary"
                    : showCorrect
                      ? "border-success-border bg-success-bg text-success font-medium"
                      : showWrong
                        ? "border-error-border bg-error-bg text-error"
                        : "border-border bg-surface text-ink-secondary"
              )}
            >
              <span className="font-mono text-[13px]">{option}</span>
              {showCorrect ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              ) : showWrong ? (
                <XCircle className="h-4 w-4 shrink-0 text-error" aria-hidden="true" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button
            type="button"
            disabled={selectedIndex === null}
            onClick={handleSubmit}
            className="inline-flex h-9 items-center justify-center rounded-[8px] bg-brand px-4 text-xs font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Check Answer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-border bg-surface px-3.5 text-xs font-medium text-ink transition-colors hover:bg-surface-muted cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Try Again</span>
          </button>
        )}
      </div>

      {submitted ? (
        <div
          aria-live="polite"
          className={cn(
            "mt-4 rounded-[8px] border p-3.5 text-sm",
            isCorrect
              ? "border-success-border bg-success-bg text-success"
              : "border-error-border bg-error-bg text-error-strong"
          )}
        >
          <p className="font-semibold">
            {isCorrect
              ? "Correct!"
              : `Not quite — the correct answer is "${options[correctIndex]}".`}
          </p>
          <p className="mt-1 leading-relaxed">{explanation}</p>
        </div>
      ) : null}
    </div>
  );
}

