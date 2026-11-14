import { useEffect, useRef } from "react";
import { Card, Spinner, clsx } from "@pollen/ui";
import type { DialogueMessage } from "../agent";
import type { AgentConfig } from "../presets";

const accents = [
  { ring: "border-pollen-400/50", bg: "bg-pollen-400/10", name: "text-pollen-300" },
  { ring: "border-bloom-500/50", bg: "bg-bloom-500/10", name: "text-bloom-400" },
];

export function Script({
  history,
  agents,
  busy,
  typingLabel,
}: {
  history: DialogueMessage[];
  agents: [AgentConfig, AgentConfig];
  busy: boolean;
  typingLabel: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history.length, busy]);

  if (history.length === 0 && !busy) {
    return (
      <Card className="flex min-h-[280px] items-center justify-center px-6 py-12 text-center">
        <p className="text-sm text-zinc-500 leading-relaxed">
          The stage is empty. Pick a scenario, tweak the agents, then hit{" "}
          <span className="text-pollen-300 font-semibold">Start</span>.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="max-h-[420px] space-y-3 overflow-y-auto p-4">
        {history.map((m, i) => {
          const agent = agents[m.agentIndex];
          const accent = accents[m.agentIndex];
          return (
            <div
              key={i}
              className={clsx("flex", m.agentIndex === 1 && "md:flex-row-reverse")}
            >
              <div
                className={clsx(
                  "max-w-[92%] md:max-w-[80%] rounded-2xl border px-3.5 py-2.5",
                  accent.ring,
                  accent.bg
                )}
              >
                <div className={clsx("mb-1 text-xs font-bold", accent.name)}>
                  {agent.emoji} {agent.name}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100">{m.text}</p>
              </div>
            </div>
          );
        })}
        {busy ? (
          <div className="flex items-center gap-2 pl-1 text-xs text-zinc-400">
            <Spinner className="h-3.5 w-3.5" />
            <span>{typingLabel} is thinking…</span>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>
    </Card>
  );
}
