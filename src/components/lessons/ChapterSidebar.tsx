"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { CHAPTERS } from "@/data/chapters";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

export function ChapterSidebar({ activeSlug }: { activeSlug: string }) {
  const { progress, metrics, hydrated } = useProgress();

  const completedCount = hydrated ? metrics.completedChaptersCount : 0;

  return (
    <aside
      aria-label="Curriculum chapters"
      className="hidden lg:block w-[250px] shrink-0"
    >
      <div className="sticky top-[88px] rounded-[10px] border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between border-b border-border pb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Curriculum
          </span>
          <span className="text-xs font-medium text-brand-accent">
            {completedCount}/{CHAPTERS.length}
          </span>
        </div>

        <nav aria-label="Chapter list">
          <ul className="space-y-1">
            {CHAPTERS.map((chapter) => {
              const isActive = chapter.slug === activeSlug;
              const isDone =
                hydrated && progress.completedChapters.includes(chapter.slug);

              return (
                <li key={chapter.slug}>
                  <Link
                    href={`/learn/${chapter.slug}`}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-[8px] px-2.5 py-2 text-[13.5px] transition-colors",
                      isActive
                        ? "bg-brand-light font-semibold text-brand-accent"
                        : "text-ink hover:bg-surface-muted"
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn(
                          "font-mono text-xs shrink-0",
                          isActive ? "text-brand-accent" : "text-ink-muted"
                        )}
                      >
                        {String(chapter.number).padStart(2, "0")}
                      </span>
                      <span className="truncate">{chapter.shortTitle}</span>
                    </span>
                    {isDone ? (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-success"
                        aria-label="Completed"
                      />
                    ) : (
                      <Circle
                        className={cn(
                          "h-3.5 w-3.5 shrink-0",
                          isActive ? "text-brand-accent/50" : "text-border-strong"
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

