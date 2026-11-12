import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Breadcrumbs, PageContainer } from "@/components/layout/LayoutPrimitives";
import { LoadingState } from "@/components/common/StateBlocks";
import { AssistantWorkspace } from "@/components/assistant/AssistantWorkspace";

export const metadata: Metadata = {
  title: "AI Python Tutor",
  description:
    "Ask questions, debug Python errors, and get step-by-step beginner explanations powered by Groq and aligned to the 9-chapter syllabus.",
};

export default function AssistantPage() {
  return (
    <div className="py-8 sm:py-10">
      <PageContainer>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "AI Assistant" }]}
        />

        <div className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Guided Support
          </p>
          <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-[36px]">
            AI Python Assistant
          </h1>
          <p className="mt-1.5 max-w-2xl text-base text-ink-secondary">
            Get clear explanations, line-by-line code walkthroughs, and error
            help aligned with Chapters 1 through 9.
          </p>
        </div>

        <Suspense fallback={<LoadingState label="Loading AI Python Tutor..." />}>
          <AssistantWorkspace />
        </Suspense>
      </PageContainer>
    </div>
  );
}

