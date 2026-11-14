import { Button, clsx } from "@pollen/ui";
import type { ReactNode } from "react";
import type { PlaySpeed } from "../agent";
import type { Strings } from "../i18n";

export type Phase = "idle" | "running" | "paused";

const SPEED_ICONS: Record<PlaySpeed, string> = { slow: "🐢", normal: "▶", fast: "⏩" };

export function Controls({
  phase,
  busy,
  canStep,
  hostNote,
  error,
  s,
  speed,
  onSpeed,
  onPhase,
  onStep,
  onReset,
  onHostNote,
}: {
  phase: Phase;
  busy: boolean;
  canStep: boolean;
  hostNote: string;
  error: string | null;
  s: Strings;
  speed: PlaySpeed;
  onSpeed: (speed: PlaySpeed) => void;
  onPhase: (next: Phase) => void;
  onStep: () => void;
  onReset: () => void;
  onHostNote: (note: string) => void;
}): ReactNode {
  return (
    <div className="space-y-3">
      {error ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          {error}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        {phase === "running" ? (
          // Always clickable — pausing mid-turn cancels the in-flight call.
          <Button onClick={() => onPhase("paused")} variant="secondary" size="md">
            ⏸ {s.pause}
          </Button>
        ) : (
          <Button onClick={() => onPhase("running")} disabled={busy} size="md">
            ▶ {phase === "paused" ? s.resume : s.start}
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={onStep}
          disabled={phase === "running" || busy || !canStep}
          title="Play exactly one turn"
        >
          ⏭ {s.step}
        </Button>
        <Button variant="ghost" onClick={onReset} disabled={busy}>
          ↺ {s.reset}
        </Button>

        {/* Reading speed */}
        <div className="flex items-center gap-1.5" role="group" aria-label={s.speedLabel}>
          <span className="text-xs text-zinc-500">{s.speedLabel}</span>
          {(Object.keys(SPEED_ICONS) as PlaySpeed[]).map((sp) => (
            <button
              key={sp}
              onClick={() => onSpeed(sp)}
              title={sp}
              aria-label={`${s.speedLabel}: ${sp}`}
              aria-pressed={speed === sp}
              className={clsx(
                "cursor-pointer rounded-lg border px-2 py-1 text-xs transition-colors",
                speed === sp
                  ? "border-pollen-400/60 bg-pollen-400/15 text-pollen-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              )}
            >
              {SPEED_ICONS[sp]}
            </button>
          ))}
        </div>

        <div className="ms-auto flex w-full min-w-[220px] max-w-sm items-center gap-2">
          <input
            className="w-full px-3 py-2 border text-sm"
            placeholder={s.hostPh}
            value={hostNote}
            maxLength={200}
            onChange={(e) => onHostNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && hostNote.trim()) onHostNote(hostNote);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            disabled={!hostNote.trim() || busy}
            onClick={() => onHostNote(hostNote)}
            title={s.send}
          >
            {s.send}
          </Button>
        </div>
      </div>
    </div>
  );
}
