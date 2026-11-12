export type ChatRole = "user" | "assistant";

export interface ChatMessageItem {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessageItem[];
  chapterContext?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIProviderRequest {
  messages: Array<{ role: ChatRole; content: string }>;
  chapterContext?: string;
}

export interface AIStreamCallbacks {
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (error: AIErrorInfo) => void;
}

export interface AIErrorInfo {
  code:
    | "NOT_CONFIGURED"
    | "RATE_LIMITED"
    | "INVALID_REQUEST"
    | "PROVIDER_ERROR"
    | "NETWORK_ERROR";
  message: string;
  retryAfterSeconds?: number;
}

