"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronDown, List } from "lucide-react";
import { CHAPTERS } from "@/data/chapters";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/types/curriculum";

export function ChapterMobileControls({
  activeSlug,
  activeTitle,
  activeNumber,
  headings,
}: {
  activeSlug: string;
  activeTitle: string;
  activeNumber: number;
  headings: TocHeading[];
}) {
  const { progress, hydrated } = useProgress();
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div className="mb-5 space-y-2.5 lg:hidden">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {/* Chapter dropdown toggle */}
        <button
          type="button"
          onClick={() => {
            setChaptersOpen((prev) => !prev);
            setTocOpen(false);
          }}
          aria-expanded={chaptersOpen}
          className="flex items-center justify-between rounded-[8px] border border-border bg-surface px-3.5 py-2.5 text-left text-sm font-medium text-ink cursor-pointer"
        >
          <span className="flex min-w-0 items-center gap-2">
            <BookOpen className="h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
            <span className="truncate">
              Ch. {String(activeNumber).padStart(2, "0")}: {activeTitle}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-ink-secondary transition-transform duration-150",
              chaptersOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        {/* On this page toggle */}
        {headings.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setTocOpen((prev) => !prev);
              setChaptersOpen(false);
            }}
            aria-expanded={tocOpen}
            className="flex items-center justify-between rounded-[8px] border border-border bg-surface px-3.5 py-2.5 text-left text-sm font-medium text-ink xl:hidden cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <List className="h-4 w-4 shrink-0 text-ink-secondary" aria-hidden="true" />
              <span>On this page</span>
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-ink-secondary transition-transform duration-150",
                tocOpen && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>

      {chaptersOpen ? (
        <div className="rounded-[10px] border border-border bg-surface p-2">
          <ul className="space-y-1">
            {CHAPTERS.map((ch) => {
              const isActive = ch.slug === activeSlug;
              const isDone =
                hydrated && progress.completedChapters.includes(ch.slug);
              return (
                <li key={ch.slug}>
                  <Link
                    href={`/learn/${ch.slug}`}
                    onClick={() => setChaptersOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-[8px] px-3 py-2 text-sm",
                      isActive
                        ? "bg-brand-light font-semibold text-brand-accent"
                        : "text-ink hover:bg-surface-muted"
                    )}
                  >
                    <span>
                      {String(ch.number).padStart(2, "0")}. {ch.title}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-success" aria-label="Completed" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {tocOpen && headings.length > 0 ? (
        <div className="rounded-[10px] border border-border bg-surface p-3">
          <ul className="space-y-1.5 text-sm">
            {headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
                <a
                  href={`#${h.id}`}
                  onClick={() => setTocOpen(false)}
                  className="block py-1 text-ink-secondary hover:text-brand-accent"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

