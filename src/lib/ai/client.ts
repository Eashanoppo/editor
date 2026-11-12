import type { AIErrorInfo, AIProviderRequest, AIStreamCallbacks } from "@/types/assistant";

export async function fetchAssistantStatus(): Promise<{
  configured: boolean;
  provider: string;
  model: string;
} | null> {
  try {
    const res = await fetch("/api/assistant", { method: "GET" });
    if (!res.ok) return null;
    return (await res.json()) as {
      configured: boolean;
      provider: string;
      model: string;
    };
  } catch {
    return null;
  }
}

export async function streamAssistantReply(
  payload: AIProviderRequest,
  callbacks: AIStreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      callbacks.onComplete();
      return;
    }
    callbacks.onError({
      code: "NETWORK_ERROR",
      message:
        typeof navigator !== "undefined" && !navigator.onLine
          ? "You appear to be offline. Reconnect to ask the AI Python Tutor."
          : "Network request failed. Please check your connection and try again.",
    });
    return;
  }

  if (!response.ok || !response.body) {
    let errorInfo: AIErrorInfo = {
      code: "PROVIDER_ERROR",
      message: `Assistant request failed (HTTP ${response.status}).`,
    };
    try {
      const json = (await response.json()) as {
        code?: AIErrorInfo["code"];
        error?: string;
        retryAfterSeconds?: number;
      };
      if (json.error) {
        errorInfo = {
          code: json.code ?? "PROVIDER_ERROR",
          message: json.error,
          retryAfterSeconds: json.retryAfterSeconds,
        };
      }
    } catch {
      // keep default
    }
    callbacks.onError(errorInfo);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") {
          callbacks.onComplete();
          return;
        }
        try {
          const parsed = JSON.parse(data) as { token?: string; error?: string };
          if (parsed.error) {
            callbacks.onError({
              code: "PROVIDER_ERROR",
              message: parsed.error,
            });
            return;
          }
          if (parsed.token) {
            callbacks.onToken(parsed.token);
          }
        } catch {
          // Ignore partial line
        }
      }
    }
    callbacks.onComplete();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      callbacks.onComplete();
      return;
    }
    callbacks.onError({
      code: "NETWORK_ERROR",
      message: "Connection interrupted while streaming response.",
    });
  } finally {
    reader.releaseLock();
  }
}

