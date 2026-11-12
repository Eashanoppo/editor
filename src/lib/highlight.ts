import { codeToHtml } from "shiki";

export async function highlightCode(
  code: string,
  lang: "python" | "text" | "bash" = "python"
): Promise<string> {
  "use cache";
  const normalized = code.replace(/\r\n/g, "\n").trimEnd();
  if (lang === "text") {
    const escaped = normalized
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre class="shiki" style="color:var(--text-primary)"><code>${escaped}</code></pre>`;
  }

  return codeToHtml(normalized, {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: "light",
  });
}
