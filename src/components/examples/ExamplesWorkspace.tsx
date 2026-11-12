"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import {
  EXAMPLE_CATEGORIES,
  PYTHON_EXAMPLES,
} from "@/data/examples";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/common/CopyButton";
import { PythonCodeView } from "@/components/common/PythonCodeView";
import { EmptyState } from "@/components/common/StateBlocks";
import { cn } from "@/lib/utils";

export function ExamplesWorkspace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PYTHON_EXAMPLES.filter((item) => {
      const matchesCat =
        selectedCategory === "All" || item.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Search + Category Filters */}
      <div className="rounded-[12px] border border-border bg-surface p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search examples by keyword (e.g., print, type, f-string, //, and)..."
            aria-label="Search Python examples"
            className="h-10 w-full rounded-[8px] border border-border bg-surface-muted pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brand-accent focus:bg-surface focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
              selectedCategory === "All"
                ? "border-brand bg-brand-light text-brand-accent"
                : "border-border bg-surface-muted text-ink-secondary hover:text-ink"
            )}
          >
            All ({PYTHON_EXAMPLES.length})
          </button>
          {EXAMPLE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                selectedCategory === category
                  ? "border-brand bg-brand-light text-brand-accent"
                  : "border-border bg-surface-muted text-ink-secondary hover:text-ink"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No matching examples"
          description="Try clearing the category filter or searching with another Python keyword."
          action={
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="rounded-[8px] border border-border bg-surface px-4 py-2 text-xs font-medium text-ink hover:bg-surface-muted cursor-pointer"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filtered.map((example) => (
            <article
              key={example.id}
              className="flex flex-col justify-between overflow-hidden rounded-[10px] border border-border bg-surface"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-muted px-4 py-3">
                  <div>
                    <h2 className="text-[15px] font-semibold text-ink">
                      {example.title}
                    </h2>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="primary">{example.category}</Badge>
                      <Link
                        href={`/learn/${example.chapterSlug}`}
                        className="text-xs text-ink-secondary hover:text-brand-accent"
                      >
                        Related lesson →
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CopyButton text={example.code} />
                    <Link
                      href={`/playground?example=${encodeURIComponent(example.id)}`}
                      className="inline-flex h-7 items-center gap-1.5 rounded-[6px] bg-brand px-2.5 text-xs font-medium text-white transition-colors hover:bg-brand-hover"
                    >
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      <span>Open in Playground</span>
                    </Link>
                  </div>
                </div>

                <PythonCodeView
                  code={example.code}
                  className="border-b border-border"
                />
              </div>

              <div className="space-y-3 p-4">
                <p className="text-sm leading-relaxed text-ink-secondary">
                  {example.explanation}
                </p>

                <div className="rounded-[8px] border border-border bg-surface-muted px-3.5 py-2.5">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
                    Expected Output
                  </p>
                  <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-ink">
                    {example.expectedOutput}
                  </pre>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

