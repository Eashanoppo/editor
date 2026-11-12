"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { QUESTION_TYPE_LABELS } from "@/data/quizzes";
import type { QuestionType } from "@/types/quiz";

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  chapterNumber: number;
  chapterTitle: string;
  questionType: QuestionType;
}

export function QuizProgress({
  currentIndex,
  totalQuestions,
  chapterNumber,
  chapterTitle,
  questionType,
}: QuizProgressProps) {
  const percentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-semibold text-brand-accent">
            QUESTION {currentIndex + 1} OF {totalQuestions}
          </span>
          <Badge variant="neutral">
            Ch. {String(chapterNumber).padStart(2, "0")} · {chapterTitle}
          </Badge>
          <Badge variant="primary">{QUESTION_TYPE_LABELS[questionType]}</Badge>
        </div>

        <span className="text-xs font-medium text-ink-secondary">
          {percentage}% through quiz
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Quiz progress"
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
  );
}

