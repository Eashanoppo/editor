import { AI_CONFIG, getServerAIConfig } from "@/lib/ai/config";
import { buildTutorSystemPrompt } from "@/lib/ai/syllabus-context";
import type { ChatRole } from "@/types/assistant";

export interface ProviderChatMessage {
  role: "system" | ChatRole;
  content: string;
}

export interface ProviderStreamResult {
  ok: boolean;
  status: number;
  stream?: ReadableStream<Uint8Array>;
  errorCode?:
    | "NOT_CONFIGURED"
    | "RATE_LIMITED"
    | "PROVIDER_ERROR";
  errorMessage?: string;
  retryAfterSeconds?: number;
}

export interface AIProviderAdapter {
  readonly name: string;
  streamChat(params: {
    messages: Array<{ role: ChatRole; content: string }>;
    chapterContext?: string;
    apiKeyOverride?: string;
    signal?: AbortSignal;
  }): Promise<ProviderStreamResult>;
}

export class GroqProviderAdapter implements AIProviderAdapter {
  readonly name = AI_CONFIG.providerName;

  async streamChat(params: {
    messages: Array<{ role: ChatRole; content: string }>;
    chapterContext?: string;
    apiKeyOverride?: string;
    signal?: AbortSignal;
  }): Promise<ProviderStreamResult> {
    const config = getServerAIConfig();
    const overrideKey = params.apiKeyOverride?.trim() ?? "";
    const effectiveApiKey = overrideKey || config.apiKey;
    const isValidKey =
      effectiveApiKey.length > 0 && effectiveApiKey !== "your_groq_api_key_here";

    if (!isValidKey) {
      return {
        ok: false,
        status: 503,
        errorCode: "NOT_CONFIGURED",
        errorMessage:
          "Groq API key is missing. Enter your Groq API key in the AI Assistant settings above (or add GROQ_API_KEY to .env.local on the server).",
      };
    }

    const systemMessage: ProviderChatMessage = {
      role: "system",
      content: buildTutorSystemPrompt(params.chapterContext),
    };

    const trimmedHistory = params.messages.slice(-AI_CONFIG.maxContextMessages);

    let response: Response;
    try {
      response = await fetch(config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${effectiveApiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [systemMessage, ...trimmedHistory],
          temperature: AI_CONFIG.temperature,
          max_tokens: AI_CONFIG.maxTokens,
          stream: true,
        }),
        signal: params.signal,
      });
    } catch {
      return {
        ok: false,
        status: 502,
        errorCode: "PROVIDER_ERROR",
        errorMessage:
          "Unable to reach the Groq API service. Please check your network connection and try again.",
      };
    }

    if (!response.ok || !response.body) {
      if (response.status === 429) {
        const retryHeader = response.headers.get("retry-after");
        const retrySeconds = retryHeader ? Number.parseInt(retryHeader, 10) : undefined;
        return {
          ok: false,
          status: 429,
          errorCode: "RATE_LIMITED",
          errorMessage:
            "Too many requests sent to the AI provider. Please wait a moment before sending another question.",
          retryAfterSeconds: Number.isFinite(retrySeconds) ? retrySeconds : undefined,
        };
      }

      if (response.status === 401 || response.status === 403) {
        return {
          ok: false,
          status: 401,
          errorCode: "NOT_CONFIGURED",
          errorMessage: overrideKey
            ? "Your Groq API key was rejected by Groq. Please check your key in the API Key settings."
            : "The server's Groq API key was rejected by Groq. Please verify GROQ_API_KEY in .env.local or enter your own key in the UI.",
        };
      }

      let providerDetail = `Groq API returned HTTP ${response.status}.`;
      try {
        const errJson = (await response.json()) as {
          error?: { message?: string };
        };
        if (errJson?.error?.message) {
          providerDetail = errJson.error.message;
        }
      } catch {
        // Keep generic HTTP status detail
      }

      return {
        ok: false,
        status: response.status >= 400 ? response.status : 502,
        errorCode: "PROVIDER_ERROR",
        errorMessage: providerDetail,
      };
    }

    // Transform Groq SSE stream into clean { token } SSE events
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const upstreamReader = response.body.getReader();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let buffer = "";
        try {
          while (true) {
            const { value, done } = await upstreamReader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const rawLine of lines) {
              const line = rawLine.trim();
              if (!line.startsWith("data:")) continue;
              const dataPayload = line.slice(5).trim();

              if (dataPayload === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(dataPayload) as {
                  choices?: Array<{ delta?: { content?: string } }>;
                };
                const token = parsed.choices?.[0]?.delta?.content;
                if (typeof token === "string" && token.length > 0) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
                  );
                }
              } catch {
                // Skip malformed partial SSE lines cleanly
              }
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                error: "Stream interrupted while receiving AI response.",
              })}\n\n`
            )
          );
          controller.close();
        } finally {
          upstreamReader.releaseLock();
        }
      },
      cancel() {
        upstreamReader.cancel().catch(() => {});
      },
    });

    return {
      ok: true,
      status: 200,
      stream,
    };
  }
}

export const activeAIProvider: AIProviderAdapter = new GroqProviderAdapter();

