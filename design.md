# Design System & UI/UX Specification
## Python Learning Platform

**Document:** `design.md`  
**Project:** Interactive Python Learning Platform  
**Design Version:** 1.0  
**Platform:** Responsive Web Application  
**Primary Theme:** Light Only  
**Audience:** Python beginners and students

---

# 1. Design Vision

## 1.1 Product Vision

Build a modern, interactive, beginner-friendly Python learning platform that makes learning Python simple, engaging, and practical.

The experience should feel like a professionally designed educational product rather than a typical tutorial website or generic AI-generated dashboard.

The interface must prioritize:

- Learning clarity over visual decoration.
- Readability over information density.
- Practical interaction over static content.
- Consistency over unnecessary creativity.
- Simplicity without looking basic.
- Professionalism without feeling corporate or boring.

Users should be able to understand a concept, read examples, execute Python code, practice questions, and ask an AI tutor without feeling overwhelmed.

## 1.2 Design Principles

### Principle 1: Content First

Learning content is the most important element.

- Use readable typography.
- Keep paragraphs short.
- Break complex explanations into small sections.
- Avoid unnecessary decorative cards.
- Give code examples enough visual space.
- Use diagrams only when they genuinely improve understanding.

### Principle 2: Minimal but Functional

Every element must have a purpose.

Avoid:
- Decorative floating circles.
- Random abstract shapes.
- Excessive cards inside cards.
- Unnecessary gradients.
- Large empty hero sections.
- Excessive shadows.
- Random icons.
- Emoji-based navigation.
- Overly rounded components everywhere.
- Unnecessary animations.

### Principle 3: Consistent Learning Experience

Every chapter should follow the same content structure, navigation system, typography, and interaction patterns.

### Principle 4: Responsive by Design

The interface must be designed for mobile, tablet, and desktop from the beginning, not simply compressed to fit smaller screens.

### Principle 5: Functional Visual Design

Buttons, tabs, navigation items, editors, quizzes, search, and progress indicators must perform their actual advertised actions.

Never create decorative controls that look interactive but do nothing.

---

# 2. Visual Identity

## 2.1 Overall Visual Direction

The visual identity should combine:

- Modern educational platform.
- Clean documentation website.
- Professional developer tool.
- Friendly beginner learning environment.

Reference the usability and content organization of established developer documentation platforms, but do not copy their layouts.

The result should have its own visual identity.

## 2.2 Color System

Use a light-only color system.

Never implement a dark theme or dark-mode toggle.

### Core Colors

| Token | Hex | Usage |
|---|---|---|
| Primary | #3776AB | Primary actions, active navigation |
| Primary Hover | #2F6696 | Hover state |
| Primary Light | #EAF2F9 | Subtle highlighted areas |
| Python Yellow | #FFD343 | Small highlights and accents |
| Background | #F8FAFC | Main application background |
| Surface | #FFFFFF | Cards, navigation, content surfaces |
| Surface Secondary | #F1F5F9 | Secondary panels |
| Text Primary | #243247 | Main headings and body text |
| Text Secondary | #64748B | Supporting information |
| Text Muted | #94A3B8 | Metadata and placeholders |
| Border | #E2E8F0 | Dividers and component boundaries |
| Success | #15803D | Correct answers and completion |
| Success Light | #F0FDF4 | Success backgrounds |
| Warning | #B45309 | Warnings |
| Warning Light | #FFFBEB | Warning backgrounds |
| Error | #DC2626 | Errors and incorrect answers |
| Error Light | #FEF2F2 | Error backgrounds |

### Color Usage Rules

1. White should be the primary surface color.
2. Light grey should separate different content areas.
3. Blue should communicate interaction and primary actions.
4. Yellow should be used sparingly as a Python identity accent.
5. Green should only communicate success.
6. Red should only communicate errors or destructive actions.
7. Avoid using multiple bright colors in the same section.
8. Do not use gradients as a default background treatment.

The interface must remain visually calm.

---

# 3. Typography System

## 3.1 Font Selection

Recommended fonts:

**Primary UI Font:** Geist or Inter  
**Code Font:** Geist Mono or JetBrains Mono

Use a consistent font system throughout the application.

## 3.2 Typography Scale

