import type { GlossaryEntry } from "@/types/curriculum";

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: "Assignment",
    definition:
      "Storing a value inside a named variable using the single equals sign (=) or a compound operator like +=.",
    example: `score = 100`,
    chapterSlug: "python-variables",
    chapterTitle: "Python Variables",
  },
  {
    term: "Bitwise Operator",
    definition:
      "An operator (&, |, ^, ~, <<, >>) that works directly on the binary 0 and 1 bits of integer values.",
    example: `print(6 & 3)  # 2`,
    chapterSlug: "python-operators",
    chapterTitle: "Python Operators",
  },
  {
    term: "Boolean (bool)",
    definition:
      "A data type with only two possible values: True or False (always capitalized in Python).",
    example: `is_ready = True`,
    chapterSlug: "python-booleans",
    chapterTitle: "Python Booleans",
  },
  {
    term: "Casting (Type Conversion)",
    definition:
      "Explicitly converting a value from one data type to another using functions such as int(), float(), str(), or bool().",
    example: `age = int("16")`,
    chapterSlug: "python-data-types",
    chapterTitle: "Python Data Types",
  },
  {
    term: "Comment",
    definition:
      "Human-readable note starting with # that Python completely ignores when running the program.",
    example: `# Explain why this line exists\nprint("Hi")`,
    chapterSlug: "python-syntax",
    chapterTitle: "Python Syntax",
  },
  {
    term: "Complex Number",
    definition:
      "A numeric type in Python written with a real part and an imaginary part marked by j.",
    example: `z = 2 + 3j`,
    chapterSlug: "python-numbers",
    chapterTitle: "Python Numbers",
  },
  {
    term: "Data Type",
    definition:
      "The category of a value that determines what operations are valid on it, such as str, int, float, or bool.",
    example: `print(type("Hello"))`,
    chapterSlug: "python-data-types",
    chapterTitle: "Python Data Types",
  },
  {
    term: "Equality Operator (==)",
    definition:
      "A comparison operator that returns True when two values are equal and False otherwise.",
    example: `print(5 == 5)  # True`,
    chapterSlug: "python-operators",
    chapterTitle: "Python Operators",
  },
  {
    term: "Float (Floating-Point Number)",
    definition:
      "A number containing a decimal point or written in scientific notation (e.g., 3.14 or 2.5e3).",
    example: `pi = 3.14`,
    chapterSlug: "python-numbers",
    chapterTitle: "Python Numbers",
  },
  {
    term: "Floor Division (//)",
    definition:
      "An arithmetic operator that divides two numbers and rounds down to the nearest whole integer.",
    example: `print(17 // 5)  # 3`,
    chapterSlug: "python-operators",
    chapterTitle: "Python Operators",
  },
  {
    term: "f-string",
    definition:
      "A formatted string prefixed with f that allows embedding variables and expressions inside curly braces {}.",
    example: `name = "Leo"\nprint(f"Hi, {name}!")`,
    chapterSlug: "python-strings",
    chapterTitle: "Python Strings",
  },
  {
    term: "Global Variable",
    definition:
      "A variable created outside any function so it can be read throughout the program.",
    example: `course = "Python"`,
    chapterSlug: "python-variables",
    chapterTitle: "Python Variables",
  },
  {
    term: "Identity Operator (is)",
    definition:
      "An operator (is, is not) checking whether two variables refer to the exact same object in memory.",
    example: `x = None\nprint(x is None)`,
    chapterSlug: "python-operators",
    chapterTitle: "Python Operators",
  },
  {
    term: "Indentation",
    definition:
      "Spaces at the start of a line (4 spaces by convention) used by Python to group statements inside blocks.",
    example: `if 5 > 2:\n    print("Yes")`,
    chapterSlug: "python-syntax",
    chapterTitle: "Python Syntax",
  },
  {
    term: "Index",
    definition:
      "The integer position of a character in a string (or item in a sequence), starting from 0 for the first item.",
    example: `word = "Python"\nprint(word[0])  # P`,
    chapterSlug: "python-strings",
    chapterTitle: "Python Strings",
  },
  {
    term: "Integer (int)",
    definition:
      "A whole number—positive, negative, or zero—with no decimal point.",
    example: `count = -42`,
    chapterSlug: "python-numbers",
    chapterTitle: "Python Numbers",
  },
  {
    term: "len()",
    definition:
      "A built-in function that returns the number of characters in a string or items in a sequence.",
    example: `print(len("Python"))  # 6`,
    chapterSlug: "python-strings",
    chapterTitle: "Python Strings",
  },
  {
    term: "Local Variable",
    definition:
      "A variable created inside a function that can only be accessed within that function.",
    example: `def greet():\n    msg = "Hello"\n    print(msg)`,
    chapterSlug: "python-variables",
    chapterTitle: "Python Variables",
  },
  {
    term: "Logical Operator",
    definition:
      "Keywords (and, or, not) that combine or reverse boolean conditions.",
    example: `print(True and not False)`,
    chapterSlug: "python-operators",
    chapterTitle: "Python Operators",
  },
  {
    term: "Membership Operator",
    definition:
      "Keywords (in, not in) that check whether a substring or element exists inside a sequence.",
    example: `print("Py" in "Python")`,
    chapterSlug: "python-operators",
    chapterTitle: "Python Operators",
  },
  {
    term: "Modulus (%)",
    definition:
      "An arithmetic operator that returns the remainder left over after dividing two numbers.",
    example: `print(17 % 5)  # 2`,
    chapterSlug: "python-operators",
    chapterTitle: "Python Operators",
  },
  {
    term: "print()",
    definition:
      "Python's built-in output function for displaying text and numbers on screen, supporting sep and end options.",
    example: `print("A", "B", sep="-")`,
    chapterSlug: "python-output",
    chapterTitle: "Python Output",
  },
  {
    term: "String (str)",
    definition:
      "An ordered sequence of characters enclosed in single, double, or triple quotation marks.",
    example: `title = "Python Basics"`,
    chapterSlug: "python-strings",
    chapterTitle: "Python Strings",
  },
  {
    term: "Syntax",
    definition:
      "The grammar rules of a programming language governing spelling, quotes, parentheses, and indentation.",
    example: `print("Valid syntax")`,
    chapterSlug: "python-syntax",
    chapterTitle: "Python Syntax",
  },
  {
    term: "type()",
    definition:
      "A built-in Python function that tells you the data type of any value or variable.",
    example: `print(type(3.5))  # <class 'float'>`,
    chapterSlug: "python-data-types",
    chapterTitle: "Python Data Types",
  },
  {
    term: "Variable",
    definition:
      "A named location used to store a value in a Python program so it can be reused or changed later.",
    example: `name = "Python"`,
    chapterSlug: "python-variables",
    chapterTitle: "Python Variables",
  },
];

