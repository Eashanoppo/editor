"use client";

import React, { useEffect } from "react";
import { Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/LayoutPrimitives";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useProgress } from "@/hooks/useProgress";
import type { ChapterMeta } from "@/types/curriculum";

export function ChapterHeader({ chapter }: { chapter: ChapterMeta }) {
  const { isChapterCompleted, setLastVisitedChapter, hydrated } = useProgress();

  useEffect(() => {
    setLastVisitedChapter(chapter.slug);
  }, [chapter.slug, setLastVisitedChapter]);

  const completed = hydrated && isChapterCompleted(chapter.slug);

  return (
    <header className="border-b border-border pb-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learn", href: "/learn" },
          { label: `Chapter ${String(chapter.number).padStart(2, "0")}` },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-accent">
          Chapter {String(chapter.number).padStart(2, "0")} of 09
        </span>
        <StatusBadge status={completed ? "completed" : "in_progress"} />
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-secondary">
          <Clock className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
          {chapter.readingMinutes} min read
        </span>
      </div>

      <h1 className="mt-3 text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-[36px]">
        {chapter.title}
      </h1>

      <p className="mt-2.5 text-base leading-relaxed text-ink-secondary">
        {chapter.description}
      </p>
    </header>
  );
}

