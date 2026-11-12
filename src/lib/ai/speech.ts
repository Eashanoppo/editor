/**
 * Convert a markdown AI response into natural spoken prose for window.speechSynthesis.
 */
export function formatReplyForSpeech(markdown: string): string {
  if (!markdown) return "";

  let text = markdown
    // Replace multi-line fenced code blocks so TTS does not read symbols aloud verbatim
    .replace(/```[\s\S]*?```/g, ". Code example shown on screen. ")
    // Unwrap inline code ticks
    .replace(/`([^`]+)`/g, "$1")
    // Convert markdown links [label](url) -> label
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    // Remove heading / blockquote / emphasis / list markers
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    // Turn line breaks into sentence pauses cleanly
    .replace(/\r?\n+/g, ". ")
    .replace(/\s*\.\s*\.\s*/g, ". ")
    .replace(/\s+/g, " ")
    .trim();

  if (text && !/[.!?]$/.test(text)) {
    text += ".";
  }

  return text;
}

/**
 * Split long spoken text into ~200 char sentence chunks to avoid Chrome's long-utterance cutoff bug.
 */
export function splitSpeechChunks(text: string, maxLen = 200): string[] {
  const cleaned = text.trim();
  if (!cleaned) return [];

  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (!sentence) continue;
    if (sentence.length > maxLen) {
      if (current) {
        chunks.push(current.trim());
        current = "";
      }
      const words = sentence.split(/\s+/);
      let part = "";
      for (const word of words) {
        if ((part + " " + word).trim().length > maxLen && part) {
          chunks.push(part.trim());
          part = word;
        } else {
          part = part ? `${part} ${word}` : word;
        }
      }
      if (part) chunks.push(part.trim());
      continue;
    }

    if ((current + " " + sentence).trim().length > maxLen && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

