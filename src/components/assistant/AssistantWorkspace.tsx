"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  History,
  KeyRound,
  MessageSquarePlus,
  Send,
  Sparkles,
  Square,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CHAPTERS } from "@/data/chapters";
import {
  createNewConversation,
  deriveConversationTitle,
} from "@/lib/storage/assistant";
import { useAssistantHistory } from "@/hooks/useAssistantHistory";
import { useAssistantSettings } from "@/hooks/useAssistantSettings";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { fetchAssistantStatus, streamAssistantReply } from "@/lib/ai/client";
import { ChatMessage } from "@/components/assistant/ChatMessage";
import { ConversationSidebar } from "@/components/assistant/ConversationSidebar";
import { generateId } from "@/lib/utils";
import type { AIErrorInfo, ChatConversation, ChatMessageItem } from "@/types/assistant";

const SUGGESTED_PROMPTS = [
  "Explain Python variables.",
  "What is the difference between = and ==?",
  "Explain Python strings with examples.",
  "Why is my Python code showing an error?",
  "Give me a practice question about operators.",
  "What is the difference between == and is?",
];

export function AssistantWorkspace() {
  const searchParams = useSearchParams();
  const initialPromptParam = searchParams.get("prompt") ?? "";

  return (
    <AssistantWorkspaceInner
      key={initialPromptParam}
      initialPrompt={initialPromptParam}
    />
  );
}

