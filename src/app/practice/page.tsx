import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Breadcrumbs, PageContainer } from "@/components/layout/LayoutPrimitives";
import { LoadingState } from "@/components/common/StateBlocks";
import { PracticeWorkspace } from "@/components/quizzes/PracticeWorkspace";

export const metadata: Metadata = {
  title: "Practice & Quizzes",
  description:
    "Test your Python knowledge with multiple-choice, true/false, fill-in-the-blank, predict-the-output, find-the-error, and live coding challenges.",
};

export default function PracticePage() {
  return (
    <div className="py-8 sm:py-10">
      <PageContainer>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Practice" }]}
        />

        <div className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Check Understanding
          </p>
          <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-[36px]">
            Practice & Quizzes
          </h1>
          <p className="mt-1.5 max-w-2xl text-base text-ink-secondary">
            Practice by chapter or question format. Coding challenges execute
            your Python solution live inside the browser runtime.
          </p>
        </div>

        <Suspense fallback={<LoadingState label="Loading practice quizzes..." />}>
          <PracticeWorkspace />
        </Suspense>
      </PageContainer>
    </div>
  );
}

