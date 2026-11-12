# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Python Learning Platform

**Project Type:** Interactive Educational Web Application  
**Primary Audience:** School students and beginner Python learners  
**Platform:** Responsive Web Application  
**Architecture:** Frontend-first, backend-free  
**Primary Language:** English  
**Content Scope:** Python Basics through Python Operators

---

# PART 1 — PRODUCT OVERVIEW

## 1.1 Product Vision

Build a modern, professional, interactive Python learning platform that helps beginners understand Python programming through structured lessons, live code execution, AI assistance, quizzes, and hands-on practice.

The website should feel like a professionally designed educational product rather than a traditional school assignment or a collection of static notes.

Students should be able to:
- Learn Python through organized chapters.
- Read simple explanations and practical examples.
- Experiment with real Python code.
- Ask an AI assistant questions.
- Practice with interactive quizzes.
- Track their learning progress.
- Revise concepts through examples and cheat sheets.

## 1.2 Core Objectives

1. Make Python beginner-friendly.
2. Keep explanations simple and accurate.
3. Encourage learning through experimentation.
4. Make every major learning feature functional.
5. Provide a consistent and intuitive user experience.
6. Avoid unnecessary complexity in architecture.
7. Work without a traditional backend.

## 1.3 Target Audience

- School students.
- First-time programmers.
- Python beginners.
- Students preparing for programming examinations.

## 1.4 Educational Scope

The core curriculum must contain exactly nine chapters:

1. Introduction to Python
2. Python Syntax
3. Python Output
4. Python Variables
5. Python Data Types
6. Python Numbers
7. Python Strings
8. Python Booleans
9. Python Operators

Do not introduce advanced topics as core learning chapters.

---

# PART 2 — TECHNOLOGY STACK

## 2.1 Core Technologies

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Animation | Motion |
| Code Editor | CodeMirror 6 |
| Python Runtime | Pyodide |
| Code Execution | Web Workers |
| Content | MDX |
| Syntax Highlighting | Shiki |
| AI Integration | External LLM API |
| AI Streaming | Fetch API / compatible streaming SDK |
| Local Persistence | LocalStorage |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Deployment | Vercel |
| Version Control | GitHub |

## 2.2 Architecture Restrictions

Do not introduce:

- FastAPI
- Django
- Express
- Separate Node.js backend
- PostgreSQL
- MySQL
- MongoDB
- Supabase
- Firebase
- Redis
- Docker
- Server-side Python execution

No traditional backend or database should be required.

Use browser-side storage for learning progress and quiz history.

Use a provider-approved browser authentication mechanism for the AI integration. Never embed a private API key in client-side source code, public environment variables, or the Git repository.

If the selected AI provider cannot securely support browser-side requests, clearly isolate the integration behind a documented serverless adapter rather than exposing credentials.

---

# PART 3 — DESIGN SYSTEM

## 3.1 Design Philosophy

The design should be:

- Clean.
- Minimal.
- Premium.
- Educational.
- Friendly.
- Professional.
- Content-focused.
- Consistent across all pages.

Avoid excessive decoration. Use whitespace and typography to establish visual hierarchy.

## 3.2 Color Palette

Use a light-only visual identity.

| Purpose | Color |
|---|---|
| Main background | #F8FAFC |
| Primary surface | #FFFFFF |
| Secondary surface | #F1F5F9 |
| Main text | #243247 |
| Secondary text | #64748B |
| Python blue | #3776AB |
| Python yellow | #FFD343 |
| Border | #E2E8F0 |
| Success | #15803D |
| Error | #DC2626 |

Python blue and yellow should be used as restrained accent colors.

Do not use large saturated color backgrounds.

## 3.3 Theme

Implement a light-only design.

Do not implement dark mode.

All components, code editors, menus, dialogs, tooltips, and charts must follow the same light visual system.

## 3.4 Typography

Use:
- Inter or Geist Sans for general UI.
- Geist Mono or JetBrains Mono for code.

Use consistent font sizes and line heights.

Prioritize readability over decorative typography.

## 3.5 Visual Restrictions

Strictly avoid:

- Dark or black-heavy interfaces.
- Neon colors.
- Large gradients.
- Glassmorphism.
- Excessive rounded cards.
- Floating decorative blobs.
- Random abstract illustrations.
- Excessive emojis.
- Generic AI-generated illustrations.
- Huge empty hero sections.
- Excessive animations.
- Unnecessary shadows.
- Inconsistent spacing.
- Oversized typography.
- Repeated cards containing too much text.

