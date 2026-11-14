import { toError } from "./errors";
import { withRetry, type RetryOptions } from "./retry";
import type {
  ChatChunk,
  ChatOptions,
  ChatResult,
  ModelModality,
  PollinationsModel,
} from "./types";

export const DEFAULT_BASE_URL = "https://gen.pollinations.ai";

export interface ClientConfig {
  /** Scoped `sk_...` key from polli-connect / BYOP. Omit for unauthenticated calls. */
  apiKey?: string | null;
  baseUrl?: string;
}

const MODALITY_MODEL_PATH: Record<Exclude<ModelModality, "all">, string> = {
  text: "text",
  image: "image",
  audio: "audio",
  video: "video",
  embeddings: "embeddings",
  "3d": "3d",
};

/**
 * Unified browser client for the Pollinations API.
 *
 * Auth: `Authorization: Bearer <key>` for JSON endpoints; media URL builders
 * append `?key=` only when `mediaKeyInUrl` is enabled (keys in URLs can leak
 * into browser history/server logs — prefer fetching media as blobs).
 */
export class PollinationsClient {
  readonly baseUrl: string;
  private apiKey?: string | null;

  constructor(config: ClientConfig = {}) {
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.apiKey = config.apiKey ?? null;
  }

  setApiKey(key: string | null | undefined) {
    this.apiKey = key ?? null;
  }

  private authHeaders(): Record<string, string> {
    return this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {};
  }

  // ---------------------------------------------------------------- text

  /** POST /v1/chat/completions (OpenAI-compatible). Retries 429/5xx. */
  async chat(options: ChatOptions, retry: RetryOptions = {}): Promise<ChatResult> {
    const body = await withRetry(async () => {
      const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.authHeaders() },
        body: JSON.stringify({
          model: options.model,
          messages: options.messages,
          temperature: options.temperature,
          max_tokens: options.max_tokens,
          top_p: options.top_p,
          stop: options.stop,
          reasoning_effort: options.reasoning_effort,
          fallback_models: options.fallback_models,
        }),
        signal: options.signal,
      });
      if (!res.ok) throw await toError(res);
      return res.json();
    }, retry);

    const choice = body?.choices?.[0];
    return {
      content: choice?.message?.content ?? "",
      finishReason: choice?.finish_reason,
      raw: choice?.message,
    };
  }

  /** POST /v1/chat/completions with stream:true — yields text deltas. */
  async *chatStream(
    options: ChatOptions,
    retry: RetryOptions = {}
  ): AsyncGenerator<ChatChunk, void, unknown> {
    const res = await withRetry(async () => {
      const r = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.authHeaders() },
        body: JSON.stringify({
          model: options.model,
          messages: options.messages,
          temperature: options.temperature,
          max_tokens: options.max_tokens,
          top_p: options.top_p,
          stop: options.stop,
          reasoning_effort: options.reasoning_effort,
          fallback_models: options.fallback_models,
          stream: true,
        }),
        signal: options.signal,
      });
      if (!r.ok) throw await toError(r);
      return r;
    }, retry);
    if (!res.body) throw new Error("Streaming not supported by this response");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const evt of events) {
        for (const line of evt.split("\n")) {
          const data = line.startsWith("data: ") ? line.slice(6) : null;
          if (!data || data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const choice = json?.choices?.[0];
            if (choice)
              yield {
                delta: choice?.delta?.content ?? "",
                finishReason: choice?.finish_reason ?? undefined,
              };
          } catch {
            // ignore malformed keepalive/heartbeat frames
          }
        }
      }
    }
  }

  /** GET /text/{prompt} — quick plain-text completion. */
  async prompt(
    prompt: string,
    options: { model?: string; system?: string; signal?: AbortSignal } & RetryOptions = {}
  ): Promise<string> {
    const { model, system, signal, ...retry } = options;
    const url = new URL(`${this.baseUrl}/text/${encodeURIComponent(prompt)}`);
    if (model) url.searchParams.set("model", model);
    if (system) url.searchParams.set("system", system);
    const text = await withRetry(async () => {
      const res = await fetch(url, {
        headers: this.authHeaders(),
        signal,
      });
      if (!res.ok) throw await toError(res);
      return res.text();
    }, retry);
    return text;
  }

  // --------------------------------------------------------------- models

  /** GET /models — no auth required. `modality` picks a per-modality catalog. */
  async listModels(
    modality: ModelModality = "all",
    options: { signal?: AbortSignal } & RetryOptions = {}
  ): Promise<PollinationsModel[]> {
    const { signal, ...retry } = options;
    const path = modality === "all" ? "models" : `${MODALITY_MODEL_PATH[modality]}/models`;
    const models = await withRetry(async () => {
      const res = await fetch(`${this.baseUrl}/${path}`, { signal });
      if (!res.ok) throw await toError(res);
      return res.json();
    }, retry);
    return Array.isArray(models) ? models : [];
  }

  // ---------------------------------------------------------------- media
  // URL builders (for <img>/<audio>/<video> sources). Callers that pass a
  // key opt into `?key=` — prefer blob fetching for sensitive keys.

  imageUrl(
    prompt: string,
    opts: { model?: string; width?: number; height?: number; seed?: number; key?: string } = {}
  ): string {
    const url = new URL(`${this.baseUrl}/image/${encodeURIComponent(prompt)}`);
    if (opts.model) url.searchParams.set("model", opts.model);
    if (opts.width) url.searchParams.set("width", String(opts.width));
    if (opts.height) url.searchParams.set("height", String(opts.height));
    if (opts.seed !== undefined) url.searchParams.set("seed", String(opts.seed));
    const key = opts.key ?? this.apiKey;
    if (key && opts.key !== null) url.searchParams.set("key", key);
    return url.toString();
  }

  audioUrl(
    text: string,
    opts: { voice?: string; model?: string; key?: string } = {}
  ): string {
    const url = new URL(`${this.baseUrl}/audio/${encodeURIComponent(text)}`);
    if (opts.voice) url.searchParams.set("voice", opts.voice);
    if (opts.model) url.searchParams.set("model", opts.model);
    const key = opts.key ?? this.apiKey;
    if (key && opts.key !== null) url.searchParams.set("key", key);
    return url.toString();
  }

  videoUrl(
    prompt: string,
    opts: { model?: string; duration?: number; key?: string } = {}
  ): string {
    const url = new URL(`${this.baseUrl}/video/${encodeURIComponent(prompt)}`);
    if (opts.model) url.searchParams.set("model", opts.model);
    if (opts.duration) url.searchParams.set("duration", String(opts.duration));
    const key = opts.key ?? this.apiKey;
    if (key && opts.key !== null) url.searchParams.set("key", key);
    return url.toString();
  }
}

export function createClient(config: ClientConfig = {}): PollinationsClient {
  return new PollinationsClient(config);
}