| Element | Desktop | Mobile | Weight |
|---|---:|---:|---|
| Main Hero Heading | 48px | 34px | 700 |
| Page Heading | 36px | 30px | 700 |
| Section Heading | 26px | 23px | 650 |
| Subheading | 20px | 18px | 600 |
| Card Heading | 17px | 16px | 600 |
| Body Text | 16px | 15px | 400 |
| Secondary Text | 14px | 13px | 400 |
| Small Metadata | 12px | 12px | 500 |
| Code | 14px | 13px | 400 |

### Typography Rules

- Use a comfortable line height of approximately 1.6 for educational paragraphs.
- Headings should have tighter line height.
- Avoid oversized headings in normal content sections.
- Do not use too many font weights.
- Use monospace fonts for all Python code.
- Avoid long paragraphs without section breaks.
- Maintain clear heading hierarchy.

---

# 4. Layout System

## 4.1 Global Layout

The application should use a consistent layout across all pages.

### Desktop

- Header height: approximately 68px.
- Main content maximum width: approximately 1280px.
- Standard page horizontal padding: 32px.
- Main content centered.
- Use consistent vertical spacing.
- Keep content aligned to a shared grid.

### Tablet

- Horizontal padding: 24px.
- Navigation should simplify when necessary.
- Two-column layouts may become single-column.
- Keep editor controls accessible.

### Mobile

- Header height: approximately 60px.
- Horizontal padding: 18px.
- Single-column layouts.
- Sidebar becomes a drawer or collapsible navigation.
- Code editor must support horizontal scrolling.
- Avoid horizontal page overflow.
- Important actions must remain easy to reach.

## 4.2 Spacing System

Use a consistent 4px-based spacing scale.

| Token | Value |
|---|---:|
| xs | 4px |
| sm | 8px |
| md | 12px |
| base | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |
| 4xl | 80px |

Do not create arbitrary spacing values for every component.

## 4.3 Border Radius

| Component | Radius |
|---|---:|
| Small Input | 6px |
| Button | 8px |
| Standard Card | 10px |
| Large Section | 12px |
| Modal | 14px |
| Badge | 999px |

Use moderate rounding.

Avoid making every component excessively rounded.

## 4.4 Shadows

Use subtle shadows only when needed.

- Standard card: very subtle shadow or border.
- Dropdown: soft shadow.
- Modal: slightly stronger shadow.
- Navigation: border is usually sufficient.

Do not use heavy shadows as a primary design feature.

---

# 5. Global Navigation

## 5.1 Main Header

The header should be consistent across all major pages.

### Left Side

- Python-inspired brand mark.
- Project name: Python Learning.
- Brand mark can use a simple original Python-inspired geometric symbol.

### Center / Navigation

- Home
- Learn
- Playground
- Practice
- AI Assistant

### Right Side

- Progress indicator or progress shortcut.
- Search icon or search field.
- Mobile menu trigger where appropriate.

### Header Behavior

- Sticky header on scroll.
- White background.
- Subtle bottom border.
- No oversized header.
- Active navigation item should be clearly identifiable.
- Navigation should not visually compete with the page content.

### Mobile Header

Display:
- Brand mark and short name.
- Menu trigger.
- Optional compact progress shortcut.

Use a slide-out navigation drawer for the remaining links.

## 5.2 Footer

The footer should be simple and informative.

Sections:

**Learning**
- Introduction
- Python Syntax
- Python Output
- Variables
- Data Types
- Numbers
- Strings
- Booleans
- Operators

**Tools**
- Playground
- Practice
- AI Assistant
- Progress

**Resources**
- Python Official Documentation
- W3Schools Python Tutorial
- About This Project

Footer bottom:
- Project name.
- Copyright notice.
- Educational purpose statement.

External links should open the appropriate resource.

---

# 6. Home Page Design

## 6.1 Purpose

The homepage should immediately explain:

1. What the platform teaches.
2. How the learner can start.
3. What learning tools are available.
4. How much progress the learner has made.

Avoid filling the homepage with excessive text.

## 6.2 Hero Section

### Layout

Use a balanced two-column layout on desktop.

Left:
- Small eyebrow label: Python Learning Platform.
- Main heading: "Learn Python — From Basics to Operators."
- Short supporting paragraph.
- Primary CTA: Start Learning.
- Secondary CTA: Try Python Code.

