/** Error thrown for non-2xx Pollinations API responses. */
export class PollinationsError extends Error {
  readonly status: number;
  /** Machine-readable code from the API body, e.g. INSUFFICIENT_BALANCE, KEY_BUDGET_EXHAUSTED, content_blocked. */
  readonly code?: string;
  /** Server-provided retry delay in seconds (429/5xx responses), if sent. */
  readonly retryAfterSeconds?: number;

  constructor(status: number, message: string, code?: string, retryAfterSeconds?: number) {
    super(message);
    this.name = "PollinationsError";
    this.status = status;
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503]);

export function isRetryable(err: unknown): boolean {
  return err instanceof PollinationsError && RETRYABLE_STATUSES.has(err.status);
}

/** Parse an error response body into a PollinationsError. */
export async function toError(res: Response): Promise<PollinationsError> {
  const retryAfter = Number(res.headers.get("Retry-After")) || undefined;
  let message = `HTTP ${res.status}`;
  let code: string | undefined;
  try {
    const body = await res.json();
    if (body?.error?.message) message = body.error.message;
    else if (body?.error) message = typeof body.error === "string" ? body.error : JSON.stringify(body.error);
    else if (body?.message) message = body.message;
    code = body?.error?.code ?? body?.code;
  } catch {
    // body was not JSON — keep default message
  }
  return new PollinationsError(res.status, message, code, retryAfter);
}
