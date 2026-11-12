"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_ASSISTANT_SETTINGS,
  USER_GROQ_KEY_STORAGE_KEY,
  VOICE_PREFS_STORAGE_KEY,
  loadUserGroqKey,
  loadVoicePrefs,
  saveUserGroqKey,
  saveVoicePrefs,
  type AssistantSettingsSnapshot,
} from "@/lib/storage/groqKey";

let cachedSnapshot: AssistantSettingsSnapshot | null = null;
const listeners = new Set<() => void>();

function readSnapshot(): AssistantSettingsSnapshot {
  const voice = loadVoicePrefs();
  return {
    userApiKey: loadUserGroqKey(),
    autoSpeak: voice.autoSpeak,
    voiceName: voice.voiceName,
  };
}

function getClientSnapshot(): AssistantSettingsSnapshot {
  if (!cachedSnapshot) {
    cachedSnapshot = readSnapshot();
  }
  return cachedSnapshot;
}

function getServerSnapshot(): AssistantSettingsSnapshot {
  return DEFAULT_ASSISTANT_SETTINGS;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === USER_GROQ_KEY_STORAGE_KEY ||
      event.key === VOICE_PREFS_STORAGE_KEY ||
      event.key === null
    ) {
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

function emit() {
  cachedSnapshot = readSnapshot();
  listeners.forEach((fn) => fn());
}

export function useAssistantSettings() {
  const settings = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const setUserApiKey = useCallback((key: string) => {
    saveUserGroqKey(key);
    emit();
  }, []);

  const clearUserApiKey = useCallback(() => {
    saveUserGroqKey("");
    emit();
  }, []);

  const setAutoSpeak = useCallback((autoSpeak: boolean) => {
    const current = loadVoicePrefs();
    saveVoicePrefs({ ...current, autoSpeak });
    emit();
  }, []);

  const setVoiceName = useCallback((voiceName: string) => {
    const current = loadVoicePrefs();
    saveVoicePrefs({ ...current, voiceName });
    emit();
  }, []);

  return {
    userApiKey: settings.userApiKey,
    autoSpeak: settings.autoSpeak,
    voiceName: settings.voiceName,
    setUserApiKey,
    clearUserApiKey,
    setAutoSpeak,
    setVoiceName,
  };
}