Right:
- A clean Python code preview or small interactive code demonstration.
- Use a real code example with syntax highlighting.
- A subtle Python-inspired visual accent.

The right side should communicate practical coding, not just decoration.

### Hero Example

Heading:

"Learn Python, One Step at a Time."

Supporting text:

"Understand Python fundamentals through simple lessons, practical examples, coding exercises, and an interactive AI tutor."

Buttons:
- Start Learning
- Open Playground

### Hero Design Rules

- Do not center all hero content.
- Keep the heading readable and visually strong.
- Do not make the hero excessively tall.
- Avoid gradients.
- Avoid floating decorative elements.
- Do not use a large generic AI illustration.
- The code preview must be visually meaningful.

## 6.3 Learning Overview

Below the hero, show a compact learning overview.

Display:

- 9 Chapters.
- Interactive Code Playground.
- Practice Exercises.
- AI Python Tutor.

Use simple icons and concise labels.

Do not make four enormous cards.

## 6.4 Chapter Overview

Display the nine chapters in a clean grid or vertical list.

Each chapter item should contain:

- Chapter number.
- Chapter title.
- One-line description.
- Lesson status.
- Estimated reading time, if configured.
- Open chapter action.

Example:

**01 — Introduction to Python**

Understand Python, its features, applications, and why it is popular.

Status:
- Not started.
- In progress.
- Completed.

### Chapter Grid

Desktop:
- Three columns when cards have enough space.
- Two columns when descriptions need more room.

Tablet:
- Two columns.

Mobile:
- One column.

Do not make cards unnecessarily tall.

## 6.5 Progress Overview

Show the learner's actual saved progress.

Include:

- Completed chapters.
- Total chapters.
- Overall percentage.
- Continue Learning action.

Example:

4 / 9 chapters completed  
44% complete

The progress must be calculated from real lesson completion state, not hardcoded values.

## 6.6 AI Tutor Introduction

Create a small section introducing the AI assistant.

Heading:
"Need Help Understanding Python?"

Description:
"Ask questions, understand errors, and get step-by-step explanations from your AI Python tutor."

CTA:
"Ask the AI Tutor"

Do not make the AI section visually dominate the homepage.

---

# 7. Learning Page Design

## 7.1 Main Objective

The learning page is the most important section of the platform.

It must provide a comfortable reading experience and make it easy to move between chapters.

## 7.2 Desktop Layout

Use a three-part layout.

### Left Sidebar

Width: approximately 250px.

Contains:

- Chapter navigation.
- Chapter numbers.
- Completion indicators.
- Active chapter highlight.
- Collapsible chapter list if needed.

The sidebar should be sticky within the learning area when practical.

### Main Content

Maximum width: approximately 760px.

Contains:
- Chapter title.
- Short introduction.
- Learning objectives.
- Explanations.
- Code examples.
- Expected outputs.
- Common mistakes.
- Practice exercises.
- Previous and next navigation.

### Right Side

Width: approximately 220px.

Contains:
- On this page navigation.
- Chapter progress.
- Related examples.
- Quick links to the playground.

The right sidebar is optional when the viewport is too narrow.

## 7.3 Mobile Layout

On mobile:

- Remove permanent left sidebar.
- Provide a Chapter Navigation dropdown or drawer.
- Display lesson content in a single column.
- Move the table of contents into a collapsible section.
- Keep Previous and Next navigation accessible.
- Ensure code examples fit without breaking the page.

## 7.4 Lesson Header

Every chapter begins with:

- Chapter number.
- Chapter title.
- Short description.
- Estimated reading time.
- Completion status.

Example:

CHAPTER 04

# Python Variables

"Learn how Python stores and works with information using variables."

Include a compact completion indicator.

## 7.5 Learning Objectives

Use a simple list.

Example:

After completing this chapter, you will be able to:

- Understand what a variable is.
- Create Python variables.
- Follow variable naming rules.
- Assign multiple values.
- Understand basic variable scope.

Avoid making objectives into large decorative cards.

## 7.6 Lesson Content Structure

Every lesson should follow a consistent structure:

