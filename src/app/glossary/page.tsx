import React from "react";
import type { Metadata } from "next";
import { Breadcrumbs, PageContainer } from "@/components/layout/LayoutPrimitives";
import { GlossaryWorkspace } from "@/components/reference/GlossaryWorkspace";

export const metadata: Metadata = {
  title: "Python Glossary",
  description:
    "Beginner-friendly dictionary of Python programming terms covering syntax, variables, data types, strings, booleans, and operators.",
};

export default function GlossaryPage() {
  return (
    <div className="py-8 sm:py-10">
      <PageContainer>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Glossary" }]}
        />

        <div className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Python Dictionary
          </p>
          <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-[36px]">
            Beginner Python Glossary
          </h1>
          <p className="mt-1.5 max-w-2xl text-base text-ink-secondary">
            Clear, plain-English definitions and small code examples for every
            core term used across the nine chapters.
          </p>
        </div>

        <GlossaryWorkspace />
      </PageContainer>
    </div>
  );
}

