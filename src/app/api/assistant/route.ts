import { connection } from "next/server";
import { z } from "zod";
import { AI_CONFIG, getServerAIConfig } from "@/lib/ai/config";
import { activeAIProvider } from "@/lib/ai/provider";
import { CHAPTERS } from "@/data/chapters";

const VALID_CHAPTER_SLUGS = new Set(CHAPTERS.map((c) => c.slug));

const assistantRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z
          .string()
          .trim()
          .min(1, "Message cannot be empty.")
          .max(
            AI_CONFIG.maxMessageLength,
            `Message cannot exceed ${AI_CONFIG.maxMessageLength} characters.`
          ),
      })
    )
    .min(1, "At least one message is required.")
    .max(20, "Conversation context exceeded maximum request length."),
  chapterContext: z.string().optional(),
});

export async function GET() {
  await connection();
  const { isConfigured, model } = getServerAIConfig();
  return Response.json({
    provider: activeAIProvider.name,
    configured: isConfigured,
    model,
  });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 48 * 1024) {
    return Response.json(
      {
        code: "INVALID_REQUEST",
        error: "Request size is too large. Keep your question concise.",
      },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { code: "INVALID_REQUEST", error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const parsed = assistantRequestSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Invalid request.";
    return Response.json(
      { code: "INVALID_REQUEST", error: firstIssue },
      { status: 400 }
    );
  }

  const headerApiKey = request.headers.get("x-groq-api-key")?.trim();
  if (headerApiKey && (headerApiKey.length > 256 || !/^[\x21-\x7E]+$/.test(headerApiKey))) {
    return Response.json(
      { code: "INVALID_REQUEST", error: "Invalid Groq API key header format." },
      { status: 400 }
    );
  }

  const chapterContext =
    parsed.data.chapterContext &&
    VALID_CHAPTER_SLUGS.has(parsed.data.chapterContext)
      ? parsed.data.chapterContext
      : undefined;

  const result = await activeAIProvider.streamChat({
    messages: parsed.data.messages,
    chapterContext,
    apiKeyOverride: headerApiKey || undefined,
    signal: request.signal,
  });

  if (!result.ok || !result.stream) {
    const headers: HeadersInit = {};
    if (result.retryAfterSeconds) {
      headers["Retry-After"] = String(result.retryAfterSeconds);
    }
    return Response.json(
      {
        code: result.errorCode ?? "PROVIDER_ERROR",
        error: result.errorMessage ?? "Unable to get response from AI provider.",
        retryAfterSeconds: result.retryAfterSeconds,
      },
      { status: result.status, headers }
    );
  }

  return new Response(result.stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