1. Introduction.
2. Explanation.
3. Syntax.
4. Code example.
5. Expected output.
6. Explanation of the code.
7. Common mistakes.
8. Quick practice.
9. Chapter summary.
10. Mark as completed.

Each section should have a clear heading.

## 7.7 Code Example Component

All code examples should use a consistent component.

Structure:

- Small example title.
- Optional explanation.
- Syntax-highlighted code.
- Copy button.
- Run button where appropriate.
- Output panel when applicable.

Example:

```python
name = "Python"
print(name)
```

Expected output:

```text
Python
```

### Code Styling

- Use a light code background.
- Use a monospace font.
- Provide clear syntax highlighting.
- Keep line height comfortable.
- Add line numbers only when useful.
- Avoid excessive syntax colors.
- Use a subtle border.
- Support horizontal scrolling on small screens.

### Code Actions

Copy:
- Copies the code.
- Shows a temporary copied confirmation.

Run:
- Executes code in the browser-based Python playground engine.
- Displays actual output or an error.
- Must not display fabricated output.

## 7.8 Common Mistakes Component

Use a subtle warning-style panel.

Example:

**Common mistake**

Python is case-sensitive.

```python
Print("Hello")
```

This produces an error because Python uses lowercase `print()`.

Correct version:

```python
print("Hello")
```

Keep warnings concise and relevant.

## 7.9 Quick Practice Component

At the end of relevant lesson sections, provide a small exercise.

Example:

What will this code print?

```python
x = 10
print(x)
```

Options:
- 5
- 10
- x
- Error

After selection:
- Show correct or incorrect status.
- Explain the answer.
- Allow retry when appropriate.

## 7.10 Lesson Completion

At the end of a lesson:

- Display a short summary.
- Provide a Mark as Completed button.
- Update local progress.
- Show the next chapter action.
- Preserve completion state after refreshing.

Do not automatically mark lessons complete just because a user opens them.

---

# 8. Python Playground Design

## 8.1 Purpose

The playground allows users to experiment with Python code without leaving the platform.

It must be a real code execution environment, not a static code display.

## 8.2 Layout

### Desktop

Use a split layout.

Left:
- Code editor.

Right:
- Output panel.

Above:
- Editor title.
- Python execution status.
- Run.
- Reset.
- Copy.
- Clear output.

Below:
- Short usage instructions.
- Example programs.

### Mobile

Use a vertical layout.

1. Editor.
2. Editor controls.
3. Output.
4. Example programs.

Do not force the editor and output into narrow side-by-side columns.

## 8.3 Code Editor

Technology: CodeMirror 6.

Requirements:

- Python syntax highlighting.
- Line numbers.
- Basic indentation.
- Bracket matching.
- Keyboard navigation.
- Editable code.
- Monospace font.
- Light theme.
- Responsive height.
- Clear focus indicator.

Do not use Monaco unless a future requirement justifies its larger footprint.

## 8.4 Editor Controls

Required controls:

**Run Code**
- Executes the current code using Pyodide.
- Shows running state.
- Disables repeated run actions while execution is active.

**Reset**
- Restores the selected example or default starter code.
- Ask for confirmation only if the user has made meaningful changes that would be lost.

**Copy**
- Copies editor content.

**Clear Output**
- Clears the output panel.

**Example Selector**
- Loads a selected example.
- Avoid losing unsaved code without warning.

## 8.5 Output Panel

Display:

- Standard output.
- Error output.
- Execution status.
- Clear output action.

Use separate visual states for:

- Waiting.
- Running.
- Success.
- Error.
- Timeout.

Example successful output:

```text
Hello, World!
```

Example error:

```text
NameError: name 'nam' is not defined
```

Display useful Python errors instead of generic "Something went wrong" messages.

## 8.6 Python Execution Architecture

Use Pyodide in the browser.

Important implementation rules:

- Load Pyodide lazily.
- Run Python inside a Web Worker.
- Capture stdout and stderr.
- Keep the main UI responsive.
- Support execution timeout.
- Limit excessive output.
- Recreate the worker after timeout or failure.
- Display initialization and loading states.
- Handle browser compatibility limitations.
- Do not send user code to the AI API automatically.

Python execution must remain separate from the Groq assistant endpoint.

---

