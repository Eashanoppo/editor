import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckSquare, Clock } from "lucide-react";
import { CHAPTERS } from "@/data/chapters";
import { Breadcrumbs, PageContainer } from "@/components/layout/LayoutPrimitives";
import { HomeProgressBanner } from "@/components/homepage/HomeProgressBanner";
import { ChapterOverviewGrid } from "@/components/homepage/ChapterOverviewGrid";

export const metadata: Metadata = {
  title: "Learn Python Curriculum",
  description:
    "Explore all nine structured Python chapters from Introduction to Python through Operators.",
};

export default function LearnIndexPage() {
  const totalMinutes = CHAPTERS.reduce((sum, ch) => sum + ch.readingMinutes, 0);

  return (
    <div className="py-8 sm:py-10">
      <PageContainer>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Learn" }]}
        />

        <div className="mt-4 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Curriculum Overview
            </p>
            <h1 className="mt-1.5 text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-[36px]">
              Learn Python Step by Step
            </h1>
            <p className="mt-2 text-base text-ink-secondary">
              Follow all nine foundational chapters in order. Every lesson
              includes clear explanations, runnable Python examples, common
              mistakes, and a quick practice check.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-ink-secondary shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-[8px] border border-border bg-surface px-3 py-2">
              <BookOpen className="h-3.5 w-3.5 text-brand-accent" aria-hidden="true" />
              {CHAPTERS.length} Chapters
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[8px] border border-border bg-surface px-3 py-2">
              <Clock className="h-3.5 w-3.5 text-brand-accent" aria-hidden="true" />
              ~{totalMinutes} min total
            </span>
          </div>
        </div>

        <div className="mt-6">
          <HomeProgressBanner />
        </div>

        <div className="mt-8">
          <ChapterOverviewGrid />
        </div>

        {/* Detailed topic breakdown */}
        <section className="mt-12 rounded-[12px] border border-border bg-surface p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">
                What Each Chapter Covers
              </h2>
              <p className="mt-1 text-sm text-ink-secondary">
                Review specific topics before jumping into a lesson or practice
                quiz.
              </p>
            </div>
            <Link
              href="/practice"
              className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-border bg-surface-muted px-3.5 text-xs font-medium text-ink hover:bg-surface-secondary"
            >
              <CheckSquare className="h-3.5 w-3.5 text-brand-accent" aria-hidden="true" />
              <span>Go to Practice Quizzes</span>
            </Link>
          </div>

          <div className="mt-5 divide-y divide-border">
            {CHAPTERS.map((ch) => (
              <div
                key={ch.slug}
                className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <Link
                    href={`/learn/${ch.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand-accent"
                  >
                    <span className="font-mono text-xs text-brand-accent">
                      {String(ch.number).padStart(2, "0")}
                    </span>
                    <span>{ch.title}</span>
                  </Link>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {ch.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-[6px] border border-border bg-surface-muted px-2 py-0.5 text-xs text-ink-secondary"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={`/learn/${ch.slug}`}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand-accent hover:text-brand-accent"
                >
                  <span>Read lesson</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </PageContainer>
    </div>
  );
}

