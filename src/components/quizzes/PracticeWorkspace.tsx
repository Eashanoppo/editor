"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckSquare, Play, Trophy } from "lucide-react";
import { CHAPTERS } from "@/data/chapters";
import {
  QUESTION_TYPE_LABELS,
  QUIZ_QUESTIONS,
  filterQuizQuestions,
} from "@/data/quizzes";
import { QuizProgress } from "@/components/quizzes/QuizProgress";
import { QuestionCard } from "@/components/quizzes/QuestionCard";
import { QuizResult } from "@/components/quizzes/QuizResult";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/StateBlocks";
import { useProgress } from "@/hooks/useProgress";
import { cn, generateId } from "@/lib/utils";
import type { QuestionAttemptResult, QuestionType } from "@/types/quiz";

const QUESTION_TYPES: Array<{ id: QuestionType | "all"; label: string }> = [
  { id: "all", label: "All Formats" },
  { id: "mcq", label: "Multiple Choice" },
  { id: "true_false", label: "True / False" },
  { id: "fill_blank", label: "Fill in the Blanks" },
  { id: "predict_output", label: "Predict the Output" },
  { id: "find_error", label: "Find the Error" },
  { id: "coding_challenge", label: "Coding Challenges" },
];

export function PracticeWorkspace() {
  const searchParams = useSearchParams();
  const initialChapter = searchParams.get("chapter") ?? "all";
  const validInitialChapter =
    initialChapter === "all" ||
    CHAPTERS.some((c) => c.slug === initialChapter)
      ? initialChapter
      : "all";

  return <PracticeWorkspaceInner initialChapter={validInitialChapter} />;
}

