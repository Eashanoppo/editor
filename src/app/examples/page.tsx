import React from "react";
import type { Metadata } from "next";
import { Breadcrumbs, PageContainer } from "@/components/layout/LayoutPrimitives";
import { ExamplesWorkspace } from "@/components/examples/ExamplesWorkspace";

export const metadata: Metadata = {
  title: "Python Examples Library",
  description:
    "Browse tested, beginner-friendly Python code examples covering Hello World, variables, data types, strings, numbers, booleans, and operators.",
};

export default function ExamplesPage() {
  return (
    <div className="py-8 sm:py-10">
      <PageContainer>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Examples" }]}
        />

        <div className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Code Reference
          </p>
          <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-[36px]">
            Python Examples Library
          </h1>
          <p className="mt-1.5 max-w-2xl text-base text-ink-secondary">
            Ready-to-run Python examples aligned with all nine chapters. Copy
            any snippet or open it directly in the interactive Playground.
          </p>
        </div>

        <ExamplesWorkspace />
      </PageContainer>
    </div>
  );
}

