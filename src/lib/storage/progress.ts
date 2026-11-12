import { z } from "zod";
import { CHAPTERS, TOTAL_CHAPTERS } from "@/data/chapters";
import {
  STORAGE_SCHEMA_VERSION,
  type LearningProgressState,
  type PracticeActivityRecord,
} from "@/types/storage";
import type { QuizAttemptRecord } from "@/types/quiz";

export const PROGRESS_STORAGE_KEY = "python_learning_progress_v1";

const VALID_CHAPTER_SLUGS = new Set(CHAPTERS.map((c) => c.slug));

const quizAttemptSchema = z.object({
  id: z.string(),
  quizId: z.string(),
  quizTitle: z.string(),
  chapterSlug: z.string(),
  categoryLabel: z.string(),
  totalQuestions: z.number().int().min(1),
  correctAnswers: z.number().int().min(0),
  scorePercentage: z.number().min(0).max(100),
  completedAt: z.string(),
});

const practiceActivitySchema = z.object({
  questionId: z.string(),
  chapterSlug: z.string(),
  isCorrect: z.boolean(),
  attemptedAt: z.string(),
});

const progressStateSchema = z.object({
  version: z.number().int(),
  completedChapters: z.array(z.string()),
  completedLessons: z.array(z.string()),
  quickPracticeCompleted: z.record(z.string(), z.boolean()),
  quizAttempts: z.array(quizAttemptSchema),
  practiceActivities: z.array(practiceActivitySchema),
  preferences: z.object({
    lastVisitedChapter: z.string().optional(),
  }),
  updatedAt: z.string(),
});

export function createInitialProgressState(): LearningProgressState {
  return {
    version: STORAGE_SCHEMA_VERSION,
    completedChapters: [],
    completedLessons: [],
    quickPracticeCompleted: {},
    quizAttempts: [],
    practiceActivities: [],
    preferences: {},
    updatedAt: new Date(0).toISOString(),
  };
}

function migrateProgress(raw: unknown): LearningProgressState {
  const initial = createInitialProgressState();
  if (!raw || typeof raw !== "object") {
    return initial;
  }

  const parsed = progressStateSchema.safeParse(raw);
  if (!parsed.success) {
    return initial;
  }

  const data = parsed.data;
  // Filter to canonical chapter slugs to guard against stale data
  const validCompletedChapters = Array.from(
    new Set(data.completedChapters.filter((slug) => VALID_CHAPTER_SLUGS.has(slug)))
  );
  const validCompletedLessons = Array.from(
    new Set(data.completedLessons.filter((slug) => VALID_CHAPTER_SLUGS.has(slug)))
  );

  return {
    version: STORAGE_SCHEMA_VERSION,
    completedChapters: validCompletedChapters,
    completedLessons: validCompletedLessons,
    quickPracticeCompleted: data.quickPracticeCompleted,
    quizAttempts: data.quizAttempts.slice(0, 100),
    practiceActivities: data.practiceActivities.slice(0, 250),
    preferences: {
      lastVisitedChapter:
        data.preferences.lastVisitedChapter &&
        VALID_CHAPTER_SLUGS.has(data.preferences.lastVisitedChapter)
          ? data.preferences.lastVisitedChapter
          : undefined,
    },
    updatedAt: data.updatedAt,
  };
}

export function loadProgressFromStorage(): {
  state: LearningProgressState;
  storageAvailable: boolean;
} {
  if (typeof window === "undefined") {
    return { state: createInitialProgressState(), storageAvailable: true };
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return { state: createInitialProgressState(), storageAvailable: true };
    }
    const parsed = JSON.parse(raw) as unknown;
    return { state: migrateProgress(parsed), storageAvailable: true };
  } catch {
    return { state: createInitialProgressState(), storageAvailable: false };
  }
}

export function saveProgressToStorage(state: LearningProgressState): boolean {
  if (typeof window === "undefined") return false;
  try {
    const payload: LearningProgressState = {
      ...state,
      version: STORAGE_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function clearProgressStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export interface ProgressMetrics {
  totalChapters: number;
  completedChaptersCount: number;
  totalLessons: number;
  completedLessonsCount: number;
  learningPercentage: number;
  quizAttemptsCount: number;
  averageQuizScore: number | null;
  latestQuizScore: number | null;
  bestQuizScore: number | null;
  quickPracticeCount: number;
  practiceActivitiesCompleted: number;
  hasAnyActivity: boolean;
}

export function calculateProgressMetrics(
  state: LearningProgressState
): ProgressMetrics {
  const completedChaptersCount = state.completedChapters.filter((s) =>
    VALID_CHAPTER_SLUGS.has(s)
  ).length;
  const completedLessonsCount = state.completedLessons.filter((s) =>
    VALID_CHAPTER_SLUGS.has(s)
  ).length;
  const learningPercentage =
    TOTAL_CHAPTERS > 0
      ? Math.round((completedChaptersCount / TOTAL_CHAPTERS) * 100)
      : 0;

  const quizAttemptsCount = state.quizAttempts.length;
  const averageQuizScore =
    quizAttemptsCount > 0
      ? Math.round(
          state.quizAttempts.reduce((sum, a) => sum + a.scorePercentage, 0) /
            quizAttemptsCount
        )
      : null;

  const latestQuizScore =
    quizAttemptsCount > 0 ? state.quizAttempts[0].scorePercentage : null;

  const bestQuizScore =
    quizAttemptsCount > 0
      ? Math.max(...state.quizAttempts.map((a) => a.scorePercentage))
      : null;

  const quickPracticeCount = Object.values(state.quickPracticeCompleted).filter(
    Boolean
  ).length;

  const practiceActivitiesCompleted = quizAttemptsCount + quickPracticeCount;
  const hasAnyActivity =
    completedChaptersCount > 0 ||
    completedLessonsCount > 0 ||
    practiceActivitiesCompleted > 0 ||
    state.practiceActivities.length > 0;

  return {
    totalChapters: TOTAL_CHAPTERS,
    completedChaptersCount,
    totalLessons: TOTAL_CHAPTERS,
    completedLessonsCount,
    learningPercentage,
    quizAttemptsCount,
    averageQuizScore,
    latestQuizScore,
    bestQuizScore,
    quickPracticeCount,
    practiceActivitiesCompleted,
    hasAnyActivity,
  };
}

export function mergePracticeActivity(
  existing: PracticeActivityRecord[],
  nextRecord: PracticeActivityRecord
): PracticeActivityRecord[] {
  const filtered = existing.filter(
    (item) => item.questionId !== nextRecord.questionId
  );
  return [nextRecord, ...filtered].slice(0, 250);
}

export function prependQuizAttempt(
  existing: QuizAttemptRecord[],
  attempt: QuizAttemptRecord
): QuizAttemptRecord[] {
  return [attempt, ...existing].slice(0, 100);
}

