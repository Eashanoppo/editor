import type { QuizAttemptRecord } from "./quiz";
import type { ChatConversation } from "./assistant";

export const STORAGE_SCHEMA_VERSION = 1;

export interface PracticeActivityRecord {
  questionId: string;
  chapterSlug: string;
  isCorrect: boolean;
  attemptedAt: string;
}

export interface UserPreferences {
  lastVisitedChapter?: string;
}

export interface LearningProgressState {
  version: number;
  completedChapters: string[]; // chapter slugs
  completedLessons: string[]; // lesson/chapter slugs marked complete
  quickPracticeCompleted: Record<string, boolean>; // quick practice IDs
  quizAttempts: QuizAttemptRecord[];
  practiceActivities: PracticeActivityRecord[];
  preferences: UserPreferences;
  updatedAt: string;
}

export interface AssistantStorageState {
  version: number;
  conversations: ChatConversation[];
  activeConversationId: string | null;
}