Use subtle borders, restrained shadows, clear section spacing, and consistent radii.

## 3.6 Responsive Design

Support:
- Mobile: 320px and above.
- Tablet: 768px and above.
- Desktop: 1024px and above.
- Wide desktop: 1440px and above.

On mobile:
- Use a collapsible navigation drawer.
- Keep code editor controls accessible.
- Avoid horizontal overflow.
- Make interactive buttons touch-friendly.
- Stack complex layouts vertically.

---

# PART 4 — APPLICATION STRUCTURE

## 4.1 Main Navigation

Provide navigation for:

- Home
- Learn
- Playground
- Practice
- Examples
- AI Assistant
- Dashboard
- Cheat Sheet
- About

The main navigation should be compact and consistent.

On learning pages, provide a collapsible chapter sidebar.

## 4.2 Homepage

Create a professional homepage.

### Hero Section

Heading:

"Learn Python — From Basics to Operators"

Supporting text:

"Build your Python foundation through simple lessons, interactive coding, practical examples, and guided practice."

Primary CTA:
- Start Learning

Secondary CTA:
- Try Python Code

Include a tasteful Python-inspired visual element, such as a small code illustration or a custom Python symbol.

Do not make the hero overly large.

### Homepage Sections

1. Hero introduction.
2. Learning overview.
3. Nine chapter cards.
4. Interactive playground preview.
5. AI Python Assistant introduction.
6. Learning progress preview.
7. Practice and quiz introduction.
8. Footer.

Keep the homepage concise. Do not place every feature description on the homepage.

---

# PART 5 — PYTHON CURRICULUM

Every chapter must use a consistent educational structure.

Each lesson should include:

1. Learning objectives.
2. Simple explanation.
3. Syntax where applicable.
4. Code example.
5. Expected output.
6. Explanation of the code.
7. Common mistakes.
8. Quick practice question.
9. Previous and next lesson navigation.
10. Mark as completed action.

## Chapter 1: Introduction to Python

Topics:
- What is Python?
- Who created Python?
- When was Python created?
- Why is Python popular?
- What is Python used for?
- Features and advantages.
- Real-world applications.

## Chapter 2: Python Syntax

Topics:
- What is Python syntax?
- Basic syntax rules.
- Indentation.
- Comments.
- First Python program.
- Understanding print().

## Chapter 3: Python Output

Topics:
- print() function.
- Printing text and numbers.
- Printing multiple values.
- Separators using sep.
- Line endings using end.

## Chapter 4: Python Variables

Topics:
- What are variables?
- Creating variables.
- Naming rules.
- Assigning multiple values.
- Global and local variables: basic introduction.
- Variable output.
- Understanding variable types.

## Chapter 5: Python Data Types

Topics:
- What are data types?
- str.
- int.
- float.
- bool.
- type() function.
- Type conversion.

## Chapter 6: Python Numbers

Topics:
- Integers.
- Floating-point numbers.
- Complex numbers: basic introduction.
- Type conversion.
- Random numbers: basic introduction.

## Chapter 7: Python Strings

Topics:
- What are strings?
- Assigning strings.
- Multiline strings.
- Strings as arrays: basic introduction.
- len().
- Accessing characters.
- Basic string formatting.

## Chapter 8: Python Booleans

Topics:
- Boolean values.
- True and False.
- Evaluating expressions.
- Boolean comparisons.

## Chapter 9: Python Operators

Cover all requested operator categories.

### Arithmetic Operators

+, -, *, /, %, **, //

### Assignment Operators

=, +=, -=, *=, /=, %=, //=, **= and other relevant assignment operators.

### Comparison Operators

==, !=, >, <, >=, <=

### Logical Operators

and, or, not

### Identity Operators

is, is not

### Membership Operators

in, not in

### Bitwise Operators

&, |, ^, ~, <<, >>

For every operator include:

- Symbol.
- Official name.
- Purpose.
- Syntax.
- Working Python example.
- Expected output.
- Beginner-friendly explanation.

Explain important distinctions, such as == versus is.

Ensure all examples are valid Python and verify their outputs.

---

# PART 6 — INTERACTIVE PYTHON PLAYGROUND

## 6.1 Purpose

