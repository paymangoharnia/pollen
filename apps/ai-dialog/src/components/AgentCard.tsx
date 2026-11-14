import { clsx, Card } from "@pollen/ui";
import { FALLBACK_MODELS } from "../presets";
import type { AgentConfig } from "../presets";

export function AgentCard({
  agent,
  accent,
  disabled,
  models,
  onChange,
}: {
  agent: AgentConfig;
  accent: "pollen" | "bloom";
  disabled: boolean;
  models: string[];
  onChange: (patch: Partial<AgentConfig>) => void;
}) {
  const options = models.length > 0 ? models : FALLBACK_MODELS;
  const accentRing = accent === "pollen" ? "border-pollen-400/40" : "border-bloom-500/40";
  const accentText = accent === "pollen" ? "text-pollen-300" : "text-bloom-400";

  return (
    <Card className={clsx("p-4 space-y-3", accentRing)}>
      <div className="flex items-center gap-2">
        <input
          className="w-11 text-center text-xl rounded-lg border px-1 py-1.5"
          value={agent.emoji}
          maxLength={2}
          disabled={disabled}
          onChange={(e) => onChange({ emoji: e.target.value })}
          aria-label="Agent emoji"
        />
        <input
          className="w-full font-semibold px-3 py-1.5 border"
          value={agent.name}
          maxLength={24}
          disabled={disabled}
          onChange={(e) => onChange({ name: e.target.value })}
          aria-label="Agent name"
        />
      </div>
      <textarea
        className="w-full h-24 resize-y px-3 py-2 border text-sm leading-relaxed"
        value={agent.persona}
        maxLength={600}
        disabled={disabled}
        onChange={(e) => onChange({ persona: e.target.value })}
        aria-label="Agent persona"
        placeholder="Describe who this agent is, how it talks, what it wants…"
      />
      <label className="flex items-center gap-2 text-xs text-zinc-400">
        <span className={clsx("font-medium", accentText)}>Model</span>
        <select
          className="flex-1 px-2 py-1.5 border text-xs"
          value={agent.model}
          disabled={disabled || options.length === 1}
          onChange={(e) => onChange({ model: e.target.value })}
        >
          {options.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>
    </Card>
  );
}