function AssistantWorkspaceInner({ initialPrompt }: { initialPrompt: string }) {
  const { conversations, activeId, setState, clearAll } =
    useAssistantHistory();
  const {
    userApiKey,
    autoSpeak,
    voiceName,
    setUserApiKey,
    clearUserApiKey,
    setAutoSpeak,
    setVoiceName,
  } = useAssistantSettings();
  const {
    isSupported: voiceSupported,
    voices,
    isSpeaking,
    speakingId,
    speak,
    stop: stopSpeech,
  } = useSpeechSynthesis();

  const [chapterContext, setChapterContext] = useState<string>("all");
  const [input, setInput] = useState(initialPrompt);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorInfo, setErrorInfo] = useState<AIErrorInfo | null>(null);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [keyDraft, setKeyDraft] = useState("");
  const [showKeyText, setShowKeyText] = useState(false);
  const [keySavedFlash, setKeySavedFlash] = useState(false);
  const [serverStatus, setServerStatus] = useState<{
    configured: boolean;
    model: string;
    provider: string;
  } | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechPrefsRef = useRef({ autoSpeak, voiceName });

  useEffect(() => {
    speechPrefsRef.current = { autoSpeak, voiceName };
  }, [autoSpeak, voiceName]);

  const isProviderReady = Boolean(userApiKey || serverStatus?.configured);

  useEffect(() => {
    let mounted = true;
    fetchAssistantStatus().then((status) => {
      if (mounted && status) setServerStatus(status);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = keyDraft.trim();
    if (!cleaned) return;
    setUserApiKey(cleaned);
    setKeyDraft("");
    setErrorInfo(null);
    setKeySavedFlash(true);
    setTimeout(() => setKeySavedFlash(false), 1800);
  };

  const handleClearKey = () => {
    clearUserApiKey();
    setKeyDraft("");
  };

  const activeConversation = useMemo(
    () =>
      conversations.find((c) => c.id === activeId) ??
      conversations[0] ??
      null,
    [conversations, activeId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages.length, isStreaming]);

  const handleNewConversation = () => {
    stopSpeech();
    if (isStreaming) {
      abortRef.current?.abort();
      setIsStreaming(false);
    }
    const fresh = createNewConversation(
      chapterContext === "all" ? undefined : chapterContext
    );
    setState((prev) => ({
      ...prev,
      conversations: [fresh, ...prev.conversations],
      activeConversationId: fresh.id,
    }));
    setErrorInfo(null);
    setHistoryDrawerOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    stopSpeech();
    if (isStreaming) {
      abortRef.current?.abort();
      setIsStreaming(false);
    }
    setState((prev) => ({
      ...prev,
      activeConversationId: id,
    }));
    setErrorInfo(null);
    setHistoryDrawerOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    setState((prev) => {
      const remaining = prev.conversations.filter((c) => c.id !== id);
      const nextActive =
        prev.activeConversationId === id
          ? (remaining[0]?.id ?? null)
          : prev.activeConversationId;
      return {
        ...prev,
        conversations: remaining,
        activeConversationId: nextActive,
      };
    });
  };

  const handleClearAll = () => {
    stopSpeech();
    if (isStreaming) {
      abortRef.current?.abort();
      setIsStreaming(false);
    }
    clearAll();
    setErrorInfo(null);
  };

  const sendMessage = async (textOverride?: string) => {
    const content = (textOverride ?? input).trim();
    if (!content || isStreaming) return;

    stopSpeech();
    setErrorInfo(null);
    if (!textOverride) setInput("");

    const now = new Date().toISOString();
    const userMsg: ChatMessageItem = {
      id: generateId("msg"),
      role: "user",
      content,
      createdAt: now,
    };
    const assistantMsgId = generateId("msg");
    const placeholderAssistant: ChatMessageItem = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      createdAt: now,
    };

    const existingConv = activeConversation;
    const convId = existingConv?.id ?? generateId("conv");
    const priorMessages = existingConv?.messages ?? [];

    const updatedConv: ChatConversation = existingConv
      ? {
          ...existingConv,
          title:
            existingConv.messages.length === 0
              ? deriveConversationTitle(content)
              : existingConv.title,
          chapterContext:
            chapterContext === "all" ? undefined : chapterContext,
          messages: [...existingConv.messages, userMsg, placeholderAssistant],
          updatedAt: now,
        }
      : {
          id: convId,
          title: deriveConversationTitle(content),
          chapterContext:
            chapterContext === "all" ? undefined : chapterContext,
          messages: [userMsg, placeholderAssistant],
          createdAt: now,
          updatedAt: now,
        };

    setState((prev) => {
      const exists = prev.conversations.some((c) => c.id === convId);
      const nextList = exists
        ? prev.conversations.map((c) => (c.id === convId ? updatedConv : c))
        : [updatedConv, ...prev.conversations];
      return {
        ...prev,
        conversations: nextList,
        activeConversationId: convId,
      };
    });

    setIsStreaming(true);

    const requestMessages = [...priorMessages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const controller = new AbortController();
    abortRef.current = controller;

    let accumulated = "";

    await streamAssistantReply(
      {
        messages: requestMessages,
        chapterContext: chapterContext === "all" ? undefined : chapterContext,
        apiKey: userApiKey || undefined,
      },
      {
        onToken: (token) => {
          accumulated += token;
          setState((prev) => ({
            ...prev,
            conversations: prev.conversations.map((conv) =>
              conv.id === convId
                ? {
                    ...conv,
                    messages: conv.messages.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: accumulated } : m
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : conv
            ),
          }));
        },
        onComplete: () => {
          setIsStreaming(false);
          abortRef.current = null;
          setState((prev) => ({
            ...prev,
            conversations: prev.conversations.map((conv) =>
              conv.id === convId
                ? {
                    ...conv,
                    messages: conv.messages.filter(
                      (m) =>
                        m.id !== assistantMsgId || m.content.trim().length > 0
                    ),
                  }
                : conv
            ),
          }));

          if (
            !controller.signal.aborted &&
            speechPrefsRef.current.autoSpeak &&
            accumulated.trim().length > 0
          ) {
            speak(accumulated, {
              messageId: assistantMsgId,
              voiceName: speechPrefsRef.current.voiceName,
            });
          }
        },
        onError: (err) => {
          setIsStreaming(false);
          abortRef.current = null;
          setErrorInfo(err);
          setState((prev) => ({
            ...prev,
            conversations: prev.conversations.map((conv) =>
              conv.id === convId
                ? {
                    ...conv,
                    messages: conv.messages.filter(
                      (m) =>
                        m.id !== assistantMsgId || m.content.trim().length > 0
                    ),
                  }
                : conv
            ),
          }));
        },
      },
      controller.signal
    );
  };

  const handleStopStreaming = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderApiKeyForm = (compact = false) => (
    <form
      onSubmit={handleSaveKey}
      className={
        compact
          ? "flex flex-wrap items-center gap-2"
          : "mt-3 flex flex-col gap-2 sm:flex-row sm:items-center"
      }
    >
      <div className="relative flex-1 min-w-[200px]">
        <input
          type={showKeyText ? "text" : "password"}
          value={keyDraft}
          onChange={(e) => setKeyDraft(e.target.value)}
          placeholder={
            userApiKey
              ? `Saved key ending in ••••${userApiKey.slice(-4)} (paste new to replace)`
              : "Paste your Groq API key (gsk_...)"
          }
          aria-label="Groq API key"
          autoComplete="off"
          spellCheck={false}
          className="h-8 w-full rounded-[6px] border border-border bg-surface pl-2.5 pr-8 font-mono text-xs text-ink placeholder:text-ink-muted focus:border-brand-accent focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowKeyText((v) => !v)}
          aria-label={showKeyText ? "Hide API key" : "Show API key"}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-ink-secondary hover:text-ink cursor-pointer"
        >
          {showKeyText ? (
            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="submit"
          disabled={!keyDraft.trim()}
          className="inline-flex h-8 items-center gap-1 rounded-[6px] bg-brand px-3 text-xs font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
        >
          {keySavedFlash ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Saved</span>
            </>
          ) : (
            <span>Save Key</span>
          )}
        </button>

        {userApiKey ? (
          <button
            type="button"
            onClick={handleClearKey}
            aria-label="Clear saved Groq API key"
            className="inline-flex h-8 items-center gap-1 rounded-[6px] border border-border bg-surface px-2.5 text-xs font-medium text-ink-secondary hover:border-error-border hover:bg-error-bg hover:text-error cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Clear</span>
          </button>
        ) : null}
      </div>
    </form>
  );

  const messages = activeConversation?.messages ?? [];

  return (
    <div className="flex min-h-[620px] h-[calc(100vh-220px)] max-h-[780px] overflow-hidden rounded-[12px] border border-border bg-surface">
      {/* Desktop Conversation Sidebar */}
      <aside
        aria-label="Conversation history"
        className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-border bg-surface-muted"
      >
        <ConversationSidebar
          conversations={conversations}
          activeId={activeConversation?.id ?? null}
          onSelect={handleSelectConversation}
          onNew={handleNewConversation}
          onDelete={handleDeleteConversation}
          onClearAll={handleClearAll}
        />
      </aside>

      {/* Main Chat Panel */}
      <div className="flex min-w-0 flex-1 flex-col bg-surface">
        {/* Chat Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-surface-muted px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setHistoryDrawerOpen(true)}
              aria-label="Open conversation history"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-border bg-surface text-ink hover:bg-surface-secondary lg:hidden cursor-pointer"
            >
              <History className="h-4 w-4" aria-hidden="true" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold text-ink">
                  Python AI Tutor
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                    isStreaming
                      ? "border-brand-border bg-brand-light text-brand-accent"
                      : isProviderReady
                        ? "border-success-border bg-success-bg text-success"
                        : serverStatus === null
                          ? "border-border bg-surface text-ink-secondary"
                          : "border-warning-border bg-warning-bg text-warning"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isStreaming
                        ? "bg-brand animate-pulse"
                        : isProviderReady
                          ? "bg-success"
                          : serverStatus === null
                            ? "bg-ink-muted"
                            : "bg-warning"
                    }`}
                    aria-hidden="true"
                  />
                  {isStreaming
                    ? "Responding..."
                    : userApiKey
                      ? `Your Key · ${serverStatus?.model ?? "openai/gpt-oss-120b"}`
                      : serverStatus === null
                        ? "Checking provider..."
                        : serverStatus.configured
                          ? `Groq · ${serverStatus.model}`
                          : "API Key Needed"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isSpeaking ? (
              <button
                type="button"
                onClick={stopSpeech}
                aria-label="Stop speaking answer"
                className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-brand bg-brand-light px-2.5 text-xs font-medium text-brand-accent hover:bg-brand/15 cursor-pointer"
              >
                <Square className="h-3 w-3" aria-hidden="true" />
                <span>Stop Voice</span>
              </button>
            ) : null}

            {voiceSupported ? (
              <button
                type="button"
                onClick={() => {
                  if (autoSpeak && isSpeaking) stopSpeech();
                  setAutoSpeak(!autoSpeak);
                }}
                aria-pressed={autoSpeak}
                aria-label={autoSpeak ? "Auto-voice replies enabled" : "Auto-voice replies disabled"}
                title="Automatically read Groq AI answers aloud using browser speech synthesis"
                className={`inline-flex h-8 items-center gap-1.5 rounded-[6px] border px-2.5 text-xs font-medium transition-colors cursor-pointer ${
                  autoSpeak
                    ? "border-brand-border bg-brand-light text-brand-accent"
                    : "border-border bg-surface text-ink-secondary hover:bg-surface-secondary hover:text-ink"
                }`}
              >
                {autoSpeak ? (
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">
                  Voice: {autoSpeak ? "On" : "Off"}
                </span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setSettingsOpen((open) => !open)}
              aria-expanded={settingsOpen}
              className={`inline-flex h-8 items-center gap-1.5 rounded-[6px] border px-2.5 text-xs font-medium transition-colors cursor-pointer ${
                settingsOpen || !isProviderReady
                  ? "border-brand-border bg-brand-light text-brand-accent"
                  : "border-border bg-surface text-ink hover:bg-surface-secondary"
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
              <span>API Key</span>
            </button>

            <label htmlFor="tutor-chapter-focus" className="sr-only">
              Focus chapter
            </label>
            <select
              id="tutor-chapter-focus"
              value={chapterContext}
              onChange={(e) => setChapterContext(e.target.value)}
              className="h-8 rounded-[6px] border border-border bg-surface px-2.5 text-xs text-ink focus:border-brand-accent focus:outline-none"
            >
              <option value="all">Syllabus: All 9 Chapters</option>
              {CHAPTERS.map((ch) => (
                <option key={ch.slug} value={ch.slug}>
                  Ch. {String(ch.number).padStart(2, "0")}: {ch.shortTitle}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleNewConversation}
              aria-label="Start new conversation"
              className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-border bg-surface px-2.5 text-xs font-medium text-ink hover:bg-surface-secondary cursor-pointer"
            >
              <MessageSquarePlus
                className="h-3.5 w-3.5 text-brand-accent"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>
        </div>

        {/* Collapsible Groq API Key & Voice Settings Panel */}
        {settingsOpen ? (
          <div className="border-b border-border bg-surface px-4 py-3 text-xs">
            <div className="mx-auto max-w-3xl space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-ink">
                  Groq API Key & Voice Settings
                </p>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-accent hover:underline"
                >
                  <span>Get a Groq API Key</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>

              {renderApiKeyForm(true)}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-ink-secondary">
                  Saved only in your browser&apos;s LocalStorage and sent only when chatting with Groq.
                </p>

                {voiceSupported && voices.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="assistant-voice-select"
                      className="text-[11px] font-medium text-ink-secondary"
                    >
                      Browser Voice:
                    </label>
                    <select
                      id="assistant-voice-select"
                      value={voiceName}
                      onChange={(e) => setVoiceName(e.target.value)}
                      className="h-7 max-w-[200px] rounded-[6px] border border-border bg-surface-muted px-2 text-[11px] text-ink focus:border-brand-accent focus:outline-none"
                    >
                      <option value="">System Default</option>
                      {voices.map((v) => (
                        <option key={`${v.name}-${v.lang}`} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* Message Feed or Welcome State */}
        <div className="flex-1 overflow-y-auto bg-surface-muted p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="mx-auto flex max-w-2xl flex-col items-center justify-center py-6 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-border bg-surface text-brand-accent">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>

              <h3 className="mt-4 text-xl font-semibold text-ink sm:text-2xl">
                Let&apos;s Learn Python Together.
              </h3>
              <p className="mt-2 max-w-md text-sm text-ink-secondary">
                Ask me anything about Python basics, code examples, or
                programming errors. Answers can also be read aloud via your browser&apos;s built-in voice.
              </p>

              {serverStatus && !isProviderReady ? (
                <div className="mt-5 w-full rounded-[10px] border border-brand-border bg-surface p-4 text-left text-xs text-ink">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-ink">
                      Connect Your Groq API Key
                    </p>
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-accent hover:underline"
                    >
                      <span>Create key at Groq Console</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                  <p className="mt-1 leading-relaxed text-ink-secondary">
                    Paste your personal Groq API key below to start chatting. It stays saved in your browser&apos;s LocalStorage and is never stored on a backend database.
                  </p>
                  {renderApiKeyForm(false)}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand hover:bg-brand-light hover:text-brand-accent cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              {messages.map((msg, idx) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isStreaming={
                    isStreaming &&
                    idx === messages.length - 1 &&
                    msg.role === "assistant"
                  }
                  voiceSupported={voiceSupported}
                  isSpeaking={speakingId === msg.id}
                  onToggleSpeak={() => {
                    if (speakingId === msg.id) {
                      stopSpeech();
                    } else {
                      speak(msg.content, {
                        messageId: msg.id,
                        voiceName,
                      });
                    }
                  }}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error Alert Banner */}
        {errorInfo ? (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 border-t border-error-border bg-error-bg px-4 py-3 text-xs text-error-strong"
          >
            <div className="flex items-start gap-2">
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-error"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-error">
                  {errorInfo.code === "NOT_CONFIGURED"
                    ? "Groq API Key Required"
                    : errorInfo.code === "RATE_LIMITED"
                      ? "Rate Limit Reached"
                      : "Could Not Get AI Response"}
                </p>
                <p className="mt-0.5">{errorInfo.message}</p>
                {errorInfo.code === "NOT_CONFIGURED" && !settingsOpen ? (
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    className="mt-1.5 inline-flex items-center gap-1 rounded-[5px] border border-error-border bg-surface px-2 py-0.5 text-[11px] font-medium text-ink hover:bg-surface-secondary cursor-pointer"
                  >
                    <KeyRound className="h-3 w-3 text-brand-accent" aria-hidden="true" />
                    <span>Enter Groq API Key</span>
                  </button>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorInfo(null)}
              aria-label="Dismiss error"
              className="rounded p-1 text-error hover:bg-error-bg/80 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}

        {/* Chat Input Area */}
        <div className="border-t border-border bg-surface p-3 sm:p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2.5">
            <div className="flex-1">
              <label htmlFor="assistant-chat-input" className="sr-only">
                Ask a Python question
              </label>
              <textarea
                id="assistant-chat-input"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Python basics, paste code for line-by-line help, or ask about an error..."
                className="w-full resize-none rounded-[8px] border border-border bg-surface-muted px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-accent focus:bg-surface focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-ink-muted">
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>

            {isStreaming ? (
              <button
                type="button"
                onClick={handleStopStreaming}
                aria-label="Stop generating response"
                className="mb-5 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[8px] bg-[#DC2626] px-4 text-xs font-medium text-white hover:bg-[#B91C1C] cursor-pointer"
              >
                <Square className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={!input.trim()}
                onClick={() => sendMessage()}
                aria-label="Send message"
                className="mb-5 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[8px] bg-brand px-4 text-xs font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Send</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Conversation History Drawer */}
      <DialogPrimitive.Root
        open={historyDrawerOpen}
        onOpenChange={setHistoryDrawerOpen}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#0B1220]/40 backdrop-blur-[1px]" />
          <DialogPrimitive.Content
            aria-label="Chat history drawer"
            className="fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col border-r border-border bg-surface-muted shadow-xl focus:outline-none"
          >
            <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
              <DialogPrimitive.Title className="text-sm font-semibold text-ink">
                Conversations
              </DialogPrimitive.Title>
              <DialogPrimitive.Close
                aria-label="Close conversation history"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-ink-secondary hover:bg-surface-secondary cursor-pointer"
              >
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>
            <DialogPrimitive.Description className="sr-only">
              Select, create, or delete saved AI tutor conversations.
            </DialogPrimitive.Description>
            <div className="flex-1 overflow-hidden">
              <ConversationSidebar
                conversations={conversations}
                activeId={activeConversation?.id ?? null}
                onSelect={handleSelectConversation}
                onNew={handleNewConversation}
                onDelete={handleDeleteConversation}
                onClearAll={handleClearAll}
              />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
