import React from "react";
import { CopyButton } from "@/components/common/CopyButton";
import { PythonLogoMark } from "@/components/common/PythonLogoMark";
import { CodeExampleClient } from "@/components/lessons/CodeExampleClient";
import { highlightCode } from "@/lib/highlight";

export interface CodeExampleProps {
  title?: string;
  description?: string;
  code: string;
  expectedOutput?: string;
  showLineNumbers?: boolean;
}

export async function CodeExample({
  title,
  description,
  code,
  expectedOutput,
  showLineNumbers = false,
}: CodeExampleProps) {
  const cleanCode = code.replace(/\r\n/g, "\n").trim();
  const highlightedHtml = await highlightCode(cleanCode, "python");

  return (
    <CodeExampleClient
      title={title}
      description={description}
      code={cleanCode}
      expectedOutput={expectedOutput?.replace(/\r\n/g, "\n").trimEnd()}
      highlightedHtml={highlightedHtml}
      showLineNumbers={showLineNumbers}
    />
  );
}

export function CodePreviewBadge() {
  return <PythonLogoMark className="h-4 w-4" />;
}

export function SimpleCodeCopy({ code }: { code: string }) {
  return <CopyButton text={code} />;
}

