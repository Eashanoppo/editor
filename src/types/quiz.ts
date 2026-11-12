export type QuestionType =
  | "mcq"
  | "true_false"
  | "fill_blank"
  | "predict_output"
  | "find_error"
  | "coding_challenge";

export interface BaseQuizQuestion {
  id: string;
  chapterSlug: string;
  chapterNumber: number;
  chapterTitle: string;
  type: QuestionType;
  prompt: string;
  code?: string;
  explanation: string;
}

export interface ChoiceQuizQuestion extends BaseQuizQuestion {
  type: "mcq" | "true_false" | "predict_output" | "find_error";
  options: string[];
  correctIndex: number;
}

export interface FillBlankQuizQuestion extends BaseQuizQuestion {
  type: "fill_blank";
  codeTemplate: string;
  acceptedAnswers: string[];
  caseSensitive?: boolean;
  hint?: string;
}

export interface CodingChallengeQuestion extends BaseQuizQuestion {
  type: "coding_challenge";
  starterCode: string;
  expectedOutput: string;
  /** Optional Python assertion code appended during verification */
  testCode?: string;
  sampleSolution: string;
}

export type QuizQuestion =
  | ChoiceQuizQuestion
  | FillBlankQuizQuestion
  | CodingChallengeQuestion;

export interface QuestionAttemptResult {
  questionId: string;
  isCorrect: boolean;
  userAnswer: string;
}

export interface QuizAttemptRecord {
  id: string;
  quizId: string;
  quizTitle: string;
  chapterSlug: string; // "all" or specific chapter slug
  categoryLabel: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  completedAt: string;
}