# 9. Practice & Quiz Design

## 9.1 Purpose

The practice area helps users check their understanding.

It should feel like a learning activity, not a complicated examination system.

## 9.2 Practice Dashboard

Display:

- Chapter selector.
- Practice categories.
- Available exercises.
- Previous results.
- Completed activities.

Practice categories:

1. Multiple Choice Questions.
2. True or False.
3. Fill in the Blanks.
4. Predict the Output.
5. Find the Error.
6. Coding Challenges.

## 9.3 Question Interface

Each question should contain:

- Question number.
- Chapter label.
- Question text.
- Code snippet if needed.
- Answer options or input.
- Submit action.
- Explanation after submission.

Avoid unnecessary visual elements.

## 9.4 Feedback States

Correct answer:
- Subtle green success state.
- Clear explanation.

Incorrect answer:
- Subtle red error state.
- Display the correct answer.
- Explain why it is correct.

Do not show only "Correct!" or "Wrong!".

The purpose is learning.

## 9.5 Quiz Results

Display:

- Total questions.
- Correct answers.
- Incorrect answers.
- Score percentage.
- Chapter performance.
- Retry button.
- Return to learning button.

Example:

Score: 8 / 10

80% correct.

The score must be calculated from actual answers.

## 9.6 Practice Progress

Save:

- Completed practice sets.
- Latest score.
- Best score.
- Attempt count.

Use LocalStorage.

Do not invent results or display fake historical statistics.

---

# 10. AI Python Assistant Design

## 10.1 Purpose

The AI assistant is a friendly Python tutor.

It should help learners understand concepts, debug errors, and learn through examples.

Provider: Groq API.

## 10.2 Visual Design

Use a clean chat interface.

### Desktop

Left:
- Conversation history.
- New conversation.
- Clear conversation.

Main:
- Chat messages.
- Message input.
- Suggested prompts.

### Mobile

- Full-width chat.
- Compact header.
- Conversation history in a drawer.
- Input area remains easy to reach.

## 10.3 Chat Header

Display:

- Python AI Tutor.
- Small status indicator.
- New conversation action.

Do not use a large chatbot illustration.

## 10.4 Welcome State

Heading:

"Let's Learn Python Together."

Supporting text:

"Ask me anything about Python basics, code examples, or programming errors."

Suggested prompts:

- Explain Python variables.
- What is the difference between `=` and `==`?
- Explain Python strings with examples.
- Why is my Python code showing an error?
- Give me a practice question about operators.

## 10.5 Message Design

User message:
- Right aligned.
- Light blue background or subtle surface contrast.

Assistant message:
- Left aligned.
- White or neutral background.
- Readable content width.

Support:

- Markdown.
- Code blocks.
- Inline code.
- Lists.
- Headings.
- Syntax-highlighted Python examples.

Avoid putting every response inside a separate oversized card.

## 10.6 AI Capabilities

The assistant must support:

1. Simple concept explanations.
2. Python code examples.
3. Line-by-line code explanation.
4. Error analysis.
5. Beginner-level practice questions.
6. Predict-the-output exercises.
7. Step-by-step problem solving.
8. Chapter-specific explanations.

The assistant should prioritize the nine chapters included in the curriculum.

If a user asks about advanced Python, it should explain that the topic is outside the current course scope and offer a basic introductory explanation when appropriate.

## 10.7 Suggested Prompt Design

Show compact suggestion chips above or below the welcome message.

When clicked, they should populate or submit the relevant question.

## 10.8 Chat Input

Requirements:

- Multiline input.
- Send button.
- Enter to send.
- Shift + Enter for a new line.
- Disabled state while a request is being submitted, where appropriate.
- Loading indicator.
- Clear error state.
- Auto-scroll when suitable.
- Keyboard accessible.

Do not allow empty messages to be submitted.

## 10.9 Groq Integration Architecture

The API key must never be exposed in the browser.

Use:

```text
Frontend Chat Interface
        |
        v
Next.js Route Handler
/api/assistant
        |
        v
Groq API
        |
        v
AI Tutor Response
```

Environment variables:

```env
GROQ_API_KEY=your_private_api_key
GROQ_MODEL=your_selected_model
```

Rules:

