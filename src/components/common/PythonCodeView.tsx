"use client";

import React from "react";
import { cn } from "@/lib/utils";

const PYTHON_KEYWORDS = new Set([
  "False",
  "None",
  "True",
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "try",
  "while",
  "with",
  "yield",
]);

const PYTHON_BUILTINS = new Set([
  "print",
  "len",
  "type",
  "int",
  "float",
  "str",
  "bool",
  "complex",
  "input",
  "range",
  "abs",
  "round",
  "min",
  "max",
  "sum",
  "id",
]);

interface Token {
  type: "comment" | "string" | "number" | "keyword" | "builtin" | "operator" | "plain";
  value: string;
}

const TOKEN_REGEX =
  /(#[^\n]*)|('''[\s\S]*?'''|"""[\s\S]*?"""|[fFrR]?(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"))|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?j?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|(==|!=|<=|>=|\*\*|\/\/|<<|>>|\+=|-=|\*=|\/=|%=|\/\/=|\*\*=|[+\-*/%=<>!&|^~])/g;

function tokenizePython(code: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(TOKEN_REGEX)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) {
      tokens.push({ type: "plain", value: code.slice(lastIndex, idx) });
    }

    const [full, comment, str, num, ident, op] = match;
    if (comment) {
      tokens.push({ type: "comment", value: comment });
    } else if (str) {
      tokens.push({ type: "string", value: str });
    } else if (num) {
      tokens.push({ type: "number", value: num });
    } else if (ident) {
      if (PYTHON_KEYWORDS.has(ident)) {
        tokens.push({ type: "keyword", value: ident });
      } else if (PYTHON_BUILTINS.has(ident)) {
        tokens.push({ type: "builtin", value: ident });
      } else {
        tokens.push({ type: "plain", value: ident });
      }
    } else if (op) {
      tokens.push({ type: "operator", value: op });
    } else {
      tokens.push({ type: "plain", value: full });
    }

    lastIndex = idx + full.length;
  }

  if (lastIndex < code.length) {
    tokens.push({ type: "plain", value: code.slice(lastIndex) });
  }

  return tokens;
}

const tokenClassMap: Record<Token["type"], string> = {
  comment: "text-[#94A3B8] dark:text-[#64748B] italic",
  string: "text-[#15803D] dark:text-[#4ADE80]",
  number: "text-[#B45309] dark:text-[#FBBF24]",
  keyword: "text-[#3776AB] dark:text-[#6EB2ED] font-medium",
  builtin: "text-[#1D4ED8] dark:text-[#93C5FD]",
  operator: "text-[#475569] dark:text-[#94A3B8]",
  plain: "text-[#243247] dark:text-[#E2E8F0]",
};

export function PythonCodeView({
  code,
  showLineNumbers = false,
  className,
}: {
  code: string;
  showLineNumbers?: boolean;
  className?: string;
}) {
  const lines = code.replace(/\r\n/g, "\n").trimEnd().split("\n");

  return (
    <pre
      className={cn(
        "overflow-x-auto bg-surface p-4 font-mono text-[13px] sm:text-sm leading-[1.6] text-ink",
        className
      )}
    >
      <code>
        {lines.map((line, lineIdx) => {
          const tokens = tokenizePython(line);
          return (
            <span key={lineIdx} className="block">
              {showLineNumbers ? (
                <span className="mr-4 inline-block w-5 select-none text-right text-xs text-ink-muted">
                  {lineIdx + 1}
                </span>
              ) : null}
              {tokens.length === 0 ? (
                <span>&nbsp;</span>
              ) : (
                tokens.map((token, idx) => (
                  <span key={idx} className={tokenClassMap[token.type]}>
                    {token.value}
                  </span>
                ))
              )}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

