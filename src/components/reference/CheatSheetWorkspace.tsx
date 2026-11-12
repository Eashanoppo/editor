"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { CHEAT_SHEET_SECTIONS } from "@/data/cheat-sheet";
import { CopyButton } from "@/components/common/CopyButton";
import { PythonCodeView } from "@/components/common/PythonCodeView";
import { EmptyState } from "@/components/common/StateBlocks";

export function CheatSheetWorkspace() {
  const [query, setQuery] = useState("");

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CHEAT_SHEET_SECTIONS;

    return CHEAT_SHEET_SECTIONS.map((section) => {
      const sectionMatch =
        section.title.toLowerCase().includes(q) ||
        section.summary.toLowerCase().includes(q);
      const matchingItems = section.items.filter(
        (item) =>
          item.symbolOrName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.exampleCode.toLowerCase().includes(q)
      );
      if (sectionMatch) return section;
      if (matchingItems.length > 0) {
        return { ...section, items: matchingItems };
      }
      return null;
    }).filter((s): s is NonNullable<typeof s> => s !== null);
  }, [query]);

  return (
    <div className="space-y-6">
      {/* Search & Quick Jump */}
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
            placeholder="Filter cheat sheet (e.g., //, +=, is, f-string, bool, bitwise)..."
            aria-label="Filter cheat sheet"
            className="h-10 w-full rounded-[8px] border border-border bg-surface-muted pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brand-accent focus:bg-surface focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CHEAT_SHEET_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-ink-secondary transition-colors hover:border-brand hover:text-brand-accent"
            >
              {section.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      {filteredSections.length === 0 ? (
        <EmptyState
          title="No matching cheat sheet entries"
          description="Try another keyword such as print, str, ==, or arithmetic."
          action={
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-[8px] border border-border bg-surface px-4 py-2 text-xs font-medium text-ink hover:bg-surface-muted cursor-pointer"
            >
              Clear Filter
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-[12px] border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                <div>
                  <h2 className="text-base font-semibold text-ink">
                    {section.title}
                  </h2>
                  <p className="mt-0.5 text-xs text-ink-secondary">
                    {section.summary}
                  </p>
                </div>
                <Link
                  href={`/learn/${section.chapterSlug}`}
                  className="shrink-0 text-xs font-medium text-brand-accent hover:underline"
                >
                  Lesson →
                </Link>
              </div>

              <div className="mt-4 space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.symbolOrName}
                    className="overflow-hidden rounded-[8px] border border-border bg-surface-muted"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3.5 py-2">
                      <div>
                        <p className="font-mono text-xs font-semibold text-brand-accent">
                          {item.symbolOrName}
                        </p>
                        <p className="text-xs text-ink-secondary">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CopyButton text={item.exampleCode} />
                        <Link
                          href={`/playground?code=${encodeURIComponent(item.exampleCode)}`}
                          className="inline-flex h-7 items-center gap-1 rounded-[6px] border border-border bg-surface px-2 text-xs font-medium text-ink hover:bg-surface-secondary"
                          title="Run in Playground"
                        >
                          <ExternalLink className="h-3 w-3 text-brand-accent" aria-hidden="true" />
                          <span>Try</span>
                        </Link>
                      </div>
                    </div>
                    <PythonCodeView code={item.exampleCode} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

