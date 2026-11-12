"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { searchPlatformContent } from "@/lib/search/search";
import type { SearchDocument } from "@/types/search";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extraDocuments?: SearchDocument[];
}

export function SearchDialog({
  open,
  onOpenChange,
  extraDocuments = [],
}: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => searchPlatformContent(query, extraDocuments),
    [query, extraDocuments]
  );

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setQuery("");
      setActiveIndex(0);
    }
    onOpenChange(nextOpen);
  };

  const navigateTo = (href: string) => {
    handleOpenChange(false);
    router.push(href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const boundedIndex = Math.min(activeIndex, results.length - 1);
      const target = results[boundedIndex];
      if (target) navigateTo(target.href);
    }
  };

  const safeActiveIndex =
    results.length > 0 ? Math.min(activeIndex, results.length - 1) : 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden" hideCloseButton>
        <DialogTitle className="sr-only">Search Python topics</DialogTitle>
        <DialogDescription className="sr-only">
          Search across chapters, Python concepts, operators, examples, and glossary terms.
        </DialogDescription>

        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-ink-secondary" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search chapters, operators, variables, print()..."
            aria-label="Search Python topics"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-surface-muted px-1.5 py-0.5 text-[11px] font-medium text-ink-secondary">
            ESC
          </kbd>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-ink">
                No matching topics found
              </p>
              <p className="mt-1 text-xs text-ink-secondary">
                Try searching for &ldquo;variables&rdquo;, &ldquo;strings&rdquo;, &ldquo;print&rdquo;, &ldquo;==&rdquo;, or &ldquo;operators&rdquo;.
              </p>
            </div>
          ) : (
            <ul role="listbox" aria-label="Search results" className="space-y-1">
              {results.map((item, idx) => {
                const isSelected = idx === safeActiveIndex;
                return (
                  <li key={item.id} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => navigateTo(item.href)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex w-full items-center justify-between gap-3 rounded-[8px] px-3 py-2.5 text-left transition-colors cursor-pointer ${
                        isSelected ? "bg-brand-light" : "hover:bg-surface-muted"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-medium text-ink">
                            {item.title}
                          </span>
                          <Badge
                            variant={
                              item.category === "Chapter" ? "primary" : "neutral"
                            }
                          >
                            {item.category}
                          </Badge>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-ink-secondary">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 text-xs text-ink-secondary">
                        <span className="hidden sm:inline">{item.sectionLabel}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-brand-accent" aria-hidden="true" />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-surface-muted px-4 py-2 text-[11px] text-ink-secondary">
          <span>Use Up/Down arrows to select, Enter to open</span>
          <span>9-chapter syllabus index</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
