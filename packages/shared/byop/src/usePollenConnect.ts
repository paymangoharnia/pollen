import { useCallback, useState } from "react";

export type WalletMode = "demo" | "live";

/**
 * App-level wallet state. Pair with a single <PolliConnect> instance:
 * pass `setApiKey` as its `onApiKeyChange` and read `mode` to gate live calls.
 */
export function usePollenConnect(appKey?: string | null) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const mode: WalletMode = appKey && apiKey ? "live" : "demo";
  const clearApiKey = useCallback(() => setApiKey(null), []);
  return {
    apiKey,
    setApiKey,
    clearApiKey,
    mode,
    /** True only when an app key exists AND the user connected a scoped key. */
    isLive: mode === "live",
  };
}