Create a functional Python playground that allows students to experiment with code directly in the browser.

## 6.2 Technology

- CodeMirror 6.
- Pyodide.
- Web Workers.

## 6.3 Required Features

- Editable Python code.
- Syntax highlighting.
- Run button.
- Reset button.
- Copy code button.
- Output console.
- Error display.
- Loading indicator.
- Example code templates.
- Keyboard-friendly interaction.

## 6.4 Execution Workflow

1. User writes Python code.
2. User clicks Run.
3. Code is passed to a dedicated Web Worker.
4. Pyodide executes it inside WebAssembly.
5. Capture stdout and stderr.
6. Return execution results.
7. Display output and errors in the console.

Do not freeze the main interface while Python is running.

## 6.5 Execution Safety

- Execute code inside a Web Worker.
- Support execution cancellation.
- Terminate and recreate a worker when a timeout occurs.
- Set reasonable output limits.
- Handle syntax errors gracefully.
- Do not claim the runtime is equivalent to unrestricted desktop Python.
- Avoid giving arbitrary code access to application secrets.

## 6.6 Playground Layout

Use a light editor interface.

Suggested layout:

- Top toolbar: language, Run, Reset, Copy.
- Main area: code editor.
- Bottom panel: output and errors.
- Optional right-side example selector on desktop.

On mobile, stack the editor and output.

---

# PART 7 — AI PYTHON ASSISTANT

## 7.1 Purpose

Create an AI tutor focused on the nine chapters.

## 7.2 AI Capabilities

The assistant must:

- Answer Python questions.
- Explain concepts in simple English.
- Explain code line by line.
- Identify coding errors.
- Generate beginner-level examples.
- Explain operators.
- Generate practice questions.
- Provide step-by-step guidance.

## 7.3 AI Context

Use the platform's educational content as the assistant's reference material.

Prioritize the syllabus.

Do not unnecessarily introduce advanced concepts.

If a question is outside the syllabus, briefly explain that it is beyond the current learning scope.

## 7.4 AI System Instructions

The AI should act as a friendly Python programming teacher.

Rules:
- Use simple English.
- Avoid unnecessarily technical language.
- Give small examples.
- Explain expected output.
- Explain why the code works.
- Correct misconceptions politely.
- Do not invent Python syntax.
- Encourage students to understand instead of simply copying answers.

## 7.5 Interface

Include:
- Chat message history.
- User and assistant message styles.
- Message input.
- Send button.
- Loading indicator.
- Streaming response if supported.
- Copy response.
- Clear conversation.
- Suggested beginner questions.

Suggested questions:

- What is Python?
- Explain Python variables.
- What is the difference between int and float?
- Explain the print() function.
- What is the difference between == and is?
- Explain logical operators.
- Why am I getting a syntax error?

## 7.6 API Integration

Create a provider-independent AI adapter.

Configuration should be centralized.

Do not hardcode provider-specific logic throughout the application.

Do not expose private credentials.

If browser-safe authentication is unavailable, document the need for a minimal secure serverless proxy.

Do not ship a fake chatbot or hardcoded AI responses.

---

# PART 8 — QUIZ AND PRACTICE SYSTEM

## 8.1 Quiz Types

- Multiple-choice questions.
- True/False.
- Fill in the blanks.
- Predict the output.
- Find the error.
- Small coding challenges.

## 8.2 Quiz Features

- Chapter-wise quizzes.
- Immediate feedback.
- Correct answer explanation.
- Score calculation.
- Progress indication.
- Final result.
- Retry functionality.

## 8.3 Learning Behavior

Do not reveal the correct answer before the student submits an answer.

After submission:
- Display correct or incorrect status.
- Explain the answer.
- Allow the student to continue.

Store attempts locally.

---

# PART 9 — PYTHON EXAMPLES LIBRARY

Create a searchable examples library.

Include:

- Hello World.
- Adding two numbers.
- Variables.
- Data types.
- String operations.
- Arithmetic calculations.
- Comparison operations.
- Logical operations.

Each example must have:
- Title.
- Code.
- Explanation.
- Expected output.
- Copy button.
- Open in Playground action.

---

# PART 10 — LEARNING DASHBOARD

Create a dashboard based on local browser data.

Display:
- Total chapters: 9.
- Completed chapters.
- Completed lessons.
- Learning percentage.
- Quiz attempts.
- Average quiz score.
- Practice activities completed.

