import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell, Badge, Card, clsx } from "@pollen/ui";
import { PollinationsClient } from "@pollen/pollinations-client";
import { PolliConnect, usePollenConnect } from "@pollen/byop";
import { AgentCard } from "./components/AgentCard";
import { Script } from "./components/Script";
import { Controls, type Phase } from "./components/Controls";
import { ShareBar } from "./components/ShareBar";
import { describeError, runTurn, type DialogueMessage } from "./agent";
import { demoScript } from "./demo";
import { SCENARIOS, getScenario, type AgentConfig, type Scenario } from "./presets";
import { decodeState, type SharedDialog } from "./share";

const APP_KEY = import.meta.env.VITE_POLLI_APP_KEY as string | undefined;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface AgentModels {
  models: string[];
}

function loadShared(): { dialog: SharedDialog } | null {
  const hash = location.hash;
  if (!hash.startsWith("#d=")) return null;
  const dialog = decodeState<SharedDialog>(hash.slice(3));
  return dialog?.m?.length ? { dialog } : null;
}

export default function App() {
  const shared = useRef(loadShared());

  const [scenarioId, setScenarioId] = useState(
    () => shared.current?.dialog.s ?? SCENARIOS[0].id
  );
  const scenario: Scenario = getScenario(scenarioId);

  const [agents, setAgents] = useState<[AgentConfig, AgentConfig]>(() => {
    const s = getScenario(shared.current?.dialog.s ?? SCENARIOS[0].id);
    return [{ ...s.agents[0] }, { ...s.agents[1] }];
  });
  const [topic, setTopic] = useState(() => shared.current?.dialog.t ?? "");
  const [history, setHistory] = useState<DialogueMessage[]>(() =>
    shared.current
      ? shared.current.dialog.m.map((m) => ({ agentIndex: m.a, text: m.x }))
      : []
  );
  const [phase, setPhase] = useState<Phase>(shared.current ? "paused" : "idle");
  const [autoPlay, setAutoPlay] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hostNote, setHostNote] = useState("");
  const [demoIndex, setDemoIndex] = useState(0);
  const [modelOptions, setModelOptions] = useState<AgentModels>({ models: [] });

  const wallet = usePollenConnect(APP_KEY);
  const clientRef = useRef(new PollinationsClient());
  const hostNoteRef = useRef("");
  const abortRef = useRef<AbortController | null>(null);
  const autoPlayRef = useRef(autoPlay);
  autoPlayRef.current = autoPlay;

  useEffect(() => {
    clientRef.current.setApiKey(wallet.apiKey);
  }, [wallet.apiKey]);

  // Fetch the live text model catalog once the wallet is connected.
  useEffect(() => {
    if (!wallet.isLive) return;
    let cancelled = false;
    clientRef.current
      .listModels("text", { attempts: 2 })
      .then((models) => {
        if (cancelled) return;
        const ids = models
          .map((m) => (typeof m.id === "string" ? m.id : null))
          .filter((id): id is string => Boolean(id));
        if (ids.length > 0) setModelOptions({ models: ids });
      })
      .catch(() => {
        // fall back to the shortlist silently
      });
    return () => {
      cancelled = true;
    };
  }, [wallet.isLive]);

  const patchAgent = (index: 0 | 1, patch: Partial<AgentConfig>) => {
    setAgents((prev) => {
      const next = [...prev] as [AgentConfig, AgentConfig];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setHistory([]);
    setDemoIndex(0);
    setError(null);
    setHostNote("");
    hostNoteRef.current = "";
    setPhase("idle");
    location.hash = "";
  }, []);

  const pickScenario = (id: string) => {
    setScenarioId(id);
    const s = getScenario(id);
    setAgents([{ ...s.agents[0] }, { ...s.agents[1] }]);
    reset();
  };

  const appendLine = (agentIndex: 0 | 1, text: string) => {
    setHistory((h) => [...h, { agentIndex, text }]);
  };

  // Turn engine — one turn per effect run while running & not busy.
  // NOTE: `busy` is intentionally NOT a dependency: setting it inside this
  // effect re-runs cleanup which would cancel the in-flight turn (deadlock).
  useEffect(() => {
    if (phase !== "running" || busy) return;
    let cancelled = false;
    const nextIndex = (history.length % 2) as 0 | 1;
    const agent = agents[nextIndex];
    setBusy(true);
    (async () => {
      try {
        if (wallet.isLive) {
          const note = hostNoteRef.current;
          hostNoteRef.current = "";
          const ac = new AbortController();
          abortRef.current = ac;
          const text = await runTurn({
            client: clientRef.current,
            scenario,
            agent,
            topic,
            history,
            hostNote: note || undefined,
            signal: ac.signal,
          });
          if (cancelled) return;
          appendLine(nextIndex, text);
        } else {
          await sleep(1000);
          if (cancelled) return;
          const script = demoScript(scenario.id);
          const loops = scenario.id === "endless-interview";
          if (!loops && demoIndex >= script.length) {
            setPhase("idle");
            return;
          }
          const line = script[demoIndex % script.length];
          setDemoIndex((i) => i + 1);
          appendLine(line.agentIndex, line.text);
        }
        setError(null);
        if (!autoPlayRef.current) {
          setPhase("paused");
          return;
        }
        // Next turn re-runs this effect from the dependency change.
      } catch (err) {
        if (cancelled) return;
        const msg = describeError(err);
        if (msg) setError(msg);
        setPhase("paused");
      } finally {
        // Always clear busy — even when the effect was superseded (pause/reset),
        // otherwise the UI locks up on a stuck busy flag.
        setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, history.length, wallet.isLive]);

  const sendHostNote = (note: string) => {
    const trimmed = note.trim();
    if (!trimmed || busy) return;
    hostNoteRef.current = trimmed;
    setHostNote("");
    if (phase !== "running") setPhase("running");
  };

  const nextIndex = (history.length % 2) as 0 | 1;
  const typingLabel = agents[nextIndex].name;

  const walletWidget = (
    <>
      <Badge tone={wallet.isLive ? "success" : "pollen"}>
        {wallet.isLive ? "● live" : "◐ demo"}
      </Badge>
      {APP_KEY ? (
        <PolliConnect
          appKey={APP_KEY}
          budget={5}
          expiry={7}
          onApiKeyChange={(k) => {
            wallet.setApiKey(k);
            if (!k) reset();
          }}
        />
      ) : null}
    </>
  );

  return (
    <AppShell
      title="AI Dialog"
      logo={<span className="text-xl">🎙️</span>}
      actions={walletWidget}
      footer={
        <>
          Demo mode runs offline and free · Live mode uses your own Pollen ·{" "}
          <a
            href="https://gen.pollinations.ai/docs"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 underline decoration-dotted"
          >
            powered by Pollinations
          </a>
        </>
      }
    >
      <div className="space-y-5">
        {!APP_KEY ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-xs leading-relaxed text-zinc-400">
            You're in <span className="font-semibold text-pollen-300">offline demo mode</span> — the
            show runs on a canned script, no Pollen spent. To go live, this deployment needs its
            Pollinations app key configured.
          </div>
        ) : null}

        {/* Scenario picker */}
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => pickScenario(s.id)}
              disabled={phase === "running" || busy}
              className={clsx(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40",
                scenarioId === s.id
                  ? "border-pollen-400/60 bg-pollen-400/15 text-pollen-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
              )}
            >
              {s.emoji} {s.title}
            </button>
          ))}
        </div>
        <p className="-mt-2 text-xs text-zinc-500">{scenario.tagline}</p>

        {/* Topic + agents */}
        <Card className="p-4">
          <label className="block text-xs font-semibold text-zinc-300">Topic / setting</label>
          <input
            className="mt-2 w-full px-3 py-2 border text-sm"
            placeholder={
              scenario.id === "debate-night"
                ? "e.g. Cats vs dogs"
                : scenario.id === "late-night"
                  ? "e.g. The invention of the snooze button"
                  : "e.g. Interview for a Chief Vibe Officer role"
            }
            value={topic}
            maxLength={120}
            disabled={phase === "running" || busy}
            onChange={(e) => setTopic(e.target.value)}
          />
        </Card>

        <div className="grid gap-3 md:grid-cols-2">
          <AgentCard
            agent={agents[0]}
            accent="pollen"
            disabled={phase === "running" || busy}
            models={modelOptions.models}
            onChange={(patch) => patchAgent(0, patch)}
          />
          <AgentCard
            agent={agents[1]}
            accent="bloom"
            disabled={phase === "running" || busy}
            models={modelOptions.models}
            onChange={(patch) => patchAgent(1, patch)}
          />
        </div>

        {/* Stage */}
        <Script
          history={history}
          agents={agents}
          busy={busy}
          typingLabel={typingLabel}
        />

        <Controls
          phase={phase}
          busy={busy}
          canStep={true}
          hostNote={hostNote}
          error={error}
          onPhase={(next) => {
            setError(null);
            if (next !== "running") abortRef.current?.abort();
            if (next === "running") setAutoPlay(true);
            setPhase(next);
          }}
          onStep={() => {
            setError(null);
            setAutoPlay(false);
            setPhase("running");
          }}
          onReset={reset}
          onHostNote={sendHostNote}
        />

        <ShareBar history={history} scenarioId={scenarioId} topic={topic} agents={agents} />
      </div>
    </AppShell>
  );
}
