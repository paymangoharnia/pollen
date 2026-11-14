import { useState } from "react";
import { Button } from "@pollen/ui";
import { buildShareLink, dialogToShare, encodeState } from "../share";
import type { DialogueMessage } from "../agent";
import type { AgentConfig } from "../presets";

export function ShareBar({
  history,
  scenarioId,
  topic,
  agents,
}: {
  history: DialogueMessage[];
  scenarioId: string;
  topic: string;
  agents: [AgentConfig, AgentConfig];
}) {
  const [copied, setCopied] = useState<"link" | "text" | null>(null);

  if (history.length === 0) return null;

  const asText = history
    .map((m) => `${agents[m.agentIndex].name}: ${m.text}`)
    .join("\n\n");

  async function copy(value: string, kind: "link" | "text") {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // clipboard API can be missing on http — fall back to a textarea trick
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(kind);
    setTimeout(() => setCopied(null), 1600);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          const dialog = dialogToShare(scenarioId, topic, history);
          // Keep the address bar in sync so the link can be copied from the URL too.
          window.history.replaceState(null, "", `#d=${encodeState(dialog)}`);
          void copy(buildShareLink(dialog), "link");
        }}
      >
        {copied === "link" ? "✓ Link copied" : "🔗 Copy share link"}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => copy(asText, "text")}>
        {copied === "text" ? "✓ Transcript copied" : "📄 Copy transcript"}
      </Button>
    </div>
  );
}
