"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { CHAPTERS } from "@/data/chapters";
import { StatusBadge, type ChapterStatus } from "@/components/common/StatusBadge";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

export function DashboardWorkspace() {
  const {
    progress,
    metrics,
    hydrated,
    storageAvailable,
    markChapterCompleted,
    resetProgress,
  } = useProgress();

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const getChapterStatus = (slug: string): ChapterStatus => {
    if (!hydrated) return "not_started";
    if (progress.completedChapters.includes(slug)) return "completed";
    if (
      progress.preferences.lastVisitedChapter === slug ||
      progress.practiceActivities.some((a) => a.chapterSlug === slug)
    ) {
      return "in_progress";
    }
    return "not_started";
  };

  const nextChapter =
    CHAPTERS.find((c) => !progress.completedChapters.includes(c.slug)) ??
    CHAPTERS[0];

  return (
    <div className="space-y-8">
      {/* Storage warning if localStorage is blocked (e.g. private browsing) */}
      {hydrated && !storageAvailable ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-[10px] border border-warning-border bg-warning-bg p-4 text-sm text-warning"
        >
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0 text-warning"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold text-warning">
              Browser Local Storage Unavailable
            </p>
            <p className="mt-0.5 text-xs">
              Your browser is blocking or restricting LocalStorage (such as strict
              private mode). Progress will track during this session but may not
              persist after refreshing.
            </p>
          </div>
        </div>
      ) : null}

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[10px] border border-border bg-surface p-4">
          <p className="text-xs font-medium text-ink-secondary">
            Completed Chapters
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">
            {hydrated ? metrics.completedChaptersCount : 0} /{" "}
            <span className="text-base font-medium text-ink-secondary">
              {metrics.totalChapters}
            </span>
          </p>
          <p className="mt-1 text-xs text-ink-secondary">
            {hydrated ? metrics.completedLessonsCount : 0} of{" "}
            {metrics.totalLessons} lessons finished
          </p>
        </div>

        <div className="rounded-[10px] border border-border bg-surface p-4">
          <p className="text-xs font-medium text-ink-secondary">Overall Progress</p>
          <p className="mt-1 text-2xl font-bold text-brand-accent">
            {hydrated ? metrics.learningPercentage : 0}%
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{
                width: `${hydrated ? metrics.learningPercentage : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-[10px] border border-border bg-surface p-4">
          <p className="text-xs font-medium text-ink-secondary">
            Quiz Attempts & Average
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">
            {hydrated && metrics.averageQuizScore !== null
              ? `${metrics.averageQuizScore}%`
              : "—"}
          </p>
          <p className="mt-1 text-xs text-ink-secondary">
            {hydrated && metrics.quizAttemptsCount > 0
              ? `${metrics.quizAttemptsCount} quiz attempt${metrics.quizAttemptsCount === 1 ? "" : "s"} · Best: ${metrics.bestQuizScore}%`
              : "No quiz attempts yet"}
          </p>
        </div>

        <div className="rounded-[10px] border border-border bg-surface p-4">
          <p className="text-xs font-medium text-ink-secondary">
            Practice Activities
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">
            {hydrated ? metrics.practiceActivitiesCompleted : 0}
          </p>
          <p className="mt-1 text-xs text-ink-secondary">
            {hydrated ? metrics.quickPracticeCount : 0} lesson checks ·{" "}
            {hydrated ? metrics.quizAttemptsCount : 0} quizzes
          </p>
        </div>
      </div>

      {/* Empty State Banner when no activity recorded */}
      {hydrated && !metrics.hasAnyActivity ? (
        <div className="flex flex-col items-start justify-between gap-4 rounded-[12px] border border-brand-border bg-brand-light p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-semibold text-ink">
              Ready to Start Your Python Journey?
            </h2>
            <p className="mt-1 text-sm text-ink/80">
              No lessons or practice quizzes are marked complete yet. Start
              with Chapter 01 or test your knowledge with a quick quiz.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/learn/introduction-to-python"
              className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover"
            >
              <span>Start Chapter 01</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/practice"
              className="inline-flex h-10 items-center rounded-[8px] border border-brand-border bg-surface px-4 text-sm font-medium text-ink hover:bg-surface-muted"
            >
              Try Practice Quiz
            </Link>
          </div>
        </div>
      ) : hydrated ? (
        <div className="flex flex-col items-start justify-between gap-4 rounded-[12px] border border-border bg-surface p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Next Recommended Step
            </p>
            <p className="mt-1 text-base font-semibold text-ink">
              {metrics.completedChaptersCount === metrics.totalChapters
                ? "All 9 chapters completed — great work!"
                : `Chapter ${String(nextChapter.number).padStart(2, "0")}: ${nextChapter.title}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href={`/learn/${nextChapter.slug}`}
              className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>
                {metrics.completedChaptersCount === metrics.totalChapters
                  ? "Review Lessons"
                  : "Continue Learning"}
              </span>
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={() => setResetConfirmOpen(true)}
            >
              <RotateCcw className="h-4 w-4 text-ink-secondary" aria-hidden="true" />
              <span>Reset Progress</span>
            </Button>
          </div>
        </div>
      ) : null}

      {/* Recharts Quiz Trend (only rendered when hydrated & attempts exist) */}
      {hydrated && progress.quizAttempts.length > 0 ? (
        <ProgressChart quizAttempts={progress.quizAttempts} />
      ) : null}

      {/* Chapter Progress List */}
      <section className="rounded-[12px] border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-base font-semibold text-ink">
              Chapter-by-Chapter Progress
            </h2>
            <p className="mt-0.5 text-xs text-ink-secondary">
              Mark chapters complete or undo completion at any time.
            </p>
          </div>
        </div>

        <ul className="divide-y divide-border">
          {CHAPTERS.map((chapter) => {
            const status = getChapterStatus(chapter.slug);
            const isCompleted = status === "completed";

            return (
              <li
                key={chapter.slug}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-brand-accent">
                      {String(chapter.number).padStart(2, "0")}
                    </span>
                    <Link
                      href={`/learn/${chapter.slug}`}
                      className="text-sm font-semibold text-ink hover:text-brand-accent"
                    >
                      {chapter.title}
                    </Link>
                    <StatusBadge status={status} />
                  </div>
                  <p className="mt-1 text-xs text-ink-secondary">
                    {chapter.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      markChapterCompleted(chapter.slug, !isCompleted)
                    }
                    className={cn(
                      "inline-flex h-8 items-center gap-1.5 rounded-[6px] border px-3 text-xs font-medium transition-colors cursor-pointer",
                      isCompleted
                        ? "border-success-border bg-success-bg text-success hover:bg-success-bg/80"
                        : "border-border bg-surface-muted text-ink hover:bg-surface-secondary"
                    )}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Undo</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-3.5 w-3.5 text-ink-secondary" aria-hidden="true" />
                        <span>Mark Complete</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/learn/${chapter.slug}`}
                    className="inline-flex h-8 items-center gap-1 rounded-[6px] border border-border bg-surface px-3 text-xs font-medium text-brand-accent hover:bg-brand-light"
                  >
                    <span>Open</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Practice Results Table */}
      <section className="rounded-[12px] border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">
              Practice Quiz Results
            </h2>
            <p className="mt-0.5 text-xs text-ink-secondary">
              Scores saved locally from completed practice quizzes.
            </p>
          </div>
          <Link
            href="/practice"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-accent hover:text-brand-accent"
          >
            <span>Take a new quiz</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {!hydrated || progress.quizAttempts.length === 0 ? (
          <p className="py-6 text-sm text-ink-secondary">
            No quiz attempts saved yet. Complete any quiz in the Practice area
            to view your score history here.
          </p>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-[8px] border border-border bg-surface-muted p-3.5">
                <p className="text-xs text-ink-secondary">Latest Score</p>
                <p className="mt-0.5 text-lg font-bold text-ink">
                  {metrics.latestQuizScore}%
                </p>
              </div>
              <div className="rounded-[8px] border border-border bg-surface-muted p-3.5">
                <p className="text-xs text-ink-secondary">Best Score</p>
                <p className="mt-0.5 text-lg font-bold text-success">
                  {metrics.bestQuizScore}%
                </p>
              </div>
              <div className="rounded-[8px] border border-border bg-surface-muted p-3.5">
                <p className="text-xs text-ink-secondary">Total Attempts</p>
                <p className="mt-0.5 text-lg font-bold text-ink">
                  {metrics.quizAttemptsCount}
                </p>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto rounded-[10px] border border-border">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="border-b border-border bg-surface-muted text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                  <tr>
                    <th className="px-4 py-2.5">Quiz</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Correct</th>
                    <th className="px-4 py-2.5">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {progress.quizAttempts.slice(0, 12).map((attempt) => (
                    <tr key={attempt.id}>
                      <td className="px-4 py-2.5 font-medium text-ink">
                        {attempt.quizTitle}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-ink-secondary">
                        {attempt.categoryLabel}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-ink">
                        {attempt.correctAnswers}/{attempt.totalQuestions}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-brand-accent">
                        {attempt.scorePercentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* Reset Progress Confirmation Dialog */}
      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent>
          <DialogTitle>Reset all learning progress?</DialogTitle>
          <DialogDescription>
            This will clear all completed chapters, lesson checks, and quiz
            attempt history stored in this browser. This action cannot be
            undone.
          </DialogDescription>
          <div className="mt-5 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setResetConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                resetProgress();
                setResetConfirmOpen(false);
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span>Yes, Reset Progress</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