function PracticeWorkspaceInner({
  initialChapter,
}: {
  initialChapter: string;
}) {
  const { progress, metrics, recordQuizAttempt, hydrated } = useProgress();

  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [selectedType, setSelectedType] = useState<QuestionType | "all">("all");
  const [mode, setMode] = useState<"setup" | "active" | "results">("setup");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [attemptResults, setAttemptResults] = useState<QuestionAttemptResult[]>(
    []
  );
  const [sessionId, setSessionId] = useState(0);

  const activeQuestions = useMemo(
    () => filterQuizQuestions(selectedChapter, selectedType),
    [selectedChapter, selectedType]
  );

  const quizTitle = useMemo(() => {
    const chObj = CHAPTERS.find((c) => c.slug === selectedChapter);
    const chLabel = chObj
      ? `Chapter ${String(chObj.number).padStart(2, "0")}: ${chObj.title}`
      : "Full Curriculum Practice";
    const typeLabel =
      selectedType === "all" ? "" : ` (${QUESTION_TYPE_LABELS[selectedType]})`;
    return `${chLabel}${typeLabel}`;
  }, [selectedChapter, selectedType]);

  const startQuiz = () => {
    if (activeQuestions.length === 0) return;
    setCurrentIndex(0);
    setAttemptResults([]);
    setSessionId((prev) => prev + 1);
    setMode("active");
  };

  const handleAnswered = (res: QuestionAttemptResult) => {
    setAttemptResults((prev) => {
      const filtered = prev.filter((item) => item.questionId !== res.questionId);
      return [...filtered, res];
    });
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const correctCount = attemptResults.filter((r) => r.isCorrect).length;
      const total = activeQuestions.length;
      const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

      recordQuizAttempt({
        id: generateId("quiz"),
        quizId: `${selectedChapter}:${selectedType}`,
        quizTitle,
        chapterSlug: selectedChapter,
        categoryLabel:
          selectedType === "all"
            ? "Mixed Practice"
            : QUESTION_TYPE_LABELS[selectedType],
        totalQuestions: total,
        correctAnswers: correctCount,
        scorePercentage: pct,
        completedAt: new Date().toISOString(),
      });

      setMode("results");
    }
  };

  if (mode === "active" && activeQuestions.length > 0) {
    const currentQuestion = activeQuestions[currentIndex];
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMode("setup")}
            className="text-xs font-medium text-ink-secondary hover:text-ink cursor-pointer"
          >
            ← Back to Practice Setup
          </button>
          <span className="text-xs font-medium text-ink-secondary">{quizTitle}</span>
        </div>

        <QuizProgress
          currentIndex={currentIndex}
          totalQuestions={activeQuestions.length}
          chapterNumber={currentQuestion.chapterNumber}
          chapterTitle={currentQuestion.chapterTitle}
          questionType={currentQuestion.type}
        />

        <QuestionCard
          key={`${sessionId}-${currentQuestion.id}`}
          question={currentQuestion}
          isLast={currentIndex === activeQuestions.length - 1}
          onAnswered={handleAnswered}
          onNext={handleNext}
        />
      </div>
    );
  }

  if (mode === "results") {
    return (
      <div className="mx-auto max-w-3xl">
        <QuizResult
          quizTitle={quizTitle}
          questions={activeQuestions}
          results={attemptResults}
          onRetry={startQuiz}
          onBackToSetup={() => setMode("setup")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quiz Builder */}
      <div className="rounded-[12px] border border-border bg-surface p-5 sm:p-6 space-y-6">
        <div>
          <h2 className="text-base font-semibold text-ink">
            1. Choose Chapter Scope
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedChapter("all")}
              className={cn(
                "rounded-[8px] border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                selectedChapter === "all"
                  ? "border-brand bg-brand-light text-brand-accent"
                  : "border-border bg-surface-muted text-ink hover:bg-surface-secondary"
              )}
            >
              All 9 Chapters ({QUIZ_QUESTIONS.length})
            </button>
            {CHAPTERS.map((ch) => (
              <button
                key={ch.slug}
                type="button"
                onClick={() => setSelectedChapter(ch.slug)}
                className={cn(
                  "rounded-[8px] border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                  selectedChapter === ch.slug
                    ? "border-brand bg-brand-light text-brand-accent"
                    : "border-border bg-surface-muted text-ink hover:bg-surface-secondary"
                )}
              >
                {String(ch.number).padStart(2, "0")}. {ch.shortTitle}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-ink">
            2. Choose Question Format
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUESTION_TYPES.map((typeItem) => (
              <button
                key={typeItem.id}
                type="button"
                onClick={() => setSelectedType(typeItem.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                  selectedType === typeItem.id
                    ? "border-brand bg-brand-light text-brand-accent"
                    : "border-border bg-surface-muted text-ink-secondary hover:text-ink"
                )}
              >
                {typeItem.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">{quizTitle}</p>
            <p className="text-xs text-ink-secondary">
              {activeQuestions.length} question
              {activeQuestions.length === 1 ? "" : "s"} matched · Answers are
              verified after submission.
            </p>
          </div>

          <Button
            type="button"
            onClick={startQuiz}
            disabled={activeQuestions.length === 0}
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            <span>Start Practice ({activeQuestions.length})</span>
          </Button>
        </div>

        {activeQuestions.length === 0 ? (
          <EmptyState
            title="No questions in this exact filter combination"
            description="Try selecting All Formats for this chapter to practice every question available for that topic."
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedType("all")}
              >
                Show All Formats
              </Button>
            }
          />
        ) : null}
      </div>

      {/* Real Local Quiz History */}
      <div className="rounded-[12px] border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-brand-accent" aria-hidden="true" />
            <h2 className="text-base font-semibold text-ink">
              Your Recent Practice Results
            </h2>
          </div>

          {hydrated && metrics.quizAttemptsCount > 0 ? (
            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-secondary">
              <span>
                Attempts:{" "}
                <strong className="text-ink">
                  {metrics.quizAttemptsCount}
                </strong>
              </span>
              <span>
                Latest:{" "}
                <strong className="text-ink">
                  {metrics.latestQuizScore}%
                </strong>
              </span>
              <span>
                Best:{" "}
                <strong className="text-success">
                  {metrics.bestQuizScore}%
                </strong>
              </span>
            </div>
          ) : null}
        </div>

        {!hydrated || progress.quizAttempts.length === 0 ? (
          <div className="mt-4 flex items-center gap-3 rounded-[10px] border border-border bg-surface-muted p-4 text-sm text-ink-secondary">
            <CheckSquare className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
            <span>
              No completed quiz attempts recorded yet. Start any practice set
              above to track your scores locally.
            </span>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-[10px] border border-border">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-border bg-surface-muted text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                <tr>
                  <th className="px-4 py-2.5">Quiz</th>
                  <th className="px-4 py-2.5">Format</th>
                  <th className="px-4 py-2.5">Score</th>
                  <th className="px-4 py-2.5">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {progress.quizAttempts.slice(0, 8).map((attempt) => (
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
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          attempt.scorePercentage >= 70
                            ? "bg-success-bg text-success"
                            : "bg-warning-bg text-warning"
                        }`}
                      >
                        {attempt.scorePercentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

