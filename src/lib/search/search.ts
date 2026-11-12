import { CHAPTERS } from "@/data/chapters";
import type { SearchDocument } from "@/types/search";

function buildBaseDocuments(): SearchDocument[] {
  const docs: SearchDocument[] = [];

  for (const chapter of CHAPTERS) {
    docs.push({
      id: `chapter-${chapter.slug}`,
      title: `Chapter ${String(chapter.number).padStart(2, "0")}: ${chapter.title}`,
      description: chapter.description,
      category: "Chapter",
      href: `/learn/${chapter.slug}`,
      keywords: [chapter.title, chapter.shortTitle, ...chapter.topics],
      sectionLabel: "Curriculum",
    });

    for (const topic of chapter.topics) {
      docs.push({
        id: `topic-${chapter.slug}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        title: topic,
        description: `Covered in Chapter ${chapter.number}: ${chapter.title}`,
        category: "Concept",
        href: `/learn/${chapter.slug}`,
        keywords: [topic, chapter.title, chapter.shortTitle],
        sectionLabel: `Ch ${chapter.number}: ${chapter.shortTitle}`,
      });
    }
  }

  return docs;
}

export function searchPlatformContent(
  query: string,
  extraDocs: SearchDocument[] = []
): SearchDocument[] {
  const normalized = query.trim().toLowerCase();
  const allDocs = [...buildBaseDocuments(), ...extraDocs];

  if (!normalized) {
    // Return the 9 chapters first when query is empty
    return allDocs.filter((doc) => doc.category === "Chapter").slice(0, 9);
  }

  const terms = normalized.split(/\s+/).filter(Boolean);

  const scored = allDocs
    .map((doc) => {
      const titleLower = doc.title.toLowerCase();
      const descLower = doc.description.toLowerCase();
      const keywordsJoined = doc.keywords.join(" ").toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (titleLower === term) score += 12;
        else if (titleLower.startsWith(term)) score += 8;
        else if (titleLower.includes(term)) score += 5;

        if (keywordsJoined.includes(term)) score += 3;
        if (descLower.includes(term)) score += 2;
      }

      // Require every term to appear somewhere
      const matchesAll = terms.every(
        (term) =>
          titleLower.includes(term) ||
          descLower.includes(term) ||
          keywordsJoined.includes(term)
      );

      return matchesAll ? { doc, score } : null;
    })
    .filter((item): item is { doc: SearchDocument; score: number } => item !== null)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 14).map((item) => item.doc);
}

