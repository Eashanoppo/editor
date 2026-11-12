"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import type { ChapterMeta } from "@/types/curriculum";

export function LessonFooterControls({
  chapter,
  prev,
  next,
}: {
  chapter: ChapterMeta;
  prev: ChapterMeta | null;
  next: ChapterMeta | null;
}) {
  const { isChapterCompleted, toggleChapterCompletion, hydrated } = useProgress();
  const completed = hydrated && isChapterCompleted(chapter.slug);

  return (
    <footer className="mt-12 border-t border-border pt-8 space-y-6">
      {/* Completion card */}
      <div className="flex flex-col justify-between gap-4 rounded-[10px] border border-border bg-surface p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-ink">
            {completed
              ? `Chapter ${String(chapter.number).padStart(2, "0")} completed`
              : `Finished Chapter ${String(chapter.number).padStart(2, "0")}?`}
          </p>
          <p className="mt-0.5 text-sm text-ink-secondary">
            {completed
              ? "Your progress is saved locally in this browser."
              : "Mark this chapter complete when you are comfortable with the concepts."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href={`/practice?chapter=${encodeURIComponent(chapter.slug)}`}
            className="inline-flex h-10 items-center justify-center rounded-[8px] border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
          >
            Take Chapter Quiz
          </Link>

          <button
            type="button"
            onClick={() => toggleChapterCompletion(chapter.slug)}
            aria-pressed={completed}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-4 text-sm font-medium transition-colors cursor-pointer",
              completed
                ? "border border-success-border bg-success-bg text-success hover:bg-success-bg/80"
                : "bg-brand text-white hover:bg-brand-hover"
            )}
          >
            {completed ? (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Completed (Undo)</span>
              </>
            ) : (
              <>
                <Circle className="h-4 w-4" aria-hidden="true" />
                <span>Mark as Completed</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Previous / Next chapter links */}
      <nav
        aria-label="Lesson pagination"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="flex flex-col rounded-[10px] border border-border bg-surface p-4 transition-colors hover:border-brand"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-secondary">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Previous Chapter
            </span>
            <span className="mt-1 text-sm font-semibold text-ink">
              {String(prev.number).padStart(2, "0")}. {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="flex flex-col items-start sm:items-end rounded-[10px] border border-border bg-surface p-4 transition-colors hover:border-brand"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-secondary">
              Next Chapter
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="mt-1 text-sm font-semibold text-ink">
              {String(next.number).padStart(2, "0")}. {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="flex flex-col items-start sm:items-end rounded-[10px] border border-border bg-surface p-4 transition-colors hover:border-brand"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-secondary">
              Course Overview
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="mt-1 text-sm font-semibold text-brand-accent">
              View Your Learning Dashboard
            </span>
          </Link>
        )}
      </nav>
    </footer>
  );
}

