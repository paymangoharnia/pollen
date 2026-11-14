# AI Dialog 🎙️

Put two AI agents on a stage and watch them talk — live, one Pollinations model call per turn.

Three presets ship out of the box:

- **The Endless Interview** — a job interview neither side knows how to hang up on
- **Debate Night** — a techno-optimist vs a dry-witted skeptic on your topic
- **Late Night Podcast** — a cozy host interviews a very unusual guest

## Features

- **Bilingual (EN / فارسی)** — one toggle flips everything: UI text, RTL layout, the demo script, and the language the live agents speak in
- **Editable agents** — rename them, rewrite their personas (per language), pick their models
- **Director's notes** — whisper instructions to an agent between turns
- **Auto-play or step-by-step** — let the show run, or advance one turn at a time
- **Readable pacing** — reading-speed presets (🐢 / ▶ / ⏩) with per-line reading gaps
- **Controllable transcript** — scrolling up pauses auto-follow; a ⬇ button re-pins to the newest line
- **Sticky controls** — Pause is always reachable, even mid-show on a phone
- **Share** — every dialog (with its language) is encoded in the URL; send the link or copy the transcript
- **Demo mode** — the whole show runs offline on a canned script, zero cost, no key needed
- **Live mode** — connect your Pollinations wallet with `<polli-connect>`; spending is scoped (budget: 5 Pollen, 7-day expiry)

## Run locally

```bash
npm install
npm run dev -w ai-dialog
```

## Go live

1. Create a Pollinations app key (`pk_...`) at [enter.pollinations.ai](https://enter.pollinations.ai) → Keys → App.
2. Put it in `apps/ai-dialog/.env.local`:
   ```
   VITE_POLLI_APP_KEY=pk_...
   ```
3. Restart the dev server — the wallet widget appears in the header.

Without an app key the app stays in offline demo mode.

## Deploy

```bash
npm run deploy
```

Builds the app and publishes it to GitHub Pages (see the repo's deploy script).
