import type { QuizQuestion } from "@/types/quiz";

export const QUESTION_TYPE_LABELS: Record<QuizQuestion["type"], string> = {
  mcq: "Multiple Choice",
  true_false: "True / False",
  fill_blank: "Fill in the Blanks",
  predict_output: "Predict the Output",
  find_error: "Find the Error",
  coding_challenge: "Coding Challenge",
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Chapter 1: Introduction to Python
  {
    id: "q-ch1-1",
    chapterSlug: "introduction-to-python",
    chapterNumber: 1,
    chapterTitle: "Introduction to Python",
    type: "mcq",
    prompt: "Who created the Python programming language?",
    options: [
      "Guido van Rossum",
      "Dennis Ritchie",
      "Bjarne Stroustrup",
      "Tim Berners-Lee",
    ],
    correctIndex: 0,
    explanation:
      "Guido van Rossum created Python in the late 1980s and released it publicly in 1991.",
  },
  {
    id: "q-ch1-2",
    chapterSlug: "introduction-to-python",
    chapterNumber: 1,
    chapterTitle: "Introduction to Python",
    type: "true_false",
    prompt:
      "Python requires curly braces { } around every block of code, just like C and Java.",
    options: ["True", "False"],
    correctIndex: 1,
    explanation:
      "False. Python uses clean indentation (leading spaces) instead of curly braces to define code blocks.",
  },
  {
    id: "q-ch1-3",
    chapterSlug: "introduction-to-python",
    chapterNumber: 1,
    chapterTitle: "Introduction to Python",
    type: "fill_blank",
    prompt: "Complete the Python statement to display Hello Python on screen.",
    codeTemplate: `____("Hello Python")`,
    acceptedAnswers: ["print"],
    caseSensitive: true,
    hint: "Use Python's built-in output function in lowercase.",
    explanation:
      "print() is Python's built-in function for displaying text and values to the output console.",
  },

  // Chapter 2: Python Syntax
  {
    id: "q-ch2-1",
    chapterSlug: "python-syntax",
    chapterNumber: 2,
    chapterTitle: "Python Syntax",
    type: "find_error",
    prompt: "Why will the following Python code fail with an error?",
    code: `if 10 > 4:
print("10 is greater than 4")`,
    options: [
      "Missing parentheses around 10 > 4",
      "Missing indentation on line 2 after the colon",
      "Missing semicolon at the end of line 2",
      "The > operator cannot compare integers",
    ],
    correctIndex: 1,
    explanation:
      "Python requires the line after an if statement's colon (:) to be indented (typically 4 spaces). Without indentation, Python raises an IndentationError.",
  },
  {
    id: "q-ch2-2",
    chapterSlug: "python-syntax",
    chapterNumber: 2,
    chapterTitle: "Python Syntax",
    type: "predict_output",
    prompt: "What will this Python snippet print?",
    code: `# print("First line")
print("Second line")  # inline comment`,
    options: [
      "First line\nSecond line",
      "Second line",
      "Second line  # inline comment",
      "SyntaxError",
    ],
    correctIndex: 1,
    explanation:
      "Anything after # on a line is a comment and is ignored by Python. Line 1 is commented out, so only 'Second line' prints.",
  },
  {
    id: "q-ch2-3",
    chapterSlug: "python-syntax",
    chapterNumber: 2,
    chapterTitle: "Python Syntax",
    type: "coding_challenge",
    prompt:
      "Fix and complete the code so it prints Python Syntax Ready! (using proper indentation inside the if block).",
    starterCode: `if 7 > 3:
    # Print "Python Syntax Ready!" below
    `,
    expectedOutput: "Python Syntax Ready!",
    sampleSolution: `if 7 > 3:
    print("Python Syntax Ready!")`,
    explanation:
      "Indenting print(\"Python Syntax Ready!\") with 4 spaces places it cleanly inside the if block.",
  },

  // Chapter 3: Python Output
  {
    id: "q-ch3-1",
    chapterSlug: "python-output",
    chapterNumber: 3,
    chapterTitle: "Python Output",
    type: "predict_output",
    prompt: "What does this print() call output?",
    code: `print("2026", "11", "12", sep="/")`,
    options: [
      "2026 11 12",
      "2026/11/12",
      "2026-11-12",
      "20261112",
    ],
    correctIndex: 1,
    explanation:
      "The sep parameter specifies the text inserted between multiple arguments passed to print(). Here, sep='/' places '/' between each string.",
  },
  {
    id: "q-ch3-2",
    chapterSlug: "python-output",
    chapterNumber: 3,
    chapterTitle: "Python Output",
    type: "fill_blank",
    prompt:
      "Fill in the keyword argument name so both words appear on the same line separated by a space.",
    codeTemplate: `print("Hello", ____=" ")
print("World")`,
    acceptedAnswers: ["end"],
    caseSensitive: true,
    hint: "This parameter controls what print() places at the end instead of a newline.",
    explanation:
      "Setting end=' ' replaces the default newline character with a single space, keeping 'World' on the same line.",
  },
  {
    id: "q-ch3-3",
    chapterSlug: "python-output",
    chapterNumber: 3,
    chapterTitle: "Python Output",
    type: "coding_challenge",
    prompt:
      'Write a single print() call that outputs "A-B-C" using the sep parameter.',
    starterCode: `# Use print("A", "B", "C", ...) with sep
`,
    expectedOutput: "A-B-C",
    sampleSolution: `print("A", "B", "C", sep="-")`,
    explanation:
      'Passing sep="-" joins the three strings "A", "B", and "C" with hyphens to output A-B-C.',
  },

  // Chapter 4: Python Variables
  {
    id: "q-ch4-1",
    chapterSlug: "python-variables",
    chapterNumber: 4,
    chapterTitle: "Python Variables",
    type: "mcq",
    prompt: "Which variable name follows Python's naming rules?",
    options: ["2nd_item", "student-name", "student_score", "for"],
    correctIndex: 2,
    explanation:
      "student_score begins with a letter and uses an underscore. Variable names cannot begin with a digit, contain hyphens, or match Python keywords like 'for'.",
  },
  {
    id: "q-ch4-2",
    chapterSlug: "python-variables",
    chapterNumber: 4,
    chapterTitle: "Python Variables",
    type: "predict_output",
    prompt: "What will this program print?",
    code: `a, b = 4, 9
a = b + 1
print(a, b)`,
    options: ["4 9", "10 9", "10 10", "5 9"],
    correctIndex: 1,
    explanation:
      "Initially a is 4 and b is 9. Then a is reassigned to b + 1 (which is 10), while b remains 9.",
  },
  {
    id: "q-ch4-3",
    chapterSlug: "python-variables",
    chapterNumber: 4,
    chapterTitle: "Python Variables",
    type: "true_false",
    prompt:
      "In Python, a variable created inside a function is called a local variable and exists only inside that function by default.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "True. Variables assigned inside a function have local scope unless explicitly declared global.",
  },

  // Chapter 5: Python Data Types
  {
    id: "q-ch5-1",
    chapterSlug: "python-data-types",
    chapterNumber: 5,
    chapterTitle: "Python Data Types",
    type: "predict_output",
    prompt: "What is the output of this code?",
    code: `value = "42"
print(type(value))`,
    options: [
      "<class 'int'>",
      "<class 'float'>",
      "<class 'str'>",
      "<class 'bool'>",
    ],
    correctIndex: 2,
    explanation:
      'Because "42" is enclosed in quotes, Python stores it as text (str), not an integer.',
  },
  {
    id: "q-ch5-2",
    chapterSlug: "python-data-types",
    chapterNumber: 5,
    chapterTitle: "Python Data Types",
    type: "find_error",
    prompt: "Why does the second line produce a TypeError?",
    code: `points = 50
print("Points: " + points)`,
    options: [
      "points must be written in uppercase",
      "You cannot join a str and an int directly with + without converting points using str()",
      "print() cannot display numbers",
      "The + operator only works inside variables",
    ],
    correctIndex: 1,
    explanation:
      'Python does not automatically convert numbers when concatenating strings with +. Use str(points) or print("Points:", points).',
  },
  {
    id: "q-ch5-3",
    chapterSlug: "python-data-types",
    chapterNumber: 5,
    chapterTitle: "Python Data Types",
    type: "fill_blank",
    prompt: "Convert the string '25' into an integer so the addition returns 30.",
    codeTemplate: `num = ____("25")
print(num + 5)`,
    acceptedAnswers: ["int"],
    caseSensitive: true,
    hint: "Use the built-in conversion function for whole numbers.",
    explanation:
      "int('25') converts the numeric string '25' into the integer 25, allowing arithmetic addition.",
  },

  // Chapter 6: Python Numbers
  {
    id: "q-ch6-1",
    chapterSlug: "python-numbers",
    chapterNumber: 6,
    chapterTitle: "Python Numbers",
    type: "mcq",
    prompt: "Which of the following is a Python complex number?",
    options: ["3.14", "100", "5 + 2j", "2.5e3"],
    correctIndex: 2,
    explanation:
      "Python writes complex numbers using j for the imaginary component (5 + 2j). 2.5e3 is a float in scientific notation.",
  },
  {
    id: "q-ch6-2",
    chapterSlug: "python-numbers",
    chapterNumber: 6,
    chapterTitle: "Python Numbers",
    type: "predict_output",
    prompt: "What does this type conversion code print?",
    code: `x = int(7.9)
y = float(4)
print(x, y)`,
    options: ["8 4.0", "7 4.0", "7 4", "7.9 4.0"],
    correctIndex: 1,
    explanation:
      "int(7.9) truncates the decimal part to 7 (it does not round up), while float(4) turns 4 into 4.0.",
  },
  {
    id: "q-ch6-3",
    chapterSlug: "python-numbers",
    chapterNumber: 6,
    chapterTitle: "Python Numbers",
    type: "coding_challenge",
    prompt:
      "Convert price = 19.75 to a whole integer using int(), store it in whole_price, and print whole_price.",
    starterCode: `price = 19.75
# Convert price to an int and print it
`,
    expectedOutput: "19",
    sampleSolution: `price = 19.75
whole_price = int(price)
print(whole_price)`,
    explanation:
      "int(19.75) truncates the decimal fraction and prints 19.",
  },

  // Chapter 7: Python Strings
  {
    id: "q-ch7-1",
    chapterSlug: "python-strings",
    chapterNumber: 7,
    chapterTitle: "Python Strings",
    type: "predict_output",
    prompt: "What will this code print?",
    code: `word = "Python"
print(word[0], word[-1], len(word))`,
    options: ["P n 6", "P o 6", "y n 5", "P n 5"],
    correctIndex: 0,
    explanation:
      "Index 0 is the first character 'P', index -1 is the last character 'n', and len('Python') counts 6 characters.",
  },
  {
    id: "q-ch7-2",
    chapterSlug: "python-strings",
    chapterNumber: 7,
    chapterTitle: "Python Strings",
    type: "find_error",
    prompt: "What causes an IndexError in this snippet?",
    code: `lang = "Code"
print(lang[4])`,
    options: [
      "Strings cannot use square brackets",
      "The last valid index for a 4-character string is 3 because indexing starts at 0",
      "print() cannot print a single character",
      "Double quotes are invalid for single words",
    ],
    correctIndex: 1,
    explanation:
      "'Code' has 4 characters at indexes 0 ('C'), 1 ('o'), 2 ('d'), and 3 ('e'). Asking for index 4 goes out of range.",
  },
  {
    id: "q-ch7-3",
    chapterSlug: "python-strings",
    chapterNumber: 7,
    chapterTitle: "Python Strings",
    type: "coding_challenge",
    prompt:
      'Given name = "Sam" and score = 95, use an f-string to print: Sam scored 95',
    starterCode: `name = "Sam"
score = 95
# Print using an f-string
`,
    expectedOutput: "Sam scored 95",
    sampleSolution: `name = "Sam"
score = 95
print(f"{name} scored {score}")`,
    explanation:
      'Prefixing the string with f lets you embed {name} and {score} directly inside the string.',
  },

  // Chapter 8: Python Booleans
  {
    id: "q-ch8-1",
    chapterSlug: "python-booleans",
    chapterNumber: 8,
    chapterTitle: "Python Booleans",
    type: "find_error",
    prompt: "Why does this boolean assignment fail in Python?",
    code: `is_active = true
print(is_active)`,
    options: [
      "Boolean variables cannot contain underscores",
      "true must be capitalized as True in Python",
      "True must be placed inside quotes",
      "print() cannot output booleans",
    ],
    correctIndex: 1,
    explanation:
      "Python's boolean literals are capitalized: True and False. Lowercase true triggers a NameError.",
  },
  {
    id: "q-ch8-2",
    chapterSlug: "python-booleans",
    chapterNumber: 8,
    chapterTitle: "Python Booleans",
    type: "predict_output",
    prompt: "What does this bool() check output?",
    code: `print(bool(0), bool("0"))`,
    options: ["False False", "True True", "False True", "True False"],
    correctIndex: 2,
    explanation:
      'The integer 0 is falsy (False), whereas the non-empty string "0" has 1 character so it is truthy (True).',
  },
  {
    id: "q-ch8-3",
    chapterSlug: "python-booleans",
    chapterNumber: 8,
    chapterTitle: "Python Booleans",
    type: "true_false",
    prompt: "Evaluating 12 >= 12 in Python returns True.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "True. The >= operator checks 'greater than or equal to', and since 12 equals 12, it evaluates to True.",
  },

  // Chapter 9: Python Operators
  {
    id: "q-ch9-1",
    chapterSlug: "python-operators",
    chapterNumber: 9,
    chapterTitle: "Python Operators",
    type: "predict_output",
    prompt: "What is the output of these arithmetic operations?",
    code: `print(17 // 5, 17 % 5, 2 ** 3)`,
    options: ["3.4 2 6", "3 2 8", "3 2 6", "3 3 8"],
    correctIndex: 1,
    explanation:
      "17 // 5 performs floor division (3), 17 % 5 returns the remainder (2), and 2 ** 3 computes 2 raised to the power 3 (8).",
  },
  {
    id: "q-ch9-2",
    chapterSlug: "python-operators",
    chapterNumber: 9,
    chapterTitle: "Python Operators",
    type: "fill_blank",
    prompt:
      "Fill in the membership operator to check if 'Py' appears inside word.",
    codeTemplate: `word = "Python"
print("Py" ____ word)`,
    acceptedAnswers: ["in"],
    caseSensitive: true,
    hint: "Two-letter keyword checking sequence membership.",
    explanation:
      "The in operator returns True when the left substring or item exists inside the right sequence.",
  },
  {
    id: "q-ch9-3",
    chapterSlug: "python-operators",
    chapterNumber: 9,
    chapterTitle: "Python Operators",
    type: "mcq",
    prompt: "What is the key difference between == and is in Python?",
    options: [
      "There is no difference; they are synonyms",
      "== compares values for equality, while is checks whether two variables reference the exact same object in memory",
      "== only works on strings, while is only works on integers",
      "is compares values, while == assigns values",
    ],
    correctIndex: 1,
    explanation:
      "== checks whether two objects hold equal values (like [1, 2] == [1, 2] -> True), whereas is checks whether both variables point to the exact same object in memory.",
  },
  {
    id: "q-ch9-4",
    chapterSlug: "python-operators",
    chapterNumber: 9,
    chapterTitle: "Python Operators",
    type: "predict_output",
    prompt: "What will this logical and bitwise check print?",
    code: `print(True and False or True)
print(6 & 3)`,
    options: ["False\n2", "True\n2", "True\n7", "False\n9"],
    correctIndex: 1,
    explanation:
      "and has higher precedence than or: (True and False) is False, then (False or True) is True. In binary, 6 (0110) & 3 (0011) gives 0010, which is 2.",
  },
  {
    id: "q-ch9-5",
    chapterSlug: "python-operators",
    chapterNumber: 9,
    chapterTitle: "Python Operators",
    type: "coding_challenge",
    prompt:
      "Start with score = 20, use += to add 5, then use *= to multiply by 2, and print score.",
    starterCode: `score = 20
# Use += 5 and *= 2, then print(score)
`,
    expectedOutput: "50",
    sampleSolution: `score = 20
score += 5
score *= 2
print(score)`,
    explanation:
      "20 += 5 updates score to 25, and 25 *= 2 updates score to 50.",
  },
];

export function filterQuizQuestions(
  chapterSlug: string,
  questionType: QuizQuestion["type"] | "all"
): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => {
    const matchesChapter =
      chapterSlug === "all" || q.chapterSlug === chapterSlug;
    const matchesType = questionType === "all" || q.type === questionType;
    return matchesChapter && matchesType;
  });
}

