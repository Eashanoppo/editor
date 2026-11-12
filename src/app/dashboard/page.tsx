import React from "react";
import type { Metadata } from "next";
import { Breadcrumbs, PageContainer } from "@/components/layout/LayoutPrimitives";
import { DashboardWorkspace } from "@/components/dashboard/DashboardWorkspace";

export const metadata: Metadata = {
  title: "Learning Dashboard",
  description:
    "Track your completed chapters, overall learning progress, and quiz scores saved locally in your browser.",
};

export default function DashboardPage() {
  return (
    <div className="py-8 sm:py-10">
      <PageContainer>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
        />

        <div className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Progress Overview
          </p>
          <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-[36px]">
            Your Learning Progress
          </h1>
          <p className="mt-1.5 max-w-2xl text-base text-ink-secondary">
            Continue learning Python and track your actual completed chapters
            and practice scores stored locally in your browser.
          </p>
        </div>

        <DashboardWorkspace />
      </PageContainer>
    </div>
  );
}

