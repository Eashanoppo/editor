import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { CopyButton } from "@/components/common/CopyButton";
import { PythonLogoMark } from "@/components/common/PythonLogoMark";
import { highlightCode } from "@/lib/highlight";

const HERO_SAMPLE_CODE = `# Chapter 4 & 9: Variables and Operators
language = "Python"
chapters = 9
progress = 3

remaining = chapters - progress
print(f"Learning {language}!")
print("Chapters left:", remaining)
print("Ready to code?", remaining >= 0)`;

export async function HeroCodePreview() {
  const highlightedHtml = await highlightCode(HERO_SAMPLE_CODE, "python");

  return (
    <div className="rounded-[12px] border border-border bg-surface shadow-xs overflow-hidden">
      {/* Light window bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-2.5">
        <div className="flex items-center gap-2">
          <PythonLogoMark className="h-5 w-5" />
          <span className="font-mono text-xs font-medium text-ink">
            basics_demo.py
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={HERO_SAMPLE_CODE} />
          <Link
            href="/playground"
            className="inline-flex h-7 items-center gap-1.5 rounded-[6px] bg-brand px-2.5 text-xs font-medium text-white transition-colors hover:bg-brand-hover"
          >
            <Play className="h-3 w-3" aria-hidden="true" />
            <span>Run</span>
          </Link>
        </div>
      </div>

      {/* Highlighted code */}
      <div
        className="shiki-container border-b border-border bg-surface"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />

      {/* Expected output preview */}
      <div className="bg-surface-muted px-4 py-3">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
          Expected Output
        </p>
        <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-ink overflow-x-auto">
          {`Learning Python!\nChapters left: 6\nReady to code? True`}
        </pre>
      </div>
    </div>
  );
}

