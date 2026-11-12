import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckSquare,
  Code2,
  MessageSquare,
  Sparkles,
  Terminal,
} from "lucide-react";
import { PageContainer, SectionHeading } from "@/components/layout/LayoutPrimitives";
import { HeroCodePreview } from "@/components/homepage/HeroCodePreview";
import { HomeProgressBanner } from "@/components/homepage/HomeProgressBanner";
import { ChapterOverviewGrid } from "@/components/homepage/ChapterOverviewGrid";
import { highlightCode } from "@/lib/highlight";

const OVERVIEW_ITEMS = [
  {
    icon: BookOpen,
    title: "9 Structured Chapters",
    detail: "From Python introduction to all seven operator families.",
  },
  {
    icon: Terminal,
    title: "Interactive Playground",
    detail: "Real Python execution in your browser with instant feedback.",
  },
  {
    icon: CheckSquare,
    title: "Practice Exercises",
    detail: "Six quiz formats with clear explanations for every answer.",
  },
  {
    icon: MessageSquare,
    title: "AI Python Tutor",
    detail: "Beginner-friendly help aligned strictly with the syllabus.",
  },
];

const PLAYGROUND_SNIPPET = `x = 12
y = 5

print("Sum:", x + y)
print("Floor division:", x // y)
print("Remainder:", x % y)
print("Is x greater?", x > y)`;

const AI_QUICK_PROMPTS = [
  "Explain Python variables.",
  "What is the difference between == and is?",
  "Why am I getting a syntax error?",
];

export default async function HomePage() {
  const playgroundHtml = await highlightCode(PLAYGROUND_SNIPPET, "python");

  return (
    <div className="pb-16">
      {/* 1. Hero Section */}
      <section className="border-b border-border bg-surface">
        <PageContainer className="py-10 sm:py-12 lg:py-14">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-ink">
                <span
                  className="h-2 w-2 rounded-full bg-yellow-accent"
                  aria-hidden="true"
                />
                <span>Python Learning Platform</span>
              </div>

              <h1 className="mt-4 text-[34px] font-bold leading-[1.15] tracking-tight text-ink sm:text-[44px] lg:text-[48px]">
                Learn Python — From Basics to Operators
              </h1>

              <p className="mt-4 max-w-xl text-base leading-[1.6] text-ink-secondary sm:text-[17px]">
                Master Python fundamentals through clear explanations,
                interactive examples, real coding practice, and AI-powered
                guidance.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/learn/introduction-to-python"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-brand px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-brand-hover"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/playground"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-border bg-surface px-5 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface-muted"
                >
                  <Code2 className="h-4 w-4 text-brand-accent" aria-hidden="true" />
                  <span>Try Python Code</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <HeroCodePreview />
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 2. Compact Learning Overview */}
      <section className="border-b border-border bg-surface-muted">
        <PageContainer className="py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OVERVIEW_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-[10px] border border-border bg-surface p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-brand-light text-brand-accent">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-ink">
                      {item.title}
                    </h2>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-secondary">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 3. Real Progress Overview */}
      <section className="pt-10">
        <PageContainer>
          <HomeProgressBanner />
        </PageContainer>
      </section>

      {/* 4. Nine Chapters Grid */}
      <section className="pt-12">
        <PageContainer>
          <SectionHeading
            eyebrow="Curriculum"
            title="Nine Focused Chapters"
            description="Every chapter follows one consistent structure: learning objectives, clear explanations, runnable examples, common mistakes, and practice checks."
            action={
              <Link
                href="/learn"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent hover:text-brand-accent"
              >
                <span>View curriculum</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-6">
            <ChapterOverviewGrid />
          </div>
        </PageContainer>
      </section>

      {/* 5. Interactive Playground Preview */}
      <section className="pt-14">
        <PageContainer>
          <div className="grid grid-cols-1 items-center gap-8 rounded-[12px] border border-border bg-surface p-6 sm:p-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                Interactive Playground
              </p>
              <h2 className="mt-1.5 text-[24px] font-semibold leading-tight text-ink">
                Write and run real Python in your browser
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-secondary">
                Test examples, tweak numbers and strings, and inspect real Python
                output or error messages without installing software.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/playground"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
                >
                  <span>Open Playground</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/examples"
                  className="inline-flex h-10 items-center justify-center rounded-[8px] border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
                >
                  Browse Examples
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-[10px] border border-border bg-surface-muted">
                <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs font-medium text-ink-secondary">
                  <span className="font-mono text-ink">operators_check.py</span>
                  <span>Pyodide Worker · Ready on demand</span>
                </div>
                <div
                  className="shiki-container bg-surface"
                  dangerouslySetInnerHTML={{ __html: playgroundHtml }}
                />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 6. Practice & AI Assistant Split Section */}
      <section className="pt-14">
        <PageContainer>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Practice & Quiz Card */}
            <div className="flex flex-col justify-between rounded-[12px] border border-border bg-surface p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                  Practice & Quizzes
                </p>
                <h2 className="mt-1.5 text-[22px] font-semibold text-ink">
                  Check your understanding step by step
                </h2>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-secondary">
                  Practice with multiple-choice, true/false, fill-in-the-blank,
                  predict-the-output, find-the-error, and live coding challenges.
                  Every question explains why the answer is right.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/practice"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
                >
                  <span>Start Practice Quiz</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/cheat-sheet"
                  className="inline-flex h-10 items-center justify-center rounded-[8px] border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
                >
                  Cheat Sheet
                </Link>
              </div>
            </div>

            {/* AI Tutor Introduction */}
            <div className="flex flex-col justify-between rounded-[12px] border border-border bg-surface p-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-accent">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-accent" aria-hidden="true" />
                  <span>AI Python Assistant</span>
                </div>
                <h2 className="mt-1.5 text-[22px] font-semibold text-ink">
                  Need Help Understanding Python?
                </h2>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-secondary">
                  Ask questions, understand errors, and get step-by-step
                  explanations from your AI Python tutor.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {AI_QUICK_PROMPTS.map((prompt) => (
                    <Link
                      key={prompt}
                      href={`/assistant?prompt=${encodeURIComponent(prompt)}`}
                      className="rounded-full border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand hover:bg-brand-light hover:text-brand-accent"
                    >
                      {prompt}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/assistant"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-brand bg-brand-light px-4 text-sm font-medium text-brand-accent transition-colors hover:bg-brand hover:text-white"
                >
                  <span>Ask the AI Tutor</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
