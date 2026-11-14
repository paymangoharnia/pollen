/** Shared types for the Pollinations API client (https://gen.pollinations.ai). */

export type Role = "system" | "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

/** Subset of chat-completion request knobs we expose. Pass-through for the rest. */
export interface ChatOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stop?: string | string[];
  /**
   * Reasoning models need a high `max_tokens` plus `reasoning_effort: "low"`
   * (otherwise the API can return HTTP 400 and burn budget on thinking tokens).
   */
  reasoning_effort?: "minimal" | "low" | "medium" | "high";
  /** Comma-separated fallback model ids (up to 4) — caller-selected fallbacks. */
  fallback_models?: string;
  signal?: AbortSignal;
}

export interface ChatResult {
  content: string;
  /** Finish reason from the API ("stop", "length", ...) if present. */
  finishReason?: string;
  /** Raw assistant message object from the API. */
  raw?: unknown;
}

export interface ChatChunk {
  /** Incremental text delta ("" for chunks without content). */
  delta: string;
  finishReason?: string;
}

/** Model entry from GET /models (loosely typed — fields vary per modality). */
export interface PollinationsModel {
  id?: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

export type ModelModality =
  | "all"
  | "text"
  | "image"
  | "audio"
  | "video"
  | "embeddings"
  | "3d";

export interface Settled<T> {
  status: "fulfilled" | "rejected";
  value?: T;
  reason?: unknown;
  /** Index of the original task (handy for fanning out to N models). */
  index: number;
}
