import { useEffect, useRef, useState } from "react";
import { Card, Spinner, clsx } from "@pollen/ui";
import { dirFor, type Strings } from "../i18n";
import type { DialogueMessage } from "../agent";
import type { AgentConfig, Lang } from "../presets";

const accents = [
  { ring: "border-pollen-400/50", bg: "bg-pollen-400/10", name: "text-pollen-300" },
  { ring: "border-bloom-500/50", bg: "bg-bloom-500/10", name: "text-bloom-400" },
];

const NEAR_BOTTOM_PX = 48;

export function Script({
  history,
  agents,
  busy,
  typingLabel,
  lang,
  s,
}: {
  history: DialogueMessage[];
  agents: [AgentConfig, AgentConfig];
  busy: boolean;
  typingLabel: string;
  lang: Lang;
  s: Strings;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Mirror so the auto-scroll effect never re-runs on stick changes.
  const stickRef = useRef(true);
  const [stick, setStick] = useState(true);

  // Auto-follow: only the inner container scrolls — never the page itself,
  // so the control bar stays where the user left it.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [history.length, busy]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
    stickRef.current = nearBottom;
    setStick(nearBottom);
  };

  // Wheeling upward over the transcript always pauses auto-follow immediately
  // (covers trackpads where scroll events lag), matching manual reading.
  const onWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0 && stickRef.current) {
      stickRef.current = false;
      setStick(false);
    }
  };

  const follow = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickRef.current = true;
    setStick(true);
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  if (history.length === 0 && !busy) {
    return (
      <Card className="flex min-h-[280px] items-center justify-center px-6 py-12 text-center">
        <p className="text-sm text-zinc-500 leading-relaxed">{s.stageEmpty}</p>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        onWheel={onWheel}
        className="max-h-[420px] space-y-3 overflow-y-auto p-4"
      >
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
                <p
                  dir={dirFor(lang)}
                  className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100"
                >
                  {m.text}
                </p>
              </div>
            </div>
          );
        })}
        {busy ? (
          <div className="flex items-center gap-2 pl-1 text-xs text-zinc-400">
            <Spinner className="h-3.5 w-3.5" />
            <span>{s.thinking(typingLabel)}</span>
          </div>
        ) : null}
      </div>
      {!stick ? (
        <button
          onClick={follow}
          title={s.follow}
          aria-label={s.follow}
          className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 cursor-pointer rounded-full border border-zinc-600 bg-zinc-900/95 px-3 py-1.5 text-sm text-zinc-200 shadow-lg transition-colors hover:border-pollen-400/60 hover:text-pollen-300"
        >
          ⬇
        </button>
      ) : null}
    </Card>
  );
}
