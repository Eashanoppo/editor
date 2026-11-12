import React from "react";
import { Target } from "lucide-react";
import { highlightCode } from "@/lib/highlight";

export function LearningObjectives({ items }: { items: string[] }) {
  return (
    <div className="my-6 border-l-2 border-brand bg-surface-muted py-3 pl-4 pr-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-accent">
        <Target className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Learning Objectives</span>
      </div>
      <p className="mt-1 text-sm text-ink-secondary">
        After completing this chapter, you will be able to:
      </p>
      <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-[15px] text-ink">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export async function SyntaxBox({
  label = "Syntax",
  syntax,
  note,
}: {
  label?: string;
  syntax: string;
  note?: string;
}) {
  const html = await highlightCode(syntax.trim(), "python");

  return (
    <div className="my-4 overflow-hidden rounded-[8px] border border-border bg-surface-muted">
      <div className="border-b border-border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
        {label}
      </div>
      <div
        className="shiki-container bg-surface"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {note ? (
        <p className="border-t border-border px-3.5 py-2 text-xs text-ink-secondary">
          {note}
        </p>
      ) : null}
    </div>
  );
}

export function LessonNote({
  title = "Key Takeaway",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-5 rounded-[8px] border border-brand-border bg-brand-light px-4 py-3.5 text-sm text-ink">
      <p className="font-semibold text-brand-accent">{title}</p>
      <div className="mt-1 leading-relaxed">{children}</div>
    </div>
  );
}

