"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  ASSISTANT_STORAGE_KEY,
  clearAssistantStorage,
  createInitialAssistantState,
  loadAssistantStorage,
  saveAssistantStorage,
} from "@/lib/storage/assistant";
import type { AssistantStorageState } from "@/types/storage";

const SERVER_SNAPSHOT: AssistantStorageState = createInitialAssistantState();

let cachedSnapshot: AssistantStorageState | null = null;
const listeners = new Set<() => void>();

function getClientSnapshot(): AssistantStorageState {
  if (!cachedSnapshot) {
    cachedSnapshot = loadAssistantStorage();
  }
  return cachedSnapshot;
}

function getServerSnapshot(): AssistantStorageState {
  return SERVER_SNAPSHOT;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === ASSISTANT_STORAGE_KEY || event.key === null) {
      cachedSnapshot = null;
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useAssistantHistory() {
  const state = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const setState = useCallback(
    (
      updater:
        | AssistantStorageState
        | ((prev: AssistantStorageState) => AssistantStorageState)
    ) => {
      const current = loadAssistantStorage();
      const next = typeof updater === "function" ? updater(current) : updater;
      saveAssistantStorage(next);
      cachedSnapshot = next;
      listeners.forEach((fn) => fn());
    },
    []
  );

  const clearAll = useCallback(() => {
    clearAssistantStorage();
    cachedSnapshot = createInitialAssistantState();
    listeners.forEach((fn) => fn());
  }, []);

  return {
    conversations: state.conversations,
    activeId: state.activeConversationId,
    setState,
    clearAll,
  };
}

