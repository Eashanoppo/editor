"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { CHAPTERS } from "@/data/chapters";
import { StatusBadge, type ChapterStatus } from "@/components/common/StatusBadge";
import { useProgress } from "@/hooks/useProgress";

export function ChapterOverviewGrid() {
  const { progress, hydrated } = useProgress();

  const getStatus = (slug: string): ChapterStatus => {
    if (!hydrated) return "not_started";
    if (progress.completedChapters.includes(slug)) return "completed";
    if (
      progress.preferences.lastVisitedChapter === slug ||
      progress.practiceActivities.some((item) => item.chapterSlug === slug)
    ) {
      return "in_progress";
    }
    return "not_started";
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {CHAPTERS.map((chapter) => {
        const status = getStatus(chapter.slug);
        return (
          <Link
            key={chapter.slug}
            href={`/learn/${chapter.slug}`}
            className="group flex flex-col justify-between rounded-[10px] border border-border bg-surface p-5 transition-colors duration-150 hover:border-brand"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-brand-accent">
                  CHAPTER {String(chapter.number).padStart(2, "0")}
                </span>
                <StatusBadge status={status} />
              </div>

              <h3 className="mt-2.5 text-[17px] font-semibold text-ink group-hover:text-brand-accent transition-colors">
                {chapter.title}
              </h3>

              <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                {chapter.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-medium text-ink-secondary">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                {chapter.readingMinutes} min read
              </span>
              <span className="inline-flex items-center gap-1 text-brand-accent">
                <span>Open chapter</span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

