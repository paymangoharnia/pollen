import { useEffect, useRef, useState } from "react";
import { POLLI_CONNECT_SCRIPT_SRC, type PolliConnectAttributes, type PolliConnectElement } from "./widget";

let scriptPromise: Promise<void> | null = null;

/** Load the official connect widget script exactly once per page. */
function loadWidgetScript(src = POLLI_CONNECT_SCRIPT_SRC): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-pollinennect="1"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load polli-connect script")), { once: true });
      if (existing.dataset.loaded === "1") resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.dataset.pollinennect = "1";
    s.addEventListener("load", () => {
      s.dataset.loaded = "1";
      resolve();
    });
    s.addEventListener("error", () => reject(new Error("Failed to load polli-connect script")), { once: true });
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export interface PolliConnectProps extends PolliConnectAttributes {
  /** Called with the scoped `sk_` key after approval, or null after disconnect. */
  onApiKeyChange?: (apiKey: string | null) => void;
  className?: string;
}

/**
 * Thin React wrapper around the official <polli-connect> web component.
 * Render at most ONE instance per page (extra instances show an error in the widget).
 */
export function PolliConnect({ onApiKeyChange, className, ...attrs }: PolliConnectProps) {
  const ref = useRef<PolliConnectElement | null>(null);
  const [failed, setFailed] = useState(false);
  // Keep the latest callback in a ref so polling effects don't re-run on it.
  const changeRef = useRef(onApiKeyChange);
  changeRef.current = onApiKeyChange;

  useEffect(() => {
    let cancelled = false;
    loadWidgetScript().catch(() => {
      if (!cancelled) setFailed(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // The widget restores a previously-connected key from sessionStorage.
  // It may set `apiKey` silently, so probe briefly right after script load.
  useEffect(() => {
    if (failed) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      const key = ref.current?.apiKey;
      if (key) {
        changeRef.current?.(key);
        clearInterval(timer);
      } else if (tries >= 6) {
        clearInterval(timer);
      }
    }, 400);
    return () => clearInterval(timer);
  }, [failed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (event: Event) => {
      const target = event.target as PolliConnectElement & { detail?: { apiKey?: string | null } };
      const key = (target.apiKey ?? target.detail?.apiKey ?? null) as string | null;
      changeRef.current?.(key || null);
    };
    el.addEventListener("change", handler);
    return () => el.removeEventListener("change", handler);
  }, []);

  if (failed) {
    return (
      <span className="text-xs text-amber-400">
        Wallet widget failed to load — demo mode stays available.
      </span>
    );
  }

  return (
    <polli-connect
      ref={ref as never}
      className={className}
      app-key={attrs.appKey}
      budget={attrs.budget !== undefined ? String(attrs.budget) : undefined}
      expiry={attrs.expiry !== undefined ? String(attrs.expiry) : undefined}
      models={attrs.models}
      permissions={attrs.permissions}
      {...(attrs.hideBuyPollen ? { "hide-buy-pollen": "" } : {})}
    />
  );
}
