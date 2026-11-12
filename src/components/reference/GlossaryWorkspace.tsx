"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { GLOSSARY_ENTRIES } from "@/data/glossary";
import { CopyButton } from "@/components/common/CopyButton";
import { PythonCodeView } from "@/components/common/PythonCodeView";
import { EmptyState } from "@/components/common/StateBlocks";
import { cn } from "@/lib/utils";

export function GlossaryWorkspace() {
  const [query, setQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("All");

  const letters = useMemo(() => {
    const set = new Set(
      GLOSSARY_ENTRIES.map((e) => e.term[0].toUpperCase())
    );
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY_ENTRIES.filter((entry) => {
      const matchesLetter =
        selectedLetter === "All" ||
        entry.term[0].toUpperCase() === selectedLetter;
      if (!matchesLetter) return false;
      if (!q) return true;
      return (
        entry.term.toLowerCase().includes(q) ||
        entry.definition.toLowerCase().includes(q) ||
        entry.chapterTitle.toLowerCase().includes(q)
      );
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [query, selectedLetter]);

  return (
    <div className="space-y-6">
      <div className="rounded-[12px] border border-border bg-surface p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Python terms (e.g., variable, indentation, modulus, boolean)..."
            aria-label="Search glossary terms"
            className="h-10 w-full rounded-[8px] border border-border bg-surface-muted pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brand-accent focus:bg-surface focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by starting letter">
          <button
            type="button"
            onClick={() => setSelectedLetter("All")}
            className={cn(
              "rounded-[6px] border px-2.5 py-1 text-xs font-medium cursor-pointer",
              selectedLetter === "All"
                ? "border-brand bg-brand-light text-brand-accent"
                : "border-border bg-surface-muted text-ink-secondary hover:text-ink"
            )}
          >
            All ({GLOSSARY_ENTRIES.length})
          </button>
          {letters.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setSelectedLetter(letter)}
              className={cn(
                "rounded-[6px] border px-2.5 py-1 text-xs font-medium cursor-pointer",
                selectedLetter === letter
                  ? "border-brand bg-brand-light text-brand-accent"
                  : "border-border bg-surface-muted text-ink-secondary hover:text-ink"
              )}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No glossary terms matched"
          description="Try resetting the letter filter or searching with a broader Python term."
          action={
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedLetter("All");
              }}
              className="rounded-[8px] border border-border bg-surface px-4 py-2 text-xs font-medium text-ink hover:bg-surface-muted cursor-pointer"
            >
              Show All Terms
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((entry) => (
            <article
              key={entry.term}
              className="flex flex-col justify-between rounded-[10px] border border-border bg-surface p-5"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-semibold text-ink">
                    {entry.term}
                  </h2>
                  <Link
                    href={`/learn/${entry.chapterSlug}`}
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand-accent hover:underline"
                  >
                    <span>{entry.chapterTitle}</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                  {entry.definition}
                </p>
              </div>

              {entry.example ? (
                <div className="mt-4 overflow-hidden rounded-[8px] border border-border">
                  <div className="flex items-center justify-between border-b border-border bg-surface-muted px-3 py-1.5">
                    <span className="text-[11px] font-medium text-ink-secondary">
                      Example
                    </span>
                    <CopyButton text={entry.example} />
                  </div>
                  <PythonCodeView code={entry.example} />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

