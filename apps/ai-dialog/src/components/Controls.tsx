import { Button } from "@pollen/ui";
import type { ReactNode } from "react";

export type Phase = "idle" | "running" | "paused";

export function Controls({
  phase,
  busy,
  canStep,
  hostNote,
  error,
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
            ⏸ Pause
          </Button>
        ) : (
          <Button onClick={() => onPhase("running")} disabled={busy} size="md">
            ▶ {phase === "paused" ? "Resume" : "Start"}
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={onStep}
          disabled={phase === "running" || busy || !canStep}
          title="Play exactly one turn"
        >
          ⏭ Step
        </Button>
        <Button variant="ghost" onClick={onReset} disabled={busy}>
          ↺ Reset
        </Button>
        <div className="ml-auto flex w-full min-w-[220px] max-w-sm items-center gap-2">
          <input
            className="w-full px-3 py-2 border text-sm"
            placeholder="Whisper to an agent (director's note)…"
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
            title="Send the note — it shapes the next turn"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
