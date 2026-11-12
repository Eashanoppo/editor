"use client";

import React from "react";
import Link from "next/link";
import { Award, BookOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuestionAttemptResult, QuizQuestion } from "@/types/quiz";

interface QuizResultProps {
  quizTitle: string;
  questions: QuizQuestion[];
  results: QuestionAttemptResult[];
  onRetry: () => void;
  onBackToSetup: () => void;
}

export function QuizResult({
  quizTitle,
  questions,
  results,
  onRetry,
  onBackToSetup,
}: QuizResultProps) {
  const total = questions.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const incorrectCount = total - correctCount;
  const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="space-y-6 rounded-[12px] border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-accent">
            <Award className="h-4 w-4" aria-hidden="true" />
            <span>Quiz Complete</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-ink">{quizTitle}</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Your attempt has been saved to your local browser history.
          </p>
        </div>

        <div className="rounded-[10px] border border-brand-border bg-brand-light px-5 py-3 text-center">
          <p className="text-2xl font-bold text-brand-accent">{scorePct}%</p>
          <p className="text-xs font-medium text-ink">
            {correctCount} / {total} correct
          </p>
        </div>
      </div>

      {/* Breakdown metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-[10px] border border-border bg-surface-muted p-4">
          <p className="text-xs font-medium text-ink-secondary">Total Questions</p>
          <p className="mt-1 text-xl font-bold text-ink">{total}</p>
        </div>
        <div className="rounded-[10px] border border-success-border bg-success-bg p-4">
          <p className="text-xs font-medium text-success">Correct Answers</p>
          <p className="mt-1 text-xl font-bold text-success">{correctCount}</p>
        </div>
        <div className="rounded-[10px] border border-error-border bg-error-bg p-4">
          <p className="text-xs font-medium text-error">Incorrect Answers</p>
          <p className="mt-1 text-xl font-bold text-error">
            {incorrectCount}
          </p>
        </div>
      </div>

      {/* Question review list */}
      <div>
        <h3 className="text-sm font-semibold text-ink">
          Question Summary
        </h3>
        <ul className="mt-3 divide-y divide-border rounded-[10px] border border-border">
          {questions.map((q, idx) => {
            const attempt = results.find((r) => r.questionId === q.id);
            const passed = Boolean(attempt?.isCorrect);
            return (
              <li
                key={q.id}
                className="flex items-start justify-between gap-4 px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">
                    {idx + 1}. {q.prompt}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-secondary">
                    Ch. {String(q.chapterNumber).padStart(2, "0")}: {q.chapterTitle}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    passed
                      ? "bg-success-bg text-success"
                      : "bg-error-bg text-error"
                  }`}
                >
                  {passed ? "Correct" : "Incorrect"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="button" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Retry This Quiz</span>
        </Button>
        <Button type="button" variant="outline" onClick={onBackToSetup}>
          Choose Another Quiz
        </Button>
        <Link
          href="/learn"
          className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-border bg-surface px-4 text-sm font-medium text-ink hover:bg-surface-muted"
        >
          <BookOpen className="h-4 w-4 text-brand-accent" aria-hidden="true" />
          <span>Return to Learning</span>
        </Link>
      </div>
    </div>
  );
}

