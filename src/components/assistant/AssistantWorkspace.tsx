"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  History,
  MessageSquarePlus,
  Send,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CHAPTERS } from "@/data/chapters";
import {
  createNewConversation,
  deriveConversationTitle,
} from "@/lib/storage/assistant";
import { useAssistantHistory } from "@/hooks/useAssistantHistory";
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

  const [chapterContext, setChapterContext] = useState<string>("all");
  const [input, setInput] = useState(initialPrompt);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorInfo, setErrorInfo] = useState<AIErrorInfo | null>(null);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<{
    configured: boolean;
    model: string;
    provider: string;
  } | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    fetchAssistantStatus().then((status) => {
      if (mounted && status) setServerStatus(status);
    });
    return () => {
      mounted = false;
    };
  }, []);

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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-muted px-4 py-3">
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
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-ink">
                  Python AI Tutor
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                    isStreaming
                      ? "border-brand-border bg-brand-light text-brand-accent"
                      : serverStatus === null
                        ? "border-border bg-surface text-ink-secondary"
                        : serverStatus.configured
                          ? "border-success-border bg-success-bg text-success"
                          : "border-warning-border bg-warning-bg text-warning"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isStreaming
                        ? "bg-brand animate-pulse"
                        : serverStatus?.configured
                          ? "bg-success"
                          : "bg-warning"
                    }`}
                    aria-hidden="true"
                  />
                  {isStreaming
                    ? "Responding..."
                    : serverStatus === null
                      ? "Checking provider..."
                      : serverStatus.configured
                        ? `Groq · ${serverStatus.model}`
                        : "API Key Required"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Message Feed or Welcome State */}
        <div className="flex-1 overflow-y-auto bg-surface-muted p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="mx-auto flex max-w-2xl flex-col items-center justify-center py-8 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-border bg-surface text-brand-accent">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>

              <h3 className="mt-4 text-xl font-semibold text-ink sm:text-2xl">
                Let&apos;s Learn Python Together.
              </h3>
              <p className="mt-2 max-w-md text-sm text-ink-secondary">
                Ask me anything about Python basics, code examples, or
                programming errors.
              </p>

              {serverStatus && !serverStatus.configured ? (
                <div className="mt-5 w-full rounded-[10px] border border-warning-border bg-warning-bg p-4 text-left text-xs text-warning">
                  <p className="font-semibold text-warning">
                    Groq API Key Not Configured
                  </p>
                  <p className="mt-1 leading-relaxed">
                    To connect the real Groq tutor, add{" "}
                    <code className="rounded bg-surface px-1.5 py-0.5 font-mono">
                      GROQ_API_KEY
                    </code>{" "}
                    and{" "}
                    <code className="rounded bg-surface px-1.5 py-0.5 font-mono">
                      GROQ_MODEL
                    </code>{" "}
                    to <code className="font-mono">.env.local</code> on the
                    server. Keys are never stored or exposed in the browser.
                  </p>
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
                    ? "Server AI Configuration Needed"
                    : errorInfo.code === "RATE_LIMITED"
                      ? "Rate Limit Reached"
                      : "Could Not Get AI Response"}
                </p>
                <p className="mt-0.5">{errorInfo.message}</p>
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
