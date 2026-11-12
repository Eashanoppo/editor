export const AI_CONFIG = {
  providerName: "Groq",
  endpoint: "https://api.groq.com/openai/v1/chat/completions",
  defaultModel: "openai/gpt-oss-120b",
  maxContextMessages: 16,
  maxMessageLength: 4000,
  maxTokens: 4096,
  temperature: 0.4,
} as const;

export function getServerAIConfig() {
  const apiKey = process.env.GROQ_API_KEY?.trim() ?? "";
  const model = process.env.GROQ_MODEL?.trim() || AI_CONFIG.defaultModel;
  const isConfigured =
    apiKey.length > 0 && apiKey !== "your_groq_api_key_here";

  return {
    apiKey,
    model,
    isConfigured,
    endpoint: AI_CONFIG.endpoint,
  };
}

