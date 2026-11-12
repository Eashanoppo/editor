import fs from "node:fs/promises";
import path from "node:path";
import React from "react";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import { CodeExample } from "@/components/lessons/CodeExample";
import { CommonMistake } from "@/components/lessons/CommonMistake";
import {
  LearningObjectives,
  LessonNote,
  SyntaxBox,
} from "@/components/lessons/LessonPrimitives";
import { QuickPractice } from "@/components/lessons/QuickPractice";
import { slugifyHeading } from "@/lib/utils";
import type { TocHeading } from "@/types/curriculum";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "python");

const CHAPTER_FILE_MAP: Record<string, string> = {
  "introduction-to-python": "01-introduction-to-python.mdx",
  "python-syntax": "02-python-syntax.mdx",
  "python-output": "03-python-output.mdx",
  "python-variables": "04-python-variables.mdx",
  "python-data-types": "05-python-data-types.mdx",
  "python-numbers": "06-python-numbers.mdx",
  "python-strings": "07-python-strings.mdx",
  "python-booleans": "08-python-booleans.mdx",
  "python-operators": "09-python-operators.mdx",
};

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return extractTextFromChildren(children.props.children);
  }
  return "";
}

function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = markdown.split(/\r?\n/);
  let inCodeFence = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2]
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .trim();
      headings.push({
        id: slugifyHeading(rawText),
        text: rawText,
        level,
      });
    }
  }
  return headings;
}

export async function loadChapterMdxData(slug: string): Promise<{
  content: string;
  headings: TocHeading[];
} | null> {
  "use cache";
  const fileName = CHAPTER_FILE_MAP[slug];
  if (!fileName) return null;

  const fullPath = path.join(CONTENT_DIR, fileName);
  const raw = await fs.readFile(fullPath, "utf8");
  const { content } = matter(raw);
  const headings = extractHeadings(content);
  return { content, headings };
}

const mdxComponents = {
  CodeExample,
  CommonMistake,
  QuickPractice,
  LearningObjectives,
  SyntaxBox,
  LessonNote,
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = slugifyHeading(extractTextFromChildren(children));
    return (
      <h2
        id={id}
        className="mt-10 mb-3 scroll-mt-24 text-[22px] font-semibold leading-snug tracking-tight text-ink sm:text-[26px]"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = slugifyHeading(extractTextFromChildren(children));
    return (
      <h3
        id={id}
        className="mt-7 mb-2.5 scroll-mt-24 text-[18px] font-semibold leading-snug text-ink sm:text-[20px]"
        {...props}
      >
        {children}
      </h3>
    );
  },
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="my-3.5 text-[15.5px] sm:text-base leading-[1.65] text-ink"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="my-3.5 list-disc space-y-2 pl-6 text-[15.5px] sm:text-base leading-[1.6] text-ink"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="my-3.5 list-decimal space-y-2 pl-6 text-[15.5px] sm:text-base leading-[1.6] text-ink"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-ink" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-ink" {...props}>
      {children}
    </strong>
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="rounded-[5px] border border-border bg-surface-secondary px-1.5 py-0.5 font-mono text-[13.5px] text-ink"
      {...props}
    >
      {children}
    </code>
  ),
  blockquote: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-4 border-l-2 border-brand-accent bg-surface-muted py-2 pl-4 pr-3 text-sm text-ink-secondary"
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-5 overflow-x-auto rounded-[10px] border border-border bg-surface">
      <table className="w-full border-collapse text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className="border-b border-border bg-surface-muted text-xs font-semibold uppercase tracking-wider text-ink-secondary"
      {...props}
    >
      {children}
    </thead>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 font-semibold text-ink" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border-t border-border px-4 py-2.5 text-ink"
      {...props}
    >
      {children}
    </td>
  ),
};

export async function MdxLessonBody({ source }: { source: string }) {
  const { default: MDXContent } = await evaluate(source, {
    ...(runtime as Parameters<typeof evaluate>[1]),
    remarkPlugins: [remarkGfm],
  });

  return (
    <div className="lesson-mdx-content">
      <MDXContent components={mdxComponents} />
    </div>
  );
}

