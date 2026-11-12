import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Breadcrumbs, PageContainer } from "@/components/layout/LayoutPrimitives";
import { LoadingState } from "@/components/common/StateBlocks";
import { PlaygroundWorkspace } from "@/components/playground/PlaygroundWorkspace";

export const metadata: Metadata = {
  title: "Python Playground",
  description:
    "Write, edit, and execute real Python code directly in your browser using CodeMirror 6 and Pyodide WebAssembly.",
};

export default function PlaygroundPage() {
  return (
    <div className="py-8 sm:py-10">
      <PageContainer>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Playground" }]}
        />

        <div className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Interactive Runner
          </p>
          <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-[36px]">
            Python Playground
          </h1>
          <p className="mt-1.5 max-w-2xl text-base text-ink-secondary">
            Experiment with variables, strings, numbers, and operators. Code
            executes locally in a dedicated browser Web Worker via Pyodide.
          </p>
        </div>

        <Suspense fallback={<LoadingState label="Preparing Python editor..." />}>
          <PlaygroundWorkspace />
        </Suspense>
      </PageContainer>
    </div>
  );
}

