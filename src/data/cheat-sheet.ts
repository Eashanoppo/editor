export interface CheatSheetItem {
  symbolOrName: string;
  description: string;
  exampleCode: string;
}

export interface CheatSheetSection {
  id: string;
  title: string;
  chapterSlug: string;
  summary: string;
  items: CheatSheetItem[];
}

export const CHEAT_SHEET_SECTIONS: CheatSheetSection[] = [
  {
    id: "variables",
    title: "Variables",
    chapterSlug: "python-variables",
    summary: "Store values under descriptive snake_case names using =.",
    items: [
      {
        symbolOrName: "Assign a variable",
        description: "Create a variable without declaring a type keyword.",
        exampleCode: `name = "Maya"\nage = 15`,
      },
      {
        symbolOrName: "Multiple assignment",
        description: "Assign multiple variables in a single statement.",
        exampleCode: `x, y = 10, 20\na = b = 0`,
      },
    ],
  },
  {
    id: "data-types",
    title: "Data Types & Casting",
    chapterSlug: "python-data-types",
    summary: "Inspect types with type() and convert safely between scalar types.",
    items: [
      {
        symbolOrName: "str, int, float, bool",
        description: "Core beginner data types in Python.",
        exampleCode: `text = "Python"\nwhole = 9\ndecimal = 3.14\nready = True`,
      },
      {
        symbolOrName: "type() & casting",
        description: "Check a value's type or convert between int, float, str, and bool.",
        exampleCode: `print(type(42))\nnum = int("12") + 3\nlabel = "Score: " + str(num)`,
      },
    ],
  },
  {
    id: "output",
    title: "print() Output",
    chapterSlug: "python-output",
    summary: "Display values, customize separators with sep, and line endings with end.",
    items: [
      {
        symbolOrName: "print(..., sep, end)",
        description: "Control separator text between arguments and trailing characters.",
        exampleCode: `print("2026", "11", "12", sep="-")\nprint("Hi", end="! ")\nprint("Python")`,
      },
    ],
  },
  {
    id: "strings",
    title: "Strings",
    chapterSlug: "python-strings",
    summary: "Create single or multiline strings, index characters, check length, and format.",
    items: [
      {
        symbolOrName: "Indexing & len()",
        description: "First character is at [0], last is at [-1].",
        exampleCode: `word = "Python"\nprint(len(word), word[0], word[-1])`,
      },
      {
        symbolOrName: "f-strings",
        description: "Embed variables and expressions inside f\"...\".",
        exampleCode: `name = "Sam"\nprint(f"Hello, {name}!")`,
      },
    ],
  },
  {
    id: "booleans",
    title: "Booleans",
    chapterSlug: "python-booleans",
    summary: "True and False (capitalized) plus truthiness checks via bool().",
    items: [
      {
        symbolOrName: "True / False & bool()",
        description: "0, 0.0, '', and None are False; non-empty values are True.",
        exampleCode: `print(10 > 3)\nprint(bool(""), bool("Hi"))`,
      },
    ],
  },
  {
    id: "arithmetic-operators",
    title: "Arithmetic Operators",
    chapterSlug: "python-operators",
    summary: "Perform numeric calculations.",
    items: [
      {
        symbolOrName: "+  -  *  /",
        description: "Addition, subtraction, multiplication, and float division.",
        exampleCode: `print(10 + 3, 10 - 3, 10 * 3, 10 / 4)`,
      },
      {
        symbolOrName: "%  **  //",
        description: "Modulus remainder, exponentiation (power), and floor division.",
        exampleCode: `print(17 % 5, 2 ** 4, 17 // 5)`,
      },
    ],
  },
  {
    id: "assignment-operators",
    title: "Assignment Operators",
    chapterSlug: "python-operators",
    summary: "Store and update variables in place.",
    items: [
      {
        symbolOrName: "=  +=  -=  *=  /=",
        description: "Assign or modify a variable using arithmetic shortcuts.",
        exampleCode: `x = 10\nx += 5\nx -= 2\nx *= 2\nx /= 2\nprint(x)`,
      },
      {
        symbolOrName: "%=  //=  **=",
        description: "Compound modulus, floor division, and exponent updates.",
        exampleCode: `n = 17\nn //= 5\nn **= 2\nprint(n)`,
      },
    ],
  },
  {
    id: "comparison-operators",
    title: "Comparison Operators",
    chapterSlug: "python-operators",
    summary: "Compare values and return True or False.",
    items: [
      {
        symbolOrName: "==  !=  >  <  >=  <=",
        description: "Equal, not equal, greater, less, greater/equal, less/equal.",
        exampleCode: `print(5 == 5, 5 != 3, 7 > 2, 4 <= 4)`,
      },
    ],
  },
  {
    id: "logical-operators",
    title: "Logical Operators",
    chapterSlug: "python-operators",
    summary: "Combine or invert boolean conditions.",
    items: [
      {
        symbolOrName: "and  or  not",
        description: "Logical AND, logical OR, and logical negation.",
        exampleCode: `a, b = True, False\nprint(a and b, a or b, not b)`,
      },
    ],
  },
  {
    id: "identity-operators",
    title: "Identity Operators",
    chapterSlug: "python-operators",
    summary: "Test whether two variables point to the exact same object in memory.",
    items: [
      {
        symbolOrName: "is  is not",
        description: "Compare identity (use == for value equality, is for None or object identity).",
        exampleCode: `x = [1, 2]\ny = [1, 2]\nprint(x == y, x is y, x is not y)`,
      },
    ],
  },
  {
    id: "membership-operators",
    title: "Membership Operators",
    chapterSlug: "python-operators",
    summary: "Check if a value or substring exists inside a sequence.",
    items: [
      {
        symbolOrName: "in  not in",
        description: "Returns True if found (or not found) in a string or list.",
        exampleCode: `text = "Learn Python"\nprint("Py" in text, "Ruby" not in text)`,
      },
    ],
  },
  {
    id: "bitwise-operators",
    title: "Bitwise Operators",
    chapterSlug: "python-operators",
    summary: "Operate on individual binary bits of integers.",
    items: [
      {
        symbolOrName: "&  |  ^  ~  <<  >>",
        description: "Bitwise AND, OR, XOR, NOT, left shift, and right shift.",
        exampleCode: `print(6 & 3, 6 | 3, 6 ^ 3, ~6, 6 << 1, 6 >> 1)`,
      },
    ],
  },
];