- Store the private API key in server-side environment variables.
- Never use `NEXT_PUBLIC_GROQ_API_KEY`.
- Never hardcode the API key.
- Never commit `.env.local`.
- Validate incoming requests.
- Limit request size.
- Handle rate limits.
- Handle provider errors.
- Support streaming where available.
- Avoid logging credentials.
- Keep the model configurable.

No database or separate backend service is required.

The Next.js Route Handler is a minimal serverless proxy used exclusively for secure Groq API requests.

## 10.10 AI Conversation Storage

Use LocalStorage for a limited amount of conversation history.

Store:

- Conversation ID.
- Conversation title.
- Messages.
- Created time.
- Updated time.

Provide:
- New conversation.
- Rename conversation if implemented.
- Delete conversation.
- Clear history.

Do not store the Groq API key or other secrets in browser storage.

Keep the storage structure versioned so it can be migrated later.

---

# 11. Dashboard & Progress Design

## 11.1 Purpose

The dashboard provides an overview of the learner's activity.

It must display actual user progress.

## 11.2 Dashboard Layout

### Welcome Section

Heading:

"Your Learning Progress"

Supporting text:

"Continue learning Python and track your progress."

### Summary Metrics

Display:

- Total chapters.
- Completed chapters.
- Overall completion.
- Practice activities completed.

Use compact metric components rather than oversized dashboard cards.

### Chapter Progress

Show all nine chapters with:

- Chapter number.
- Title.
- Status.
- Progress indicator.
- Continue action.

### Practice Results

Show:

- Latest quiz score.
- Best score.
- Number of attempts.

Only show values that are actually available.

## 11.3 Progress Calculation

Overall progress:

```text
Completed Chapters / Total Chapters × 100
```

Example:

```text
4 / 9 × 100 = 44.44%
```

Use the actual completion data.

Do not calculate progress based on page visits.

---

# 12. Search & Glossary Design

## 12.1 Search

Provide a search control in the header.

Search should find:

- Chapter titles.
- Lesson headings.
- Python concepts.
- Glossary terms.
- Example programs.

Search results should show:

- Result title.
- Short description.
- Chapter or section.
- Navigation action.

Support keyboard interaction.

Provide a useful empty state when nothing matches.

## 12.2 Glossary

Create a simple alphabetical glossary.

Each entry should contain:

- Term.
- Short definition.
- Relevant example.
- Related chapter.

Example:

**Variable**

A named place used to store a value in a Python program.

```python
name = "Python"
```

Keep definitions beginner-friendly.

---

# 13. Examples Library

## 13.1 Purpose

The examples library provides ready-to-use Python examples.

## 13.2 Categories

- Hello World.
- Addition.
- Variables.
- Data Types.
- Strings.
- Numbers.
- Boolean Expressions.
- Arithmetic Operators.
- Comparison Operators.
- Logical Operators.

## 13.3 Example Item

Each example contains:

- Title.
- Category.
- Python code.
- Explanation.
- Expected output.
- Copy button.
- Open in Playground action.

The Open in Playground action must load the selected example into the actual editor.

Do not create separate fake code editors for each example.

---

# 14. About & FAQ

## 14.1 About Page

Explain:

- What the platform is.
- Who it is designed for.
- What the curriculum covers.
- How the playground works.
- How the AI assistant works.
- What technologies power the learning experience.

Keep the writing concise and transparent.

## 14.2 FAQ

Include common questions:

1. Is this platform free to use?
2. Do I need prior programming knowledge?
3. Can I execute Python code here?
4. How is my learning progress saved?
5. Does progress sync across devices?
6. How does the AI tutor work?
7. Does the AI tutor always provide correct answers?
8. Can I use the platform on mobile?

Be honest about browser-only storage and AI limitations.

---

# 15. Interaction & Motion Design

## 15.1 Motion Philosophy

Motion should improve usability.

Use animation sparingly.

Avoid:
- Floating animations.
- Continuous decorative movement.
- Large parallax effects.
- Excessive scroll-triggered animation.
- Bouncing buttons.
- Animated background shapes.
- Long transitions.

## 15.2 Allowed Motion

- Button hover transitions.
- Dropdown opening and closing.
- Sidebar drawer transitions.
- Accordion expansion.
- Progress bar updates.
- Small success feedback.
- Page transitions where appropriate.
- Chat loading indicators.

