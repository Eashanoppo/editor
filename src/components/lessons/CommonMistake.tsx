import React from "react";
import { AlertTriangle } from "lucide-react";
import { highlightCode } from "@/lib/highlight";

interface CommonMistakeProps {
  title?: string;
  explanation: string;
  wrongCode: string;
  correctCode: string;
}

export async function CommonMistake({
  title = "Common mistake",
  explanation,
  wrongCode,
  correctCode,
}: CommonMistakeProps) {
  const [wrongHtml, correctHtml] = await Promise.all([
    highlightCode(wrongCode.trim(), "python"),
    highlightCode(correctCode.trim(), "python"),
  ]);

  return (
    <div className="my-6 rounded-[10px] border border-warning-border bg-warning-bg p-4 sm:p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-warning">
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{title}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink">
        {explanation}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="overflow-hidden rounded-[8px] border border-error-border bg-surface">
          <div className="border-b border-error-border bg-error-bg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-error">
            Incorrect
          </div>
          <div
            className="shiki-container bg-surface"
            dangerouslySetInnerHTML={{ __html: wrongHtml }}
          />
        </div>

        <div className="overflow-hidden rounded-[8px] border border-success-border bg-surface">
          <div className="border-b border-success-border bg-success-bg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-success">
            Correct
          </div>
          <div
            className="shiki-container bg-surface"
            dangerouslySetInnerHTML={{ __html: correctHtml }}
          />
        </div>
      </div>
    </div>
  );
}

