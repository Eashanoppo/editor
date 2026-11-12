export const USER_GROQ_KEY_STORAGE_KEY = "python_learning_user_groq_key_v1";
export const VOICE_PREFS_STORAGE_KEY = "python_learning_voice_prefs_v1";

export interface AssistantSettingsSnapshot {
  userApiKey: string;
  autoSpeak: boolean;
  voiceName: string;
}

export const DEFAULT_ASSISTANT_SETTINGS: AssistantSettingsSnapshot = {
  userApiKey: "",
  autoSpeak: true,
  voiceName: "",
};

export function loadUserGroqKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return (window.localStorage.getItem(USER_GROQ_KEY_STORAGE_KEY) ?? "").trim();
  } catch {
    return "";
  }
}

export function saveUserGroqKey(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const trimmed = key.trim();
    if (!trimmed) {
      window.localStorage.removeItem(USER_GROQ_KEY_STORAGE_KEY);
    } else {
      window.localStorage.setItem(USER_GROQ_KEY_STORAGE_KEY, trimmed);
    }
    return true;
  } catch {
    return false;
  }
}

export function loadVoicePrefs(): { autoSpeak: boolean; voiceName: string } {
  if (typeof window === "undefined") {
    return {
      autoSpeak: DEFAULT_ASSISTANT_SETTINGS.autoSpeak,
      voiceName: DEFAULT_ASSISTANT_SETTINGS.voiceName,
    };
  }
  try {
    const raw = window.localStorage.getItem(VOICE_PREFS_STORAGE_KEY);
    if (!raw) {
      return {
        autoSpeak: DEFAULT_ASSISTANT_SETTINGS.autoSpeak,
        voiceName: DEFAULT_ASSISTANT_SETTINGS.voiceName,
      };
    }
    const parsed = JSON.parse(raw) as Partial<{
      autoSpeak: unknown;
      voiceName: unknown;
    }>;
    return {
      autoSpeak:
        typeof parsed.autoSpeak === "boolean"
          ? parsed.autoSpeak
          : DEFAULT_ASSISTANT_SETTINGS.autoSpeak,
      voiceName: typeof parsed.voiceName === "string" ? parsed.voiceName : "",
    };
  } catch {
    return {
      autoSpeak: DEFAULT_ASSISTANT_SETTINGS.autoSpeak,
      voiceName: DEFAULT_ASSISTANT_SETTINGS.voiceName,
    };
  }
}

export function saveVoicePrefs(prefs: {
  autoSpeak: boolean;
  voiceName: string;
}): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(VOICE_PREFS_STORAGE_KEY, JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
}

