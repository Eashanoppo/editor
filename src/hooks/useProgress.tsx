"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  calculateProgressMetrics,
  clearProgressStorage,
  createInitialProgressState,
  loadProgressFromStorage,
  mergePracticeActivity,
  prependQuizAttempt,
  PROGRESS_STORAGE_KEY,
  saveProgressToStorage,
  type ProgressMetrics,
} from "@/lib/storage/progress";
import type { QuizAttemptRecord } from "@/types/quiz";
import type { LearningProgressState } from "@/types/storage";

interface ProgressSnapshot {
  state: LearningProgressState;
  storageAvailable: boolean;
}

const SERVER_SNAPSHOT: ProgressSnapshot = {
  state: createInitialProgressState(),
  storageAvailable: true,
};

let cachedClientSnapshot: ProgressSnapshot | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  cachedClientSnapshot = null;
  listeners.forEach((listener) => listener());
}

function getClientSnapshot(): ProgressSnapshot {
  if (!cachedClientSnapshot) {
    cachedClientSnapshot = loadProgressFromStorage();
  }
  return cachedClientSnapshot;
}

function getServerSnapshot(): ProgressSnapshot {
  return SERVER_SNAPSHOT;
}

function subscribeProgress(callback: () => void): () => void {
  listeners.add(callback);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === PROGRESS_STORAGE_KEY || event.key === null) {
      cachedClientSnapshot = null;
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function subscribeHydration(): () => void {
  return () => {};
}

interface ProgressContextValue {
  progress: LearningProgressState;
  metrics: ProgressMetrics;
  hydrated: boolean;
  storageAvailable: boolean;
  isChapterCompleted: (slug: string) => boolean;
  toggleChapterCompletion: (slug: string) => void;
  markChapterCompleted: (slug: string, completed: boolean) => void;
  recordQuickPractice: (
    questionId: string,
    chapterSlug: string,
    isCorrect: boolean
  ) => void;
  recordQuizAttempt: (attempt: QuizAttemptRecord) => void;
  setLastVisitedChapter: (slug: string) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeProgress,
    getClientSnapshot,
    getServerSnapshot
  );

  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false
  );

  const progress = snapshot.state;
  const storageAvailable = snapshot.storageAvailable;

  const updateProgress = useCallback(
    (updater: (prev: LearningProgressState) => LearningProgressState) => {
      const current = loadProgressFromStorage().state;
      const next = updater(current);
      const saved = saveProgressToStorage(next);
      cachedClientSnapshot = {
        state: {
          ...next,
          updatedAt: new Date().toISOString(),
        },
        storageAvailable: saved,
      };
      listeners.forEach((listener) => listener());
    },
    []
  );

  const isChapterCompleted = useCallback(
    (slug: string) => progress.completedChapters.includes(slug),
    [progress.completedChapters]
  );

  const markChapterCompleted = useCallback(
    (slug: string, completed: boolean) => {
      updateProgress((prev) => {
        const nextChapters = completed
          ? Array.from(new Set([...prev.completedChapters, slug]))
          : prev.completedChapters.filter((item) => item !== slug);
        const nextLessons = completed
          ? Array.from(new Set([...prev.completedLessons, slug]))
          : prev.completedLessons.filter((item) => item !== slug);
        return {
          ...prev,
          completedChapters: nextChapters,
          completedLessons: nextLessons,
        };
      });
    },
    [updateProgress]
  );

  const toggleChapterCompletion = useCallback(
    (slug: string) => {
      const currentlyDone = progress.completedChapters.includes(slug);
      markChapterCompleted(slug, !currentlyDone);
    },
    [markChapterCompleted, progress.completedChapters]
  );

  const recordQuickPractice = useCallback(
    (questionId: string, chapterSlug: string, isCorrect: boolean) => {
      updateProgress((prev) => ({
        ...prev,
        quickPracticeCompleted: {
          ...prev.quickPracticeCompleted,
          [questionId]:
            isCorrect || Boolean(prev.quickPracticeCompleted[questionId]),
        },
        practiceActivities: mergePracticeActivity(prev.practiceActivities, {
          questionId,
          chapterSlug,
          isCorrect,
          attemptedAt: new Date().toISOString(),
        }),
      }));
    },
    [updateProgress]
  );

  const recordQuizAttempt = useCallback(
    (attempt: QuizAttemptRecord) => {
      updateProgress((prev) => ({
        ...prev,
        quizAttempts: prependQuizAttempt(prev.quizAttempts, attempt),
      }));
    },
    [updateProgress]
  );

  const setLastVisitedChapter = useCallback(
    (slug: string) => {
      updateProgress((prev) => {
        if (prev.preferences.lastVisitedChapter === slug) return prev;
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            lastVisitedChapter: slug,
          },
        };
      });
    },
    [updateProgress]
  );

  const resetProgress = useCallback(() => {
    clearProgressStorage();
    notifyListeners();
  }, []);

  const metrics = useMemo(() => calculateProgressMetrics(progress), [progress]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      metrics,
      hydrated,
      storageAvailable,
      isChapterCompleted,
      toggleChapterCompletion,
      markChapterCompleted,
      recordQuickPractice,
      recordQuizAttempt,
      setLastVisitedChapter,
      resetProgress,
    }),
    [
      progress,
      metrics,
      hydrated,
      storageAvailable,
      isChapterCompleted,
      toggleChapterCompletion,
      markChapterCompleted,
      recordQuickPractice,
      recordQuizAttempt,
      setLastVisitedChapter,
      resetProgress,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used inside a ProgressProvider");
  }
  return ctx;
}
