"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { formatReplyForSpeech, splitSpeechChunks } from "@/lib/ai/speech";

const EMPTY_VOICES: SpeechSynthesisVoice[] = [];
let cachedVoices: SpeechSynthesisVoice[] = EMPTY_VOICES;
let voiceListenersInitialized = false;
const voiceSubscribers = new Set<() => void>();

function refreshVoicesSnapshot() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    cachedVoices = EMPTY_VOICES;
    return;
  }
  const next = window.speechSynthesis.getVoices();
  cachedVoices = next.length > 0 ? next : EMPTY_VOICES;
  voiceSubscribers.forEach((fn) => fn());
}

function subscribeVoices(callback: () => void): () => void {
  voiceSubscribers.add(callback);
  if (
    !voiceListenersInitialized &&
    typeof window !== "undefined" &&
    "speechSynthesis" in window
  ) {
    voiceListenersInitialized = true;
    window.speechSynthesis.addEventListener("voiceschanged", refreshVoicesSnapshot);
  }
  return () => {
    voiceSubscribers.delete(callback);
  };
}

function getVoicesClientSnapshot(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return EMPTY_VOICES;
  }
  if (cachedVoices.length === 0) {
    const list = window.speechSynthesis.getVoices();
    if (list.length > 0) {
      cachedVoices = list;
    }
  }
  return cachedVoices;
}

function getVoicesServerSnapshot(): SpeechSynthesisVoice[] {
  return EMPTY_VOICES;
}

const emptySubscribe = () => () => {};

function useSpeechApiSupported(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () =>
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      typeof SpeechSynthesisUtterance !== "undefined",
    () => false
  );
}

export function useSpeechSynthesis() {
  const isSupported = useSpeechApiSupported();
  const voices = useSyncExternalStore(
    subscribeVoices,
    getVoicesClientSnapshot,
    getVoicesServerSnapshot
  );

  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const sessionRef = useRef(0);

  const stop = useCallback(() => {
    sessionRef.current += 1;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    (
      rawMarkdown: string,
      options?: { messageId?: string; voiceName?: string; rate?: number }
    ) => {
      if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window) ||
        typeof SpeechSynthesisUtterance === "undefined"
      ) {
        return;
      }

      const spokenText = formatReplyForSpeech(rawMarkdown);
      const chunks = splitSpeechChunks(spokenText);
      if (chunks.length === 0) return;

      const nextSession = sessionRef.current + 1;
      sessionRef.current = nextSession;

      window.speechSynthesis.cancel();
      setSpeakingId(options?.messageId ?? "__active__");

      const availableVoices = window.speechSynthesis.getVoices();
      const selectedVoice = options?.voiceName
        ? availableVoices.find((v) => v.name === options.voiceName)
        : availableVoices.find((v) => v.default && v.lang.startsWith("en")) ??
          availableVoices.find((v) => v.lang.startsWith("en")) ??
          availableVoices[0];

      let index = 0;

      const speakNext = () => {
        if (sessionRef.current !== nextSession) return;
        if (index >= chunks.length) {
          setSpeakingId(null);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunks[index]);
        index += 1;

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        } else {
          utterance.lang = "en-US";
        }
        utterance.rate = options?.rate ?? 1;
        utterance.pitch = 1;

        utterance.onend = () => {
          if (sessionRef.current !== nextSession) return;
          speakNext();
        };
        utterance.onerror = () => {
          if (sessionRef.current !== nextSession) return;
          setSpeakingId(null);
        };

        window.speechSynthesis.speak(utterance);
      };

      speakNext();
    },
    []
  );

  useEffect(() => {
    return () => {
      sessionRef.current += 1;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isSupported,
    voices,
    isSpeaking: speakingId !== null,
    speakingId,
    speak,
    stop,
  };
}

