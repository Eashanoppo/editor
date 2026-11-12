import type { PythonExampleItem } from "@/types/curriculum";

export const EXAMPLE_CATEGORIES: PythonExampleItem["category"][] = [
  "Hello World",
  "Addition",
  "Variables",
  "Data Types",
  "Strings",
  "Numbers",
  "Boolean Expressions",
  "Arithmetic Operators",
  "Comparison Operators",
  "Logical Operators",
];

export const PYTHON_EXAMPLES: PythonExampleItem[] = [
  {
    id: "hello-world",
    title: "Hello, World!",
    category: "Hello World",
    chapterSlug: "python-syntax",
    code: `# Your first Python program
print("Hello, World!")
print("Welcome to Python programming.")`,
    explanation:
      "Calls print() twice to display two lines of text in order.",
    expectedOutput: `Hello, World!
Welcome to Python programming.`,
  },
  {
    id: "print-sep-end",
    title: "Custom Separators & Line Endings",
    category: "Hello World",
    chapterSlug: "python-output",
    code: `print("2026", "11", "12", sep="-")
print("Step 1", end=" -> ")
print("Step 2")`,
    explanation:
      "Uses sep='-' to join multiple arguments with hyphens, and end=' -> ' to stay on the same line.",
    expectedOutput: `2026-11-12
Step 1 -> Step 2`,
  },
  {
    id: "add-two-numbers",
    title: "Adding Two Numbers",
    category: "Addition",
    chapterSlug: "python-numbers",
    code: `first_number = 18
second_number = 24
total = first_number + second_number

print("First:", first_number)
print("Second:", second_number)
print("Sum:", total)`,
    explanation:
      "Stores two integers in variables, adds them with +, and displays the total.",
    expectedOutput: `First: 18
Second: 24
Sum: 42`,
  },
  {
    id: "variables-swap",
    title: "Creating & Updating Variables",
    category: "Variables",
    chapterSlug: "python-variables",
    code: `student = "Amina"
points = 10
print(student, "starts with", points)

points += 15
print(student, "now has", points)`,
    explanation:
      "Creates variables and updates points using the compound += operator.",
    expectedOutput: `Amina starts with 10
Amina now has 25`,
  },
  {
    id: "multiple-assignment",
    title: "Assigning Multiple Variables",
    category: "Variables",
    chapterSlug: "python-variables",
    code: `width, height = 8, 5
area = width * height
print("Width:", width, "Height:", height)
print("Rectangle area:", area)`,
    explanation:
      "Assigns two variables on one line and calculates their product.",
    expectedOutput: `Width: 8 Height: 5
Rectangle area: 40`,
  },
  {
    id: "inspect-data-types",
    title: "Checking Data Types with type()",
    category: "Data Types",
    chapterSlug: "python-data-types",
    code: `title = "Python"
chapters = 9
rating = 4.8
is_active = True

print(type(title))
print(type(chapters))
print(type(rating))
print(type(is_active))`,
    explanation:
      "Demonstrates str, int, float, and bool using Python's built-in type() function.",
    expectedOutput: `<class 'str'>
<class 'int'>
<class 'float'>
<class 'bool'>`,
  },
  {
    id: "type-casting",
    title: "Converting Strings & Numbers",
    category: "Data Types",
    chapterSlug: "python-data-types",
    code: `price_text = "12.50"
quantity_text = "3"

total_cost = float(price_text) * int(quantity_text)
print("Total cost: $" + str(total_cost))`,
    explanation:
      "Converts string digits into float and int to perform math, then back to str for joining.",
    expectedOutput: `Total cost: $37.5`,
  },
  {
    id: "string-indexing-fstring",
    title: "String Length, Indexing & Formatting",
    category: "Strings",
    chapterSlug: "python-strings",
    code: `word = "Python"
print("Length:", len(word))
print("First letter:", word[0])
print("Last letter:", word[-1])
print(f"Learning {word} is clear!")`,
    explanation:
      "Measures string length with len(), accesses characters by index, and formats text with an f-string.",
    expectedOutput: `Length: 6
First letter: P
Last letter: n
Learning Python is clear!`,
  },
  {
    id: "numbers-and-random",
    title: "Integers, Floats & Random Dice Roll",
    category: "Numbers",
    chapterSlug: "python-numbers",
    code: `import random

random.seed(7)
roll = random.randint(1, 6)
average = (roll + 4) / 2

print("Dice roll:", roll)
print("Average:", average, type(average))`,
    explanation:
      "Generates a repeatable random integer between 1 and 6 and computes a float average.",
    expectedOutput: `Dice roll: 3
Average: 3.5 <class 'float'>`,
  },
  {
    id: "boolean-truthy-falsy",
    title: "Evaluating Truthy & Falsy Values",
    category: "Boolean Expressions",
    chapterSlug: "python-booleans",
    code: `print("bool(10):", bool(10))
print("bool(0):", bool(0))
print("bool('Hi'):", bool("Hi"))
print("bool(''):", bool(""))`,
    explanation:
      "Shows how non-zero numbers and non-empty strings evaluate to True while 0 and '' evaluate to False.",
    expectedOutput: `bool(10): True
bool(0): False
bool('Hi'): True
bool(''): False`,
  },
  {
    id: "arithmetic-operators",
    title: "Arithmetic Operators (/, //, %, **)",
    category: "Arithmetic Operators",
    chapterSlug: "python-operators",
    code: `a = 17
b = 5

print("17 + 5 =", a + b)
print("17 / 5 =", a / b)
print("17 // 5 =", a // b)
print("17 % 5 =", a % b)
print("2 ** 5 =", 2 ** 5)`,
    explanation:
      "Contrasts normal float division (/), floor division (//), modulus remainder (%), and exponentiation (**).",
    expectedOutput: `17 + 5 = 22
17 / 5 = 3.4
17 // 5 = 3
17 % 5 = 2
2 ** 5 = 32`,
  },
  {
    id: "comparison-operators",
    title: "Comparison Operators in Action",
    category: "Comparison Operators",
    chapterSlug: "python-operators",
    code: `score = 85
passing_grade = 60

print("Passed:", score >= passing_grade)
print("Perfect 100:", score == 100)
print("Needs retake:", score < passing_grade)
print("Not zero:", score != 0)`,
    explanation:
      "Evaluates >=, ==, <, and != to produce True or False results.",
    expectedOutput: `Passed: True
Perfect 100: False
Needs retake: False
Not zero: True`,
  },
  {
    id: "logical-operators",
    title: "Combining Conditions with and, or, not",
    category: "Logical Operators",
    chapterSlug: "python-operators",
    code: `has_homework = True
attended_class = True
is_late = False

can_submit = has_homework and attended_class and not is_late
print("Can submit:", can_submit)
print("Needs reminder:", is_late or not has_homework)`,
    explanation:
      "Uses logical and, or, and not to combine boolean conditions.",
    expectedOutput: `Can submit: True
Needs reminder: False`,
  },
  {
    id: "identity-and-membership",
    title: "Identity (== vs is) and Membership (in)",
    category: "Comparison Operators",
    chapterSlug: "python-operators",
    code: `list_a = [10, 20]
list_b = [10, 20]
print("Same values (==):", list_a == list_b)
print("Same object (is):", list_a is list_b)

phrase = "Learn Python"
print("'Python' in phrase:", "Python" in phrase)`,
    explanation:
      "Clarifies that == checks equal values while is checks whether two variables point to the exact same object.",
    expectedOutput: `Same values (==): True
Same object (is): False
'Python' in phrase: True`,
  },
];

export function getExampleById(id: string): PythonExampleItem | undefined {
  return PYTHON_EXAMPLES.find((ex) => ex.id === id);
}

