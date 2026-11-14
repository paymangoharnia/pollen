/** Unicode-safe base64url helpers for sharing a dialog through the URL hash. */

export function encodeState(obj: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function decodeState<T>(encoded: string): T | null {
  try {
    const b64 = encoded.replaceAll("-", "+").replaceAll("_", "/");
    const bin = atob(b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "="));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}

export type ShareLang = "en" | "fa";

export interface SharedDialog {
  s: string; // scenario id
  t?: string; // topic
  l?: ShareLang; // language the show was in
  m: Array<{ a: 0 | 1; x: string }>; // messages: agent index + text
}

export function dialogToShare(
  lang: ShareLang,
  scenarioId: string,
  topic: string,
  messages: Array<{ agentIndex: 0 | 1; text: string }>
): SharedDialog {
  return {
    s: scenarioId,
    t: topic || undefined,
    l: lang,
    m: messages.map((m) => ({ a: m.agentIndex, x: m.text })),
  };
}

export function buildShareLink(dialog: SharedDialog): string {
  const base = `${location.origin}${location.pathname}`;
  return `${base}#d=${encodeState(dialog)}`;
}
