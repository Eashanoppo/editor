import type { ChapterMeta } from "@/types/curriculum";

export const CHAPTERS: ChapterMeta[] = [
  {
    number: 1,
    slug: "introduction-to-python",
    title: "Introduction to Python",
    shortTitle: "Introduction",
    description:
      "Learn what Python is, who created it, why beginners love it, and where it is used in the real world.",
    readingMinutes: 5,
    topics: [
      "What is Python?",
      "Who created Python?",
      "When was Python created?",
      "Why is Python popular?",
      "What is Python used for?",
      "Features and advantages",
      "Real-world applications",
    ],
    objectives: [
      "Explain what Python is and why it is a high-level programming language.",
      "Identify Guido van Rossum as Python's creator and 1991 as its release year.",
      "List key features that make Python friendly for first-time programmers.",
      "Recognize common real-world areas where Python is applied.",
    ],
    starterCode: `# Welcome to Python!
print("Hello, Python!")
print("Python was released in", 1991)
`,
  },
  {
    number: 2,
    slug: "python-syntax",
    title: "Python Syntax",
    shortTitle: "Syntax",
    description:
      "Understand Python's basic syntax rules, indentation, comments, and how to write your first program.",
    readingMinutes: 6,
    topics: [
      "What is Python syntax?",
      "Basic syntax rules",
      "Indentation",
      "Comments",
      "First Python program",
      "Understanding print()",
    ],
    objectives: [
      "Explain why clean indentation is required in Python.",
      "Write single-line and multi-line comments to document code.",
      "Recognize case-sensitivity in Python keywords and function names.",
      "Write and run a complete beginner Python program.",
    ],
    starterCode: `# Python Syntax Basics
# Comments start with a hash symbol (#)

if 10 > 5:
    print("Indentation defines a block in Python!")
    print("10 is indeed greater than 5.")
`,
  },
  {
    number: 3,
    slug: "python-output",
    title: "Python Output",
    shortTitle: "Output",
    description:
      "Master the print() function to display text, numbers, multiple values, custom separators, and line endings.",
    readingMinutes: 6,
    topics: [
      "print() function",
      "Printing text and numbers",
      "Printing multiple values",
      "Separators using sep",
      "Line endings using end",
    ],
    objectives: [
      "Display strings and numbers accurately using print().",
      "Pass multiple values to a single print() statement.",
      "Customize spacing between printed values with the sep parameter.",
      "Control line breaks at the end of output using the end parameter.",
    ],
    starterCode: `# Exploring print() options
print("Learning", "Python", "is", "fun", sep="-")
print("Loading", end="... ")
print("Done!")
print("Score:", 100)
`,
  },
  {
    number: 4,
    slug: "python-variables",
    title: "Python Variables",
    shortTitle: "Variables",
    description:
      "Store and reuse information using variables, follow naming rules, assign multiple values, and understand basic scope.",
    readingMinutes: 7,
    topics: [
      "What are variables?",
      "Creating variables",
      "Naming rules",
      "Assigning multiple values",
      "Global and local variables",
      "Variable output",
      "Understanding variable types",
    ],
    objectives: [
      "Create and reassign variables without explicit type declarations.",
      "Apply valid Python variable naming rules and snake_case style.",
      "Assign multiple variables in one line or share one value across variables.",
      "Distinguish between global variables and local variables at a beginner level.",
    ],
    starterCode: `# Creating and using variables
student_name = "Maya"
grade_level = 9
score, max_score = 45, 50

print("Student:", student_name)
print("Grade:", grade_level)
print("Result:", score, "out of", max_score)
`,
  },
  {
    number: 5,
    slug: "python-data-types",
    title: "Python Data Types",
    shortTitle: "Data Types",
    description:
      "Explore core data types (str, int, float, bool), inspect values with type(), and convert between types safely.",
    readingMinutes: 7,
    topics: [
      "What are data types?",
      "str",
      "int",
      "float",
      "bool",
      "type() function",
      "Type conversion",
    ],
    objectives: [
      "Identify Python's core scalar types: str, int, float, and bool.",
      "Inspect any variable's data type using the type() function.",
      "Convert values safely using int(), float(), str(), and bool().",
      "Avoid common type mismatch errors when combining text and numbers.",
    ],
    starterCode: `# Inspecting and converting data types
language = "Python"
version = 3
pi_approx = 3.14
is_ready = True

print(type(language), type(version), type(pi_approx), type(is_ready))
age_text = "15"
age_number = int(age_text)
print("Next year:", age_number + 1)
`,
  },
  {
    number: 6,
    slug: "python-numbers",
    title: "Python Numbers",
    shortTitle: "Numbers",
    description:
      "Work with integers, floating-point numbers, introductory complex numbers, number conversion, and random numbers.",
    readingMinutes: 6,
    topics: [
      "Integers",
      "Floating-point numbers",
      "Complex numbers",
      "Type conversion",
      "Random numbers",
    ],
    objectives: [
      "Distinguish between int, float, and complex numeric types.",
      "Understand scientific notation with e or E in floats.",
      "Convert between numeric types using int(), float(), and complex().",
      "Generate beginner-friendly random numbers using Python's random module.",
    ],
    starterCode: `import random

whole_num = 42
decimal_num = 9.75
complex_num = 2 + 3j

print("int:", whole_num, "float:", decimal_num, "complex:", complex_num)
print("Converted to float:", float(whole_num))
print("Random number (1 to 10):", random.randint(1, 10))
`,
  },
  {
    number: 7,
    slug: "python-strings",
    title: "Python Strings",
    shortTitle: "Strings",
    description:
      "Create single-line and multiline strings, measure length with len(), access characters by index, and format strings.",
    readingMinutes: 8,
    topics: [
      "What are strings?",
      "Assigning strings",
      "Multiline strings",
      "Strings as arrays",
      "len()",
      "Accessing characters",
      "Basic string formatting",
    ],
    objectives: [
      "Create strings with single quotes, double quotes, and triple quotes.",
      "Access individual characters and slices using zero-based indexing.",
      "Measure string length using the len() function.",
      "Combine variables and text cleanly using f-strings.",
    ],
    starterCode: `# Working with Python strings
greeting = "Hello, Python!"
print("Length:", len(greeting))
print("First character:", greeting[0])
print("Last character:", greeting[-1])

name = "Alex"
lessons = 7
print(f"{name} has reached Chapter {lessons}.")
`,
  },
  {
    number: 8,
    slug: "python-booleans",
    title: "Python Booleans",
    shortTitle: "Booleans",
    description:
      "Understand True and False values, evaluate expressions with bool(), and write clear boolean comparisons.",
    readingMinutes: 5,
    topics: [
      "Boolean values",
      "True and False",
      "Evaluating expressions",
      "Boolean comparisons",
    ],
    objectives: [
      "Use True and False literals with proper capitalization.",
      "Understand how comparison expressions return boolean results.",
      "Predict which values Python evaluates as truthy or falsy with bool().",
    ],
    starterCode: `# Python Booleans
is_enrolled = True
has_passed = 85 >= 60

print("Enrolled:", is_enrolled)
print("Passed:", has_passed)
print("bool(0):", bool(0))
print("bool('Python'):", bool("Python"))
`,
  },
  {
    number: 9,
    slug: "python-operators",
    title: "Python Operators",
    shortTitle: "Operators",
    description:
      "Master all seven Python operator families: Arithmetic, Assignment, Comparison, Logical, Identity, Membership, and Bitwise.",
    readingMinutes: 12,
    topics: [
      "Arithmetic operators (+, -, *, /, %, **, //)",
      "Assignment operators (=, +=, -=, *=, /=, %=, //=, **=)",
      "Comparison operators (==, !=, >, <, >=, <=)",
      "Logical operators (and, or, not)",
      "Identity operators (is, is not)",
      "Membership operators (in, not in)",
      "Bitwise operators (&, |, ^, ~, <<, >>)",
      "== vs is distinction",
    ],
    objectives: [
      "Perform calculations with all seven arithmetic operators including //, %, and **.",
      "Update variables concisely using compound assignment operators.",
      "Combine comparison and logical operators to evaluate conditions.",
      "Explain the critical difference between value equality (==) and identity (is).",
      "Check membership with in / not in and understand basic bitwise operators.",
    ],
    starterCode: `# Python Operators Showcase
a, b = 17, 5
print("Division:", a / b, "Floor division:", a // b, "Remainder:", a % b)
print("Power:", 2 ** 4)

word = "python"
print("'py' in word:", "py" in word)
print("5 == 5 and 10 > 3:", 5 == 5 and 10 > 3)
`,
  },
];

export const TOTAL_CHAPTERS = CHAPTERS.length;

export function getChapterBySlug(slug: string): ChapterMeta | undefined {
  return CHAPTERS.find((chapter) => chapter.slug === slug);
}

export function getAdjacentChapters(slug: string): {
  prev: ChapterMeta | null;
  next: ChapterMeta | null;
} {
  const index = CHAPTERS.findIndex((chapter) => chapter.slug === slug);
  if (index === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: index > 0 ? CHAPTERS[index - 1] : null,
    next: index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : null,
  };
}

