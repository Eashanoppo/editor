"use client";

import React from "react";
import { MessageSquarePlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatConversation } from "@/types/assistant";

interface ConversationSidebarProps {
  conversations: ChatConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClearAll,
}: ConversationSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-3">
        <button
          type="button"
          onClick={onNew}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-[8px] bg-brand px-3 text-xs font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer"
        >
          <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>New Conversation</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-ink-muted">
            No saved conversations yet.
          </p>
        ) : (
          <ul className="space-y-1">
            {conversations.map((conv) => {
              const isActive = conv.id === activeId;
              return (
                <li key={conv.id} className="group flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onSelect(conv.id)}
                    className={cn(
                      "min-w-0 flex-1 rounded-[8px] px-3 py-2 text-left text-xs transition-colors cursor-pointer",
                      isActive
                        ? "bg-brand-light font-semibold text-brand-accent"
                        : "text-ink hover:bg-surface-muted"
                    )}
                  >
                    <p className="truncate">{conv.title}</p>
                    <p className="mt-0.5 text-[11px] font-normal text-ink-muted">
                      {conv.messages.length} message
                      {conv.messages.length === 1 ? "" : "s"}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(conv.id)}
                    aria-label={`Delete conversation ${conv.title}`}
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-ink-muted opacity-70 transition-colors hover:bg-error-bg hover:text-error hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {conversations.length > 0 ? (
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={onClearAll}
            className="w-full rounded-[8px] border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:border-error-border hover:bg-error-bg hover:text-error cursor-pointer"
          >
            Clear All History
          </button>
        </div>
      ) : null}
    </div>
  );
}

