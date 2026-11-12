export type SearchResultCategory =
  | "Chapter"
  | "Concept"
  | "Operator"
  | "Example"
  | "Glossary";

export interface SearchDocument {
  id: string;
  title: string;
  description: string;
  category: SearchResultCategory;
  href: string;
  keywords: string[];
  sectionLabel: string;
}

