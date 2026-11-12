import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Breadcrumbs, PageContainer } from "@/components/layout/LayoutPrimitives";
import { FaqAccordion } from "@/components/reference/FaqAccordion";

export const metadata: Metadata = {
  title: "About & FAQ",
  description:
    "Learn about the Python Learning Platform, its beginner-focused curriculum, browser execution with Pyodide, AI integration, and FAQ.",
};

const TECHNOLOGIES = [
  { name: "Next.js App Router & TypeScript", role: "Application framework & type safety" },
  { name: "Tailwind CSS", role: "Light-only responsive design system" },
  { name: "MDX & Shiki", role: "Structured lessons & syntax highlighting" },
  { name: "CodeMirror 6", role: "Accessible browser code editor" },
  { name: "Pyodide (WebAssembly + Web Worker)", role: "Real client-side Python 3 execution" },
  { name: "Groq API (Serverless Route Handler)", role: "Optional AI Python Tutor with protected credentials" },
  { name: "Browser LocalStorage", role: "Local lesson progress, quiz scores & chat history" },
];

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-10">
      <PageContainer>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "About & FAQ" }]}
        />

        <div className="mt-4 mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Project Overview
          </p>
          <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-[36px]">
            About Python Learning
          </h1>
          <p className="mt-2.5 text-base leading-relaxed text-ink-secondary">
            Python Learning is an interactive educational web platform built for
            school students and first-time programmers. Its goal is to make
            Python fundamentals—from first print statements to all seven
            operator families—clear, hands-on, and easy to practice directly in
            the browser.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left details */}
          <div className="space-y-6 lg:col-span-7">
            <section className="rounded-[12px] border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-ink">
                Curriculum Scope & Audience
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                Designed specifically for beginners and exam preparation, the
                platform covers nine focused chapters: Introduction to Python,
                Syntax, Output, Variables, Data Types, Numbers, Strings,
                Booleans, and Operators.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link
                  href="/learn"
                  className="inline-flex h-9 items-center rounded-[8px] bg-brand px-3.5 text-xs font-medium text-white hover:bg-brand-hover"
                >
                  Browse All 9 Chapters
                </Link>
                <Link
                  href="/playground"
                  className="inline-flex h-9 items-center rounded-[8px] border border-border bg-surface px-3.5 text-xs font-medium text-ink hover:bg-surface-muted"
                >
                  Open Python Playground
                </Link>
              </div>
            </section>

            <section className="rounded-[12px] border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-ink">
                How Code Execution & AI Tutoring Work
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-secondary">
                <p>
                  <strong className="text-ink">
                    In-Browser Python Execution:
                  </strong>{" "}
                  Your code executes locally on your device inside a Web Worker
                  powered by Pyodide (CPython compiled to WebAssembly). No
                  traditional backend or database is used, and long-running scripts
                  are guarded by an automatic 5-second timeout.
                </p>
                <p>
                  <strong className="text-ink">
                    AI Python Assistant:
                  </strong>{" "}
                  Questions sent to the AI tutor pass through a minimal
                  serverless Next.js Route Handler (<code>/api/assistant</code>)
                  to the official Groq API, ensuring private API credentials
                  never appear in browser code.
                </p>
              </div>
            </section>
          </div>

          {/* Right technologies & external references */}
          <div className="space-y-6 lg:col-span-5">
            <section className="rounded-[12px] border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-ink">
                Technologies Used
              </h2>
              <ul className="mt-3 divide-y divide-border text-sm">
                {TECHNOLOGIES.map((tech) => (
                  <li key={tech.name} className="py-2.5">
                    <p className="font-medium text-ink">{tech.name}</p>
                    <p className="text-xs text-ink-secondary">{tech.role}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[12px] border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-ink">
                Further Learning Resources
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                Explore these trusted external references for additional Python
                reading and documentation:
              </p>
              <ul className="mt-3 space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://docs.python.org/3/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-brand-accent hover:underline"
                  >
                    <span>Official Python 3 Documentation</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.w3schools.com/python/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-brand-accent hover:underline"
                  >
                    <span>W3Schools Python Tutorial</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-12 max-w-4xl">
          <h2 className="mb-4 text-[22px] font-semibold text-ink">
            Frequently Asked Questions
          </h2>
          <FaqAccordion />
        </section>
      </PageContainer>
    </div>
  );
}

