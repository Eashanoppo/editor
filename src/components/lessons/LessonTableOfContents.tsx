"use client";

import React from "react";
import Link from "next/link";
import { CheckSquare, Terminal } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import type { ChapterMeta, TocHeading } from "@/types/curriculum";

export function LessonTableOfContents({
  chapter,
  headings,
}: {
  chapter: ChapterMeta;
  headings: TocHeading[];
}) {
  const { metrics, isChapterCompleted, hydrated } = useProgress();
  const completed = hydrated && isChapterCompleted(chapter.slug);
  const percentage = hydrated ? metrics.learningPercentage : 0;

  return (
    <aside
      aria-label="On this page"
      className="hidden xl:block w-[220px] shrink-0"
    >
      <div className="sticky top-[88px] space-y-4">
        {/* Table of contents */}
        <div className="rounded-[10px] border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            On This Page
          </p>
          <ul className="mt-3 space-y-1.5 text-[13px]">
            {headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
                <a
                  href={`#${h.id}`}
                  className="block py-0.5 text-ink-secondary transition-colors hover:text-brand-accent"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Course progress & quick actions */}
        <div className="rounded-[10px] border border-border bg-surface p-4 space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-ink">Course Progress</span>
              <span className="font-semibold text-brand-accent">{percentage}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
              <div
                className="h-full rounded-full bg-brand transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-ink-secondary">
              {completed ? "This chapter is complete." : "Mark complete at lesson end."}
            </p>
          </div>

          <div className="space-y-1.5 border-t border-border pt-3">
            <Link
              href={`/playground?code=${encodeURIComponent(chapter.starterCode)}`}
              className="flex items-center gap-2 rounded-[6px] px-2 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-muted hover:text-brand-accent"
            >
              <Terminal className="h-3.5 w-3.5 text-brand-accent" aria-hidden="true" />
              <span>Open Chapter Starter</span>
            </Link>
            <Link
              href={`/practice?chapter=${encodeURIComponent(chapter.slug)}`}
              className="flex items-center gap-2 rounded-[6px] px-2 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-muted hover:text-brand-accent"
            >
              <CheckSquare className="h-3.5 w-3.5 text-brand-accent" aria-hidden="true" />
              <span>Chapter Practice Quiz</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

