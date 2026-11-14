import { isRetryable, PollinationsError } from "./errors";

export interface RetryOptions {
  /** Max attempts per request (default 3). */
  attempts?: number;
  /** Base backoff in ms (default 700, doubles each attempt). */
  baseDelayMs?: number;
  /** Abort signal to stop retrying immediately. */
  signal?: AbortSignal;
  /** Called before each retry with (error, attemptNumber, delayMs). */
  onRetry?: (err: unknown, attempt: number, delayMs: number) => void;
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });

/**
 * Retry a request factory with exponential backoff on 429/5xx.
 * Honors the server's `Retry-After` header when present.
 */
export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const attempts = opts.attempts ?? 3;
  const base = opts.baseDelayMs ?? 700;
  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i === attempts || !isRetryable(err)) throw err;
      if (opts.signal?.aborted) throw err;
      const serverDelay =
        err instanceof PollinationsError && err.retryAfterSeconds
          ? err.retryAfterSeconds * 1000
          : 0;
      const delay = Math.max(serverDelay, base * 2 ** (i - 1));
      opts.onRetry?.(err, i, delay);
      await sleep(delay, opts.signal);
    }
  }
  throw lastErr;
}

/**
 * Fan out tasks in parallel and never let one rejection kill the batch
 * (Promise.allSettled with the original index attached).
 */
export async function settleAll<T>(
  tasks: Array<() => Promise<T>>
): Promise<import("./types").Settled<T>[]> {
  const results = await Promise.allSettled(tasks.map((t) => t()));
  return results.map((r, index) =>
    r.status === "fulfilled"
      ? { status: "fulfilled", value: r.value, index }
      : { status: "rejected", reason: r.reason, index }
  );
}
