"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { CHAPTERS } from "@/data/chapters";
import { useProgress } from "@/hooks/useProgress";

export function HomeProgressBanner() {
  const { progress, metrics, hydrated } = useProgress();

  const completedCount = hydrated ? metrics.completedChaptersCount : 0;
  const percentage = hydrated ? metrics.learningPercentage : 0;

  // Determine best next chapter: last visited if not done, else first incomplete chapter
  const nextChapter =
    CHAPTERS.find(
      (ch) =>
        ch.slug === progress.preferences.lastVisitedChapter &&
        !progress.completedChapters.includes(ch.slug)
    ) ??
    CHAPTERS.find((ch) => !progress.completedChapters.includes(ch.slug)) ??
    CHAPTERS[0];

  const ctaLabel =
    completedCount === 0
      ? "Start Chapter 01"
      : completedCount === metrics.totalChapters
        ? "Review Curriculum"
        : `Continue: Ch. ${String(nextChapter.number).padStart(2, "0")}`;

  return (
    <div className="rounded-[12px] border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-accent">
            <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Your Learning Progress</span>
          </div>
          <p className="text-base font-semibold text-ink">
            {completedCount} / {metrics.totalChapters} chapters completed{" "}
            <span className="font-normal text-ink-secondary">
              ({percentage}% complete)
            </span>
          </p>
          <p className="text-sm text-ink-secondary">
            {completedCount === 0
              ? "Begin with Chapter 1 to start tracking your completion in this browser."
              : metrics.quizAttemptsCount > 0 && metrics.averageQuizScore !== null
                ? `${metrics.quizAttemptsCount} quiz attempt${metrics.quizAttemptsCount === 1 ? "" : "s"} recorded · Average score ${metrics.averageQuizScore}%.`
                : "Great momentum — mark each chapter complete as you finish reading and practicing."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-[8px] border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
          >
            View Dashboard
          </Link>
          <Link
            href={`/learn/${nextChapter.slug}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div
          role="progressbar"
          aria-label="Overall course progress"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary"
        >
          <div
            className="h-full rounded-full bg-brand transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

