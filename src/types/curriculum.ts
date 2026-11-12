export interface ChapterMeta {
  number: number;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  readingMinutes: number;
  topics: string[];
  objectives: string[];
  starterCode: string;
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export interface PythonExampleItem {
  id: string;
  title: string;
  category:
    | "Hello World"
    | "Addition"
    | "Variables"
    | "Data Types"
    | "Strings"
    | "Numbers"
    | "Boolean Expressions"
    | "Arithmetic Operators"
    | "Comparison Operators"
    | "Logical Operators";
  chapterSlug: string;
  code: string;
  explanation: string;
  expectedOutput: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  example?: string;
  chapterSlug: string;
  chapterTitle: string;
}

