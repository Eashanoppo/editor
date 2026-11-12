import { z } from "zod";
import { STORAGE_SCHEMA_VERSION, type AssistantStorageState } from "@/types/storage";
import type { ChatConversation } from "@/types/assistant";
import { generateId } from "@/lib/utils";

export const ASSISTANT_STORAGE_KEY = "python_learning_assistant_v1";
const MAX_CONVERSATIONS = 20;
const MAX_MESSAGES_PER_CONVERSATION = 40;

const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  createdAt: z.string(),
});

const conversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  messages: z.array(chatMessageSchema),
  chapterContext: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const assistantStateSchema = z.object({
  version: z.number().int(),
  conversations: z.array(conversationSchema),
  activeConversationId: z.string().nullable(),
});

export function createNewConversation(
  chapterContext?: string
): ChatConversation {
  const now = new Date().toISOString();
  return {
    id: generateId("conv"),
    title: "New Python Chat",
    messages: [],
    chapterContext,
    createdAt: now,
    updatedAt: now,
  };
}

export function createInitialAssistantState(): AssistantStorageState {
  return {
    version: STORAGE_SCHEMA_VERSION,
    conversations: [],
    activeConversationId: null,
  };
}

export function loadAssistantStorage(): AssistantStorageState {
  if (typeof window === "undefined") {
    return createInitialAssistantState();
  }
  try {
    const raw = window.localStorage.getItem(ASSISTANT_STORAGE_KEY);
    if (!raw) return createInitialAssistantState();
    const parsed = assistantStateSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return createInitialAssistantState();
    return {
      version: STORAGE_SCHEMA_VERSION,
      conversations: parsed.data.conversations
        .slice(0, MAX_CONVERSATIONS)
        .map((c) => ({
          ...c,
          messages: c.messages.slice(-MAX_MESSAGES_PER_CONVERSATION),
        })),
      activeConversationId: parsed.data.activeConversationId,
    };
  } catch {
    return createInitialAssistantState();
  }
}

export function saveAssistantStorage(state: AssistantStorageState): boolean {
  if (typeof window === "undefined") return false;
  try {
    const trimmed: AssistantStorageState = {
      version: STORAGE_SCHEMA_VERSION,
      conversations: state.conversations
        .slice(0, MAX_CONVERSATIONS)
        .map((c) => ({
          ...c,
          messages: c.messages.slice(-MAX_MESSAGES_PER_CONVERSATION),
        })),
      activeConversationId: state.activeConversationId,
    };
    window.localStorage.setItem(ASSISTANT_STORAGE_KEY, JSON.stringify(trimmed));
    return true;
  } catch {
    return false;
  }
}

export function clearAssistantStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ASSISTANT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function deriveConversationTitle(firstPrompt: string): string {
  const clean = firstPrompt.trim().replace(/\s+/g, " ");
  if (clean.length <= 38) return clean || "Python Question";
  return `${clean.slice(0, 35)}...`;
}