## 15.3 Motion Timing

| Interaction | Duration |
|---|---:|
| Button hover | 120–160ms |
| Dropdown | 160–200ms |
| Modal | 180–220ms |
| Drawer | 200–250ms |
| Progress animation | 300–450ms |

Use ease-out transitions.

Respect `prefers-reduced-motion`.

---

# 16. Component Design System

Create reusable components instead of implementing each page independently.

## 16.1 Global Components

- `AppHeader`
- `MobileNavigation`
- `AppFooter`
- `PageContainer`
- `SectionHeading`
- `Breadcrumbs`
- `SearchDialog`
- `LoadingState`
- `EmptyState`
- `ErrorState`

## 16.2 Learning Components

- `ChapterSidebar`
- `ChapterHeader`
- `LearningObjectives`
- `LessonSection`
- `CodeExample`
- `CodeOutput`
- `CommonMistake`
- `QuickPractice`
- `ChapterProgress`
- `LessonNavigation`
- `CompletionButton`

## 16.3 Playground Components

- `PythonEditor`
- `EditorToolbar`
- `OutputPanel`
- `ExecutionStatus`
- `ExampleSelector`

## 16.4 Practice Components

- `PracticeDashboard`
- `QuestionCard`
- `AnswerOption`
- `QuestionFeedback`
- `QuizProgress`
- `QuizResult`

## 16.5 AI Components

- `AssistantLayout`
- `ConversationSidebar`
- `ChatHeader`
- `ChatMessage`
- `ChatInput`
- `SuggestedPrompts`
- `StreamingIndicator`

## 16.6 Dashboard Components

- `ProgressSummary`
- `ProgressMetric`
- `ChapterProgressList`
- `PracticeSummary`

All components must share the same spacing, colors, borders, typography, and interaction states.

---

# 17. UI States & Feedback

Every interactive component must define its states.

## 17.1 Buttons

States:

- Default.
- Hover.
- Focus.
- Active.
- Disabled.
- Loading.

## 17.2 Forms

States:

- Empty.
- Focused.
- Valid.
- Invalid.
- Submitting.
- Submitted.

## 17.3 Playground

States:

- Not initialized.
- Loading Python runtime.
- Ready.
- Running.
- Completed.
- Error.
- Timeout.

## 17.4 AI Assistant

States:

- Empty conversation.
- Sending.
- Streaming.
- Completed.
- API error.
- Rate limited.
- Offline.

## 17.5 Learning Progress

States:

- Not started.
- In progress.
- Completed.

Never use the same visual state for different meanings.

---

# 18. Responsive Design Requirements

## 18.1 Desktop: 1200px and Above

- Full navigation.
- Learning sidebar.
- Optional right table of contents.
- Three-column chapter overview when appropriate.
- Side-by-side playground editor and output.
- Full AI conversation history sidebar.

## 18.2 Tablet: 768px–1199px

- Compact navigation.
- Collapsible learning sidebar.
- Two-column chapter overview.
- Playground layout based on available width.
- Simplified AI sidebar.

## 18.3 Mobile: Below 768px

- Mobile navigation drawer.
- Single-column content.
- Compact chapter selector.
- Collapsible table of contents.
- Vertical playground.
- Full-width practice questions.
- Mobile-friendly chat input.
- Touch-friendly buttons.

## 18.4 Small Mobile: Below 380px

- Reduce horizontal padding carefully.
- Avoid tiny buttons.
- Keep essential controls visible.
- Allow code horizontal scrolling.
- Prevent heading overflow.
- Avoid side-by-side metric cards when they become cramped.

---

# 19. Accessibility

The application must follow accessible design practices.

Requirements:

- Semantic HTML.
- Proper heading hierarchy.
- Keyboard navigation.
- Visible focus states.
- Accessible labels.
- Sufficient text contrast.
- Descriptive button labels.
- Accessible modal behavior.
- Screen-reader-friendly progress indicators.
- Do not communicate status using color alone.
- Respect reduced motion.
- Ensure editor and chat controls are keyboard accessible.

Aim for WCAG 2.2 AA accessibility.

---

# 20. Content Design Guidelines

