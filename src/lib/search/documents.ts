import { CHEAT_SHEET_SECTIONS } from "@/data/cheat-sheet";
import { PYTHON_EXAMPLES } from "@/data/examples";
import { GLOSSARY_ENTRIES } from "@/data/glossary";
import type { SearchDocument } from "@/types/search";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Builds the non-chapter search index entries covering runnable examples,
 * cheat-sheet items & Python operators, and glossary definitions.
 */
export function getAllExtraSearchDocuments(): SearchDocument[] {
  const docs: SearchDocument[] = [];

  for (const example of PYTHON_EXAMPLES) {
    docs.push({
      id: `example-${example.id}`,
      title: example.title,
      description: example.explanation,
      category: "Example",
      href: `/playground?example=${encodeURIComponent(example.id)}`,
      keywords: [example.title, example.category, example.chapterSlug, example.code],
      sectionLabel: example.category,
    });
  }

  for (const section of CHEAT_SHEET_SECTIONS) {
    const isOperatorSection = section.id.endsWith("-operators");
    for (const item of section.items) {
      docs.push({
        id: `cheatsheet-${section.id}-${slugify(item.symbolOrName) || "op"}`,
        title: `${item.symbolOrName} — ${section.title}`,
        description: item.description,
        category: isOperatorSection ? "Operator" : "Concept",
        href: `/cheat-sheet#${section.id}`,
        keywords: [
          item.symbolOrName,
          section.title,
          section.summary,
          item.exampleCode,
        ],
        sectionLabel: "Cheat Sheet",
      });
    }
  }

  for (const entry of GLOSSARY_ENTRIES) {
    docs.push({
      id: `glossary-${slugify(entry.term)}`,
      title: entry.term,
      description: entry.definition,
      category: "Glossary",
      href: "/glossary",
      keywords: [entry.term, entry.chapterTitle, entry.example ?? ""],
      sectionLabel: entry.chapterTitle,
    });
  }

  return docs;
}