Provide a clear progress visualization.

Allow users to:
- Mark lessons complete.
- Undo completion.
- Continue learning.
- Reset learning progress after confirmation.

Do not create fake statistics.

If no learning activity exists, display a useful empty state.

---

# PART 11 — SEARCH, GLOSSARY AND RESOURCES

## Search

Implement client-side search across:
- Chapter titles.
- Lesson titles.
- Python concepts.
- Operator names.
- Glossary terms.
- Example titles.

## Glossary

Create a beginner-friendly dictionary of Python terms.

Each term should include:
- Name.
- Simple definition.
- Small example where useful.

## Cheat Sheet

Include:
- Variables.
- Data types.
- print().
- Strings.
- Booleans.
- Arithmetic operators.
- Assignment operators.
- Comparison operators.
- Logical operators.
- Identity operators.
- Membership operators.
- Bitwise operators.

## FAQ

Include beginner-focused questions.

## About

Explain:
- Project purpose.
- Intended audience.
- Curriculum scope.
- Technologies used.
- Learning resources.

Reference W3Schools as an external learning resource.

Do not reproduce its copyrighted content.

---

# PART 12 — LOCAL DATA MANAGEMENT

Use LocalStorage for:

- Lesson completion.
- Chapter progress.
- Quiz history.
- Practice history.
- Theme-independent preferences.
- Chat history, where appropriate.

Requirements:

- Use a versioned storage schema.
- Handle missing or invalid data.
- Avoid storing sensitive information.
- Provide reset controls.
- Preserve data across page refreshes.
- Handle private browsing and storage failures gracefully.

No account registration is required.

No cross-device synchronization is promised.

---

# PART 13 — PERFORMANCE AND ACCESSIBILITY

## Performance

- Lazy-load Pyodide.
- Load the Python runtime only when needed.
- Avoid loading large libraries on the homepage.
- Split components by route.
- Optimize images.
- Minimize unnecessary client-side JavaScript.
- Avoid excessive animations.
- Provide loading and error states.

## Accessibility

- Semantic HTML.
- Keyboard navigation.
- Visible focus indicators.
- Accessible button labels.
- Proper heading hierarchy.
- Sufficient color contrast.
- Accessible form labels.
- Screen-reader-friendly status messages.

---

# PART 14 — ACCEPTANCE CRITERIA

The project is complete only when:

1. All nine chapters are available.
2. Every lesson contains explanations and working examples.
3. The Python playground executes real Python through Pyodide.
4. Output and errors are displayed correctly.
5. The AI assistant communicates with a real external AI provider.
6. AI credentials are not exposed.
7. All six quiz types work.
8. Quiz results are calculated correctly.
9. Progress survives page refreshes.
10. Dashboard statistics reflect actual local data.
11. Search returns relevant results.
12. Examples can be copied and opened in the playground.
13. All pages are responsive.
14. The design consistently uses a light theme.
15. There are no decorative or nonfunctional buttons.
16. No unnecessary backend or database has been introduced.
17. The application builds successfully and has no critical runtime errors.

---

# PART 15 — DEVELOPMENT PRIORITIES

Build in this order:

**Phase 1 — Foundation**
- Project initialization.
- Design system.
- Navigation.
- Homepage.
- Responsive layout.

**Phase 2 — Educational Content**
- Nine chapters.
- Lesson templates.
- MDX content.
- Previous/next navigation.

**Phase 3 — Interactive Playground**
- CodeMirror.
- Pyodide.
- Web Worker.
- Output console.
- Execution controls.

**Phase 4 — Practice**
- Quiz engine.
- Question bank.
- Scoring.
- Results.

**Phase 5 — AI Assistant**
- AI adapter.
- Provider connection.
- Chat interface.
- Syllabus context.
- Error handling.

**Phase 6 — Dashboard**
- LocalStorage.
- Lesson progress.
- Quiz history.
- Statistics.

**Phase 7 — Finalization**
- Search.
- Glossary.
- Cheat sheet.
- Accessibility.
- Performance.
- Deployment.

---

# FINAL PRODUCT DEFINITION

The final result should be a polished, light-themed, responsive, interactive Python learning platform.

It must prioritize educational quality, real functionality, clean design, and maintainable code.

It must not look like a generic AI-generated dashboard, a traditional school notes website, or an overcomplicated SaaS application.