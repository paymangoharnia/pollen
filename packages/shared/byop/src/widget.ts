/** Official drop-in widget: https://cdn.jsdelivr.net/npm/@pollinations/ui */
export const POLLI_CONNECT_SCRIPT_SRC =
  "https://cdn.jsdelivr.net/npm/@pollinations/ui@0.1.0-alpha.20/dist/connect.js";

export interface PolliConnectElement extends HTMLElement {
  /** User's scoped `sk_...` key after approval, null after disconnect. */
  apiKey: string | null;
}

/** Attributes accepted by the <polli-connect> custom element. */
export interface PolliConnectAttributes {
  /** Publishable app key (`pk_...`) — required. */
  appKey: string;
  /** Max Pollen the user can spend through this app (default 5). */
  budget?: number;
  /** Key expiry in days (default 7). */
  expiry?: number;
  /** Comma-separated model ids or categories to restrict spending to. */
  models?: string;
  /** Extra scopes, e.g. "profile usage". */
  permissions?: string;
  hideBuyPollen?: boolean;
}
