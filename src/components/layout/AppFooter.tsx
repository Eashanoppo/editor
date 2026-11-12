import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { CHAPTERS } from "@/data/chapters";
import { PythonLogoMark } from "@/components/common/PythonLogoMark";

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-[1280px] px-[18px] py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand summary */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <PythonLogoMark className="h-7 w-7" />
              <span className="text-[15px] font-semibold text-ink">
                Python Learning
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
              A calm, beginner-focused Python learning platform covering Basics
              through Operators with real in-browser execution.
            </p>
          </div>

          {/* Learning chapters */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
              Learning
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-ink-secondary md:grid-cols-1">
              {CHAPTERS.map((chapter) => (
                <li key={chapter.slug}>
                  <Link
                    href={`/learn/${chapter.slug}`}
                    className="transition-colors hover:text-brand-accent"
                  >
                    {String(chapter.number).padStart(2, "0")}. {chapter.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
              Tools
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
              <li>
                <Link href="/playground" className="hover:text-brand-accent">
                  Python Playground
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-brand-accent">
                  Practice & Quizzes
                </Link>
              </li>
              <li>
                <Link href="/examples" className="hover:text-brand-accent">
                  Examples Library
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-brand-accent">
                  AI Python Tutor
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-accent">
                  Learning Dashboard
                </Link>
              </li>
              <li>
                <Link href="/cheat-sheet" className="hover:text-brand-accent">
                  Python Cheat Sheet
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-brand-accent">
                  Python Glossary
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
              Resources
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
              <li>
                <a
                  href="https://docs.python.org/3/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-brand-accent"
                >
                  <span>Python Official Docs</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.w3schools.com/python/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-brand-accent"
                >
                  <span>W3Schools Python Tutorial</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-accent">
                  About This Project & FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-ink-secondary sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              A project of{" "}
              <a
                href="https://unleft.space"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-accent hover:underline"
              >
                UNLEFT LLC
              </a>
            </span>
            <span aria-hidden="true">·</span>
            <span>All rights reserved to Golam Rasul</span>
          </div>
          <p>Progress is stored locally in your browser.</p>
        </div>
      </div>
    </footer>
  );
}
