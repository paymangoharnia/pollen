/** Live turn engine — one Pollinations API call per agent turn. */
import { PollinationsError, type PollinationsClient } from "@pollen/pollinations-client";
import { strings, type Lang } from "./i18n";
import type { AgentConfig, Scenario } from "./presets";

export interface DialogueMessage {
  agentIndex: 0 | 1;
  text: string;
}

export type PlaySpeed = "slow" | "normal" | "fast";

const SPEED_BASE: Record<PlaySpeed, number> = { slow: 2400, normal: 1500, fast: 700 };

/** Pause between auto-played turns: speed preset + reading time of the last line. */
export function lineGapMs(speed: PlaySpeed, text: string): number {
  return SPEED_BASE[speed] + Math.min(3000, text.length * 12);
}

const MAX_TOKENS = 400;

function systemPrompt(scenario: Scenario, agent: AgentConfig, lang: Lang): string {
  return [
    `You are ${agent.name} — ${agent.persona[lang]}`,
    "",
    "Rules:",
    "- Stay fully in character.",
    "- Reply with ONLY your spoken line: 1-3 short sentences, conversational and natural.",
    "- No stage directions, no asterisk actions, no quotes around your line.",
    "- Never speak for the other person.",
    `- Always write your spoken line in ${lang === "fa" ? "Persian (Farsi)" : "English"}.`,
    scenario.stageRule ? `- ${scenario.stageRule[lang]}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function transcript(history: DialogueMessage[], scenario: Scenario): string {
  return history
    .map((m) => `${scenario.agents[m.agentIndex].name}: ${m.text}`)
    .join("\n");
}

export interface TurnInput {
  client: PollinationsClient;
  scenario: Scenario;
  /** The agent whose turn it is. */
  agent: AgentConfig;
  lang: Lang;
  topic: string;
  history: DialogueMessage[];
  /** Optional one-liner from the human director, consumed this turn. */
  hostNote?: string;
  signal?: AbortSignal;
}

/** Build the user-turn message content. */
function turnPrompt({ scenario, agent, topic, history, hostNote }: TurnInput): string {
  const parts: string[] = [];
  if (topic.trim()) parts.push(`TOPIC / SETTING: ${topic.trim()}`);
  if (history.length > 0) {
    parts.push(`TRANSCRIPT SO FAR:\n${transcript(history, scenario)}`);
  } else {
    parts.push("This is the very first line of the show — open the scene with a strong, in-character line.");
  }
  if (hostNote?.trim()) {
    parts.push(`THE DIRECTOR whispers to you (not shown to the audience): ${hostNote.trim()}`);
  }
  parts.push(`It is now your turn as ${agent.name}. Reply in character.`);
  return parts.join("\n\n");
}

/**
 * Run one agent turn. Throws PollinationsError on API failures.
 * Note: reasoning models need a high max_tokens plus a low reasoning_effort
 * (the API can 400 otherwise) — we default to a non-reasoning nano model.
 */
export async function runTurn(input: TurnInput): Promise<string> {
  const result = await input.client.chat(
    {
      model: input.agent.model,
      messages: [
        { role: "system", content: systemPrompt(input.scenario, input.agent, input.lang) },
        { role: "user", content: turnPrompt(input) },
      ],
      temperature: 0.9,
      max_tokens: MAX_TOKENS,
      reasoning_effort: "low",
      signal: input.signal,
    },
    { attempts: 2 }
  );
  const text = result.content.trim();
  if (!text)
    throw new PollinationsError(500, strings(input.lang).errEmpty);
  return text;
}

/** Human-readable hint for common wallet errors (in the active language). */
export function describeError(lang: Lang, err: unknown): string {
  const s = strings(lang);
  if (err instanceof PollinationsError) {
    switch (err.code) {
      case "KEY_BUDGET_EXHAUSTED":
        return s.errBudget;
      case "INSUFFICIENT_BALANCE":
        return s.errBalance;
      case "content_blocked":
        return s.errContent;
      default:
        return err.message || `API error (HTTP ${err.status}).`;
    }
  }
  if (err instanceof Error && err.name === "AbortError") return "";
  return err instanceof Error ? err.message : "Something went wrong.";
}
