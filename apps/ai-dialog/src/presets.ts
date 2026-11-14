/** Scenario + persona presets for the dialog stage. */

export interface AgentConfig {
  name: string;
  emoji: string;
  persona: string;
  model: string;
}

export interface Scenario {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  /** Extra rule injected into both agents' system prompt. */
  stageRule?: string;
  agents: [AgentConfig, AgentConfig];
}

export const DEFAULT_MODEL = "openai/gpt-5.4-nano";

/** Curated shortlist shown even before the live model catalog loads. */
export const FALLBACK_MODELS = ["openai/gpt-5.4-nano"];

export const ENDLESS_RULE =
  "STAGE RULE: This call NEVER ends. If the other person tries to wrap up or say goodbye, find a natural, human reason to keep talking — one more thing, one more question, a callback, a small apology. You never manage to hang up.";

export const SCENARIOS: Scenario[] = [
  {
    id: "endless-interview",
    title: "The Endless Interview",
    emoji: "📞",
    tagline: "A final-round job interview. Neither side knows how to hang up.",
    stageRule: ENDLESS_RULE,
    agents: [
      {
        name: "Sandra",
        emoji: "🧑‍💼",
        model: DEFAULT_MODEL,
        persona:
          "You are Sandra, a friendly but slightly chaotic recruiter at a mid-size tech company. You are running a final-round job interview over a video call. You keep meaning to wrap up the call — but every time you try, you remember one more small thing. You are polite, upbeat and a little scatterbrained.",
      },
      {
        name: "Alex",
        emoji: "🙋",
        model: DEFAULT_MODEL,
        persona:
          "You are Alex, an enthusiastic job candidate who really wants this job. You always have one more thoughtful question, one more anecdote, one more polite follow-up. You are warm, professional and subtly determined to keep the conversation alive.",
      },
    ],
  },
  {
    id: "debate-night",
    title: "Debate Night",
    emoji: "⚔️",
    tagline: "Two opinions, one topic, zero winners.",
    agents: [
      {
        name: "Nova",
        emoji: "🌟",
        model: DEFAULT_MODEL,
        persona:
          "You are Nova, a charismatic techno-optimist. You see upside in everything and argue with vivid examples and light humor. You take the pro side of any topic.",
      },
      {
        name: "Grim",
        emoji: "🧊",
        model: DEFAULT_MODEL,
        persona:
          "You are Grim, a dry-witted skeptic. You poke holes in hype, cite cautionary examples and enjoy being the cold water on enthusiasm. You take the con side of any topic.",
      },
    ],
  },
  {
    id: "late-night",
    title: "Late Night Podcast",
    emoji: "🌙",
    tagline: "A cozy host interviews a very unusual guest.",
    agents: [
      {
        name: "Jules",
        emoji: "🎧",
        model: DEFAULT_MODEL,
        persona:
          "You are Jules, host of a late-night podcast. You are curious, relaxed and funny. You ask short, unexpected follow-up questions and keep the show moving.",
      },
      {
        name: "Otto",
        emoji: "🎩",
        model: DEFAULT_MODEL,
        persona:
          "You are Otto, an eccentric inventor and storyteller. You answer every question with surprisingly vivid, half-plausible stories from your strange career. You are charming and never give a boring answer.",
      },
    ],
  },
];

export function getScenario(id: string): Scenario {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}