The platform is intended for beginners.

All educational content should use:

- Simple English.
- Short paragraphs.
- Clear explanations.
- Practical examples.
- Correct Python syntax.
- Expected outputs.
- Step-by-step explanations.

Avoid:
- Unexplained technical jargon.
- Long theoretical passages.
- Unnecessary advanced concepts.
- Repeated explanations.
- Incorrect or outdated Python examples.

## 20.1 Curriculum Structure

The learning platform must follow this chapter order:

1. Introduction to Python
2. Python Syntax
3. Python Output
4. Python Variables
5. Python Data Types
6. Python Numbers
7. Python Strings
8. Python Booleans
9. Python Operators

Every chapter should use the same lesson structure.

Do not add unrelated advanced chapters to the main curriculum.

---

# 21. Technical Design Constraints

## 21.1 Frontend

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui selectively.
- Lucide React.
- CodeMirror 6.
- MDX lesson content.

## 21.2 Python Execution

- Pyodide.
- Web Worker.
- Browser-based execution.
- No server-side Python execution.

## 21.3 AI

- Groq API.
- Minimal Next.js serverless Route Handler.
- Server-side API key.
- Configurable model.
- Streaming where available.

## 21.4 Data Persistence

Use LocalStorage for:

- Lesson completion.
- Practice results.
- Learning progress.
- User preferences.
- Limited chat history.

No database is required for the initial version.

## 21.5 Deployment

- GitHub for version control.
- Vercel for deployment.
- Environment variables configured in Vercel.
- `.env.local` excluded from Git.

---

# 22. Performance Requirements

The platform should feel fast, even on average hardware and slower internet connections.

Requirements:

- Lazy-load Pyodide.
- Lazy-load the code editor when appropriate.
- Avoid unnecessary client-side JavaScript.
- Split large components.
- Avoid loading all lesson content on the homepage.
- Optimize images and fonts.
- Avoid excessive animation libraries.
- Keep LocalStorage data manageable.
- Provide loading states for large resources.
- Avoid blocking the main UI during Python execution.

The AI assistant must not be required for normal learning functionality.

If the Groq API is unavailable, lessons, quizzes, progress tracking, and playground must continue working.

---

# 23. Design Quality Checklist

Before considering a page complete, verify:

### Visual Quality

- [ ] Light theme only.
- [ ] Consistent typography.
- [ ] Consistent spacing.
- [ ] Proper visual hierarchy.
- [ ] No unnecessary gradients.
- [ ] No decorative floating shapes.
- [ ] No excessive card nesting.
- [ ] No oversized empty sections.
- [ ] No random icon styles.
- [ ] No excessive shadows.

### Functionality

- [ ] All navigation links work.
- [ ] All buttons perform real actions.
- [ ] Code examples can be copied.
- [ ] Code execution works.
- [ ] Output is real.
- [ ] Quizzes provide explanations.
- [ ] Progress is saved.
- [ ] AI assistant calls Groq securely.
- [ ] Chat errors are handled.
- [ ] Search works.
- [ ] Mobile navigation works.

### Responsive Quality

- [ ] Desktop layout works.
- [ ] Tablet layout works.
- [ ] Mobile layout works.
- [ ] No horizontal page overflow.
- [ ] Editor remains usable.
- [ ] Chat input remains accessible.
- [ ] Touch targets are comfortable.

### Accessibility

- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Semantic HTML is used.
- [ ] Contrast is sufficient.
- [ ] Status is not communicated through color alone.
- [ ] Reduced-motion preferences are respected.

---

# 24. Final Design Direction

The final product should feel like a polished learning platform built by a professional product team.

The visual experience should be:

- Clean.
- Light.
- Minimal.
- Educational.
- Modern.
- Readable.
- Responsive.
- Consistent.
- Practical.

**Most important instruction: Do not sacrifice usability for decoration.**

The platform should not look like a generic AI-generated SaaS dashboard.

Avoid unnecessary components and visual effects. Use whitespace intelligently. Keep learning content readable. Make every interaction meaningful.

The final result should make a beginner feel comfortable learning Python, experimenting with code, practicing concepts, and asking questions.

**Design priority: Learning Experience → Usability → Consistency → Visual Polish → Decoration.**