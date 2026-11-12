"use client";

import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink, User } from "lucide-react";
import { CopyButton } from "@/components/common/CopyButton";
import { PythonCodeView } from "@/components/common/PythonCodeView";
import { PythonLogoMark } from "@/components/common/PythonLogoMark";
import type { ChatMessageItem } from "@/types/assistant";

export function ChatMessage({
  message,
  isStreaming = false,
}: {
  message: ChatMessageItem;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[85%] sm:max-w-[75%] items-start gap-2.5">
          <div className="rounded-[12px] border border-brand-border bg-brand-light px-4 py-3 text-sm leading-relaxed text-ink whitespace-pre-wrap">
            {message.content}
          </div>
          <div
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-ink-secondary"
          >
            <User className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="flex w-full max-w-[92%] sm:max-w-[85%] items-start gap-2.5">
        <div className="shrink-0 pt-0.5">
          <PythonLogoMark className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1 rounded-[12px] border border-border bg-surface px-4 py-3.5">
          <div className="prose-chat text-sm leading-[1.65] text-ink">
            {message.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h3 className="mt-3 mb-1.5 text-base font-semibold text-ink">
                      {children}
                    </h3>
                  ),
                  h2: ({ children }) => (
                    <h3 className="mt-3 mb-1.5 text-base font-semibold text-ink">
                      {children}
                    </h3>
                  ),
                  h3: ({ children }) => (
                    <h4 className="mt-2.5 mb-1 text-sm font-semibold text-ink">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="my-2 first:mt-0 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-2 list-decimal space-y-1 pl-5">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li>{children}</li>,
                  strong: ({ children }) => (
                    <strong className="font-semibold text-ink">
                      {children}
                    </strong>
                  ),
                  pre: ({ children }) => <>{children}</>,
                  code: ({ className, children }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    const rawText = String(children ?? "").replace(/\n$/, "");
                    const isBlock = Boolean(match) || rawText.includes("\n");

                    if (!isBlock) {
                      return (
                        <code className="rounded-[4px] border border-border bg-surface-secondary px-1.5 py-0.5 font-mono text-[12.5px] text-ink">
                          {children}
                        </code>
                      );
                    }

                    const lang = match?.[1] ?? "python";
                    return (
                      <div className="my-3 overflow-hidden rounded-[8px] border border-border bg-surface">
                        <div className="flex items-center justify-between border-b border-border bg-surface-muted px-3 py-1.5">
                          <span className="font-mono text-[11px] font-medium uppercase text-ink-secondary">
                            {lang}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <CopyButton text={rawText} />
                            {lang === "python" || lang === "py" ? (
                              <Link
                                href={`/playground?code=${encodeURIComponent(rawText)}`}
                                className="inline-flex h-7 items-center gap-1 rounded-[6px] border border-border bg-surface px-2 text-xs font-medium text-brand-accent hover:bg-brand-light"
                              >
                                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                                <span>Playground</span>
                              </Link>
                            ) : null}
                          </div>
                        </div>
                        <PythonCodeView code={rawText} />
                      </div>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : isStreaming ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-secondary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
                Thinking...
              </span>
            ) : null}

            {isStreaming && message.content ? (
              <span
                aria-hidden="true"
                className="ml-1 inline-block h-4 w-1.5 animate-pulse bg-brand align-middle"
              />
            ) : null}
          </div>

          {!isStreaming && message.content ? (
            <div className="mt-3 flex justify-end border-t border-border pt-2">
              <CopyButton text={message.content} label="Copy reply" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

