/** Offline demo scripts — the show runs with zero Pollen spent. */

export interface DemoLine {
  agentIndex: 0 | 1;
  text: string;
}

const ENDLESS: DemoLine[] = [
  { agentIndex: 0, text: "…and that brings us to the end of the interview! It's been lovely, Alex. I'll be in touch this week." },
  { agentIndex: 1, text: "Perfect, thank you — oh, sorry, one last question: does the team use the Azure deployment or the one on-prem? Just so I can read up tonight." },
  { agentIndex: 0, text: "Great question! It's hybrid, actually. Wait — do you have experience with hybrid? I should have asked that an hour ago." },
  { agentIndex: 1, text: "I do! Two years, technically three if you count the migration. Should I walk you through it now? I know we're done, it's just — it's a good story." },
  { agentIndex: 0, text: "You know what, let's hear it. Then I really have to run — oh no, my calendar just beeped. That might be my 2pm. Am I your 2pm? I am your 2pm." },
  { agentIndex: 1, text: "You are! But no worries — while you're here, quick one: what does success look like for this role in the first 90 days?" },
  { agentIndex: 0, text: "I'm so glad you asked, it's right here on my other tab. Anyway, so sorry, I've got to hop off — but actually, hold on, you haven't met the team lead yet. She's in the lobby. Could you wait five minutes?" },
  { agentIndex: 1, text: "Of course, take your time! Meanwhile I'll just prepare a few notes — Sandra? Sandra, are we still on mute?" },
  { agentIndex: 0, text: "Sorry! Yes! Still here. Okay, this is genuinely the last thing: benefits. Do you want dental? Everyone forgets to ask about dental." },
  { agentIndex: 1, text: "Honestly, yes — wait, is this an offer? Oh my gosh, sorry, forget I asked. Please, keep going, I've got nowhere else to be." },
];

const DEBATE: DemoLine[] = [
  { agentIndex: 0, text: "Cats are simply better: independent, clean, and they've never once asked me to justify my life choices at 6am." },
  { agentIndex: 1, text: "Independent? A creature that ignores you until the food bowl moves is not a companion, it's a landlord. Dogs show up for you." },
  { agentIndex: 0, text: "Showing up is easy when you have no boundaries. My cat shows up exactly when it matters — like a great manager." },
  { agentIndex: 1, text: "A great manager would also not knock a glass off the table while maintaining eye contact. That's not independence, that's crime." },
  { agentIndex: 0, text: "Crime? That's performance art. Meanwhile your dog barks at the mailman like he owes him money. The mailman does not owe him money." },
  { agentIndex: 1, text: "He might. The dog knows things. Tell you what — cat people read the terms and conditions. Dog people skip to the fun. I rest my case." },
];

const PODCAST: DemoLine[] = [
  { agentIndex: 0, text: "Welcome back to Late Night Static. Tonight's guest says he invented the snooze button. Twice. Otto, welcome!" },
  { agentIndex: 1, text: "Twice, Jules — the 1968 version had a flaw: it only snoozed once per lifetime. People hated it." },
  { agentIndex: 0, text: "I have questions. But first — the alarm clock that argues back. Talk to me." },
  { agentIndex: 1, text: "It wakes you up by debating why your morning plans are unrealistic. Success rate: 41%. Divorce rate: also 41%." },
  { agentIndex: 0, text: "Those numbers rhyme in a way that frightens me. Let's take a caller — no wait, we have no callers. Let's take a nap." },
  { agentIndex: 1, text: "Fittingly, I brought my napping meter. It reads this studio at 'dangerously cozy.' We should be cautious." },
];

export function demoScript(scenarioId: string): DemoLine[] {
  switch (scenarioId) {
    case "debate-night":
      return DEBATE;
    case "late-night":
      return PODCAST;
    default:
      return ENDLESS;
  }
}
