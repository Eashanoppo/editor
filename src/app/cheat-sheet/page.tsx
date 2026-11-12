import React from "react";
import type { Metadata } from "next";
import { Breadcrumbs, PageContainer } from "@/components/layout/LayoutPrimitives";
import { CheatSheetWorkspace } from "@/components/reference/CheatSheetWorkspace";

export const metadata: Metadata = {
  title: "Python Cheat Sheet",
  description:
    "Quick reference for Python variables, data types, print(), strings, booleans, and all seven Python operator categories.",
};

export default function CheatSheetPage() {
  return (
    <div className="py-8 sm:py-10">
      <PageContainer>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Cheat Sheet" }]}
        />

        <div className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Quick Reference
          </p>
          <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-[36px]">
            Python Basics & Operators Cheat Sheet
          </h1>
          <p className="mt-1.5 max-w-2xl text-base text-ink-secondary">
            Fast syntax reminders for every chapter and all seven Python
            operator groups. Copy any snippet or open it in the Playground.
          </p>
        </div>

        <CheatSheetWorkspace />
      </PageContainer>
    </div>
  );
}

