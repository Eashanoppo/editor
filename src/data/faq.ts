export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-free",
    question: "Is this platform free to use?",
    answer:
      "Yes. All nine Python chapters, the browser Playground, the Examples Library, the Cheat Sheet, the Glossary, and all Practice Quizzes are completely free to use without creating an account.",
  },
  {
    id: "faq-prereq",
    question: "Do I need prior programming knowledge?",
    answer:
      "No prior programming experience is needed. Chapter 1 introduces Python from scratch, and each chapter builds step by step through variables, data types, strings, booleans, and operators.",
  },
  {
    id: "faq-exec",
    question: "Can I execute real Python code here?",
    answer:
      "Yes. The Playground, lesson Run buttons, and quiz coding challenges execute genuine Python 3 inside your browser using Pyodide (WebAssembly) inside an isolated Web Worker. Because it runs in a browser worker rather than desktop Python, interactive terminal input() and desktop filesystem access are not supported.",
  },
  {
    id: "faq-storage",
    question: "How is my learning progress saved?",
    answer:
      "Your completed chapters, inline lesson checks, quiz attempt history, and AI conversation history are saved locally in your browser's LocalStorage. No account registration or external database is used.",
  },
  {
    id: "faq-sync",
    question: "Does progress sync across devices?",
    answer:
      "No. Because progress lives strictly in your local browser storage for privacy and simplicity, progress does not automatically sync across different computers, browsers, or private browsing sessions.",
  },
  {
    id: "faq-ai-works",
    question: "How does the AI Python tutor work?",
    answer:
      "When configured on the server, the AI Assistant connects securely to the Groq API through a minimal serverless route handler (/api/assistant) so API credentials stay hidden from the browser. It receives context from the 9-chapter syllabus to provide beginner-friendly explanations.",
  },
  {
    id: "faq-ai-accuracy",
    question: "Does the AI tutor always provide correct answers?",
    answer:
      "No AI model is infallible. Always verify code behavior by testing examples inside the built-in Python Playground and checking them against the lesson content. If the AI service is offline or unconfigured, all lessons, playground features, and quizzes continue working normally.",
  },
  {
    id: "faq-mobile",
    question: "Can I use the platform on mobile?",
    answer:
      "Yes. Every page—including lessons, the stacked mobile code playground, practice quizzes, and AI chat—is responsive for phones, tablets, and desktop screens.",
  },
];

