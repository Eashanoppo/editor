"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { PythonCodeView } from "@/components/common/PythonCodeView";
import { InteractiveTerminalInput } from "@/components/playground/InteractiveTerminalInput";
import { PythonEditor } from "@/components/playground/PythonEditor";
import { Button } from "@/components/ui/button";
import { usePyodide } from "@/hooks/usePyodide";
import { cn } from "@/lib/utils";
import type { QuestionAttemptResult, QuizQuestion } from "@/types/quiz";

interface QuestionCardProps {
  question: QuizQuestion;
  isLast: boolean;
  onAnswered: (result: QuestionAttemptResult) => void;
  onNext: () => void;
}

export function QuestionCard({
  question,
  isLast,
  onAnswered,
  onNext,
}: QuestionCardProps) {
  const { runCode, runtimeState, streamingStdout, pendingInput, submitInput } =
    usePyodide();

  // State for choice-based questions
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  // State for fill_blank
  const [blankInput, setBlankInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  // State for coding_challenge
  const [challengeCode, setChallengeCode] = useState(
    question.type === "coding_challenge" ? question.starterCode : ""
  );
  const [challengeOutput, setChallengeOutput] = useState<string>("");
  const [challengeError, setChallengeError] = useState<string>("");
  const [runningCode, setRunningCode] = useState(false);

  // Submission state
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleChoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      question.type === "fill_blank" ||
      question.type === "coding_challenge" ||
      selectedOption === null
    ) {
      return;
    }
    const correct = selectedOption === question.correctIndex;
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswered({
      questionId: question.id,
      isCorrect: correct,
      userAnswer: question.options[selectedOption] ?? "",
    });
  };

  const handleBlankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.type !== "fill_blank" || !blankInput.trim()) return;
    const cleaned = blankInput.trim();
    const correct = question.acceptedAnswers.some((accepted) =>
      question.caseSensitive
        ? cleaned === accepted
        : cleaned.toLowerCase() === accepted.toLowerCase()
    );
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswered({
      questionId: question.id,
      isCorrect: correct,
      userAnswer: cleaned,
    });
  };

  const handleCodingChallengeRun = async () => {
    if (question.type !== "coding_challenge" || runningCode) return;
    setRunningCode(true);
    setChallengeError("");
    setChallengeOutput("");

    const fullCode = question.testCode
      ? `${challengeCode}\n${question.testCode}`
      : challengeCode;

    const result = await runCode(fullCode, 5000);
    setRunningCode(false);

    const actualStdout = result.stdout.replace(/\r\n/g, "\n").trim();
    const expected = question.expectedOutput.replace(/\r\n/g, "\n").trim();

    setChallengeOutput(actualStdout);
    if (result.error || result.stderr) {
      setChallengeError(result.error || result.stderr);
    }

    const passed =
      result.status === "completed" &&
      !result.error &&
      !result.stderr &&
      actualStdout === expected;

    setIsCorrect(passed);
    setSubmitted(true);
    onAnswered({
      questionId: question.id,
      isCorrect: passed,
      userAnswer: challengeCode,
    });
  };

  const canAdvance = submitted;

  return (
    <div className="rounded-[12px] border border-border bg-surface p-5 sm:p-6">
      <h2 className="text-[18px] font-semibold leading-snug text-ink sm:text-[20px]">
        {question.prompt}
      </h2>

      {/* Static code block for predict_output / find_error / mcq */}
      {question.code ? (
        <div className="mt-4 overflow-hidden rounded-[8px] border border-border">
          <PythonCodeView code={question.code} showLineNumbers />
        </div>
      ) : null}

      {/* Choice Questions: MCQ, True/False, Predict Output, Find Error */}
      {(question.type === "mcq" ||
        question.type === "true_false" ||
        question.type === "predict_output" ||
        question.type === "find_error") && (
        <form onSubmit={handleChoiceSubmit} className="mt-5 space-y-4">
          <div className="space-y-2.5" role="radiogroup" aria-label={question.prompt}>
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const showCorrect = submitted && idx === question.correctIndex;
              const showWrong =
                submitted && isSelected && idx !== question.correctIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={submitted}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedOption(idx)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-[8px] border px-4 py-3 text-left text-sm transition-colors cursor-pointer disabled:cursor-default",
                    !submitted && isSelected
                      ? "border-brand bg-brand-light font-medium text-ink"
                      : !submitted
                        ? "border-border bg-surface-muted text-ink hover:bg-surface-secondary"
                        : showCorrect
                          ? "border-success-border bg-success-bg font-medium text-success"
                          : showWrong
                            ? "border-error-border bg-error-bg text-error"
                            : "border-border bg-surface text-ink-secondary"
                  )}
                >
                  <span className="whitespace-pre-wrap font-mono text-[13.5px]">
                    {option}
                  </span>
                  {showCorrect ? (
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                  ) : showWrong ? (
                    <XCircle
                      className="h-4 w-4 shrink-0 text-error"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          {!submitted ? (
            <Button type="submit" disabled={selectedOption === null}>
              Submit Answer
            </Button>
          ) : null}
        </form>
      )}

      {/* Fill in the Blanks */}
      {question.type === "fill_blank" && (
        <form onSubmit={handleBlankSubmit} className="mt-5 space-y-4">
          <div className="overflow-hidden rounded-[8px] border border-border">
            <PythonCodeView code={question.codeTemplate} />
          </div>

          <div>
            <label
              htmlFor={`blank-${question.id}`}
              className="block text-xs font-medium text-ink-secondary"
            >
              Type what replaces <code className="font-mono text-ink">____</code>
            </label>
            <input
              id={`blank-${question.id}`}
              type="text"
              value={blankInput}
              disabled={submitted}
              onChange={(e) => setBlankInput(e.target.value)}
              placeholder="Enter missing Python keyword or function..."
              className="mt-1.5 h-10 w-full max-w-sm rounded-[8px] border border-border bg-surface px-3.5 font-mono text-sm text-ink placeholder:font-sans placeholder:text-ink-muted focus:border-brand-accent focus:outline-none disabled:bg-surface-muted"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!submitted ? (
              <Button type="submit" disabled={!blankInput.trim()}>
                Submit Answer
              </Button>
            ) : null}
            {question.hint && !submitted ? (
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="text-xs font-medium text-brand-accent hover:underline cursor-pointer"
              >
                {showHint ? "Hide Hint" : "Need a hint?"}
              </button>
            ) : null}
          </div>

          {showHint && question.hint && !submitted ? (
            <p className="rounded-[8px] border border-border bg-surface-muted px-3.5 py-2.5 text-xs text-ink-secondary">
              Hint: {question.hint}
            </p>
          ) : null}
        </form>
      )}

      {/* Coding Challenge */}
      {question.type === "coding_challenge" && (
        <div className="mt-5 space-y-4">
          <div className="rounded-[8px] border border-border bg-surface-muted px-3.5 py-2.5 text-xs text-ink-secondary">
            Expected output:{" "}
            <code className="rounded border border-border bg-surface px-2 py-0.5 font-mono font-semibold text-ink">
              {question.expectedOutput}
            </code>
          </div>

          <div className="overflow-hidden rounded-[8px] border border-border">
            <PythonEditor
              value={challengeCode}
              onChange={setChallengeCode}
              onRunShortcut={handleCodingChallengeRun}
              minHeight="160px"
              ariaLabel="Coding challenge Python editor"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              onClick={handleCodingChallengeRun}
              disabled={runningCode || runtimeState === "loading"}
            >
              {runningCode || runtimeState === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>
                    {runtimeState === "loading"
                      ? "Loading Python..."
                      : "Running Tests..."}
                  </span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" aria-hidden="true" />
                  <span>Run & Check Solution</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setChallengeCode(question.starterCode);
                setChallengeOutput("");
                setChallengeError("");
              }}
            >
              <RotateCcw className="h-3.5 w-3.5 text-ink-secondary" aria-hidden="true" />
              <span>Reset Starter</span>
            </Button>
          </div>

          {runningCode && (streamingStdout || pendingInput) ? (
            <div className="rounded-[8px] border border-border bg-surface-muted p-3.5">
              <InteractiveTerminalInput
                streamingStdout={streamingStdout}
                pendingInput={pendingInput}
                onSubmitInput={submitInput}
              />
            </div>
          ) : null}

          {(challengeOutput || challengeError) && (
            <div className="rounded-[8px] border border-border bg-surface-muted p-3.5">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
                Your Program Output
              </p>
              {challengeOutput ? (
                <pre className="font-mono text-xs text-ink">
                  {challengeOutput}
                </pre>
              ) : null}
              {challengeError ? (
                <pre className="mt-1 font-mono text-xs text-error whitespace-pre-wrap">
                  {challengeError}
                </pre>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Feedback Panel (shown only after submission) */}
      {submitted ? (
        <div
          aria-live="polite"
          className={cn(
            "mt-6 rounded-[10px] border p-4 text-sm",
            isCorrect
              ? "border-success-border bg-success-bg text-success"
              : "border-error-border bg-error-bg text-error-strong"
          )}
        >
          <div className="flex items-center gap-2 font-semibold">
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                <span>Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 shrink-0 text-error" aria-hidden="true" />
                <span>
                  Incorrect
                  {question.type === "fill_blank"
                    ? ` — Expected answer: ${question.acceptedAnswers[0]}`
                    : question.type !== "coding_challenge"
                      ? ` — Correct answer: ${question.options[question.correctIndex]}`
                      : ` — Expected output: ${question.expectedOutput}`}
                </span>
              </>
            )}
          </div>
          <p className="mt-1.5 leading-relaxed">{question.explanation}</p>

          {question.type === "coding_challenge" && !isCorrect ? (
            <div className="mt-3 overflow-hidden rounded-[8px] border border-error-border bg-surface">
              <div className="border-b border-error-border bg-error-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-error">
                Example Working Solution
              </div>
              <PythonCodeView code={question.sampleSolution} />
            </div>
          ) : null}
        </div>
      ) : null}

      {canAdvance ? (
        <div className="mt-5 flex justify-end">
          <Button type="button" onClick={onNext}>
            <span>{isLast ? "View Final Score" : "Next Question"}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

