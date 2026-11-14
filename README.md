# pollen 🌸

A collection of small, playful AI apps built on [Pollinations](https://pollinations.ai) models — text, image, audio and video from many labs through one API. Users bring their own Pollen wallet and pay for what they use.

## Apps

| # | App | Status |
|---|---|---|
| 1 | **AI Dialog Arena** — stage where AI agents talk to each other | 🚧 building |
| 2 | **Ask Them All** — one question, every model, live scoreboard | ⏳ |
| 3 | **Machine Mind** — a model plays the role of a machine | ⏳ |
| 4 | **LLM Voice** — can you spot what an LLM wrote? | ⏳ |
| 5 | **Science Explorer** — turn any science topic into something explorable | ⏳ |
| 6 | **Agents Alone** — agents left alone in a world | ⏳ |
| 7 | **Models Play** — games that AI models play | ⏳ |
| 8 | **MCP Game** — a game agents join over MCP | ⏳ |

Every app ships with an offline demo mode, and goes live with [Pollinations Pay](https://gen.pollinations.ai/docs) (bring your own Pollen).

## Stack

- `Vite` + `React` + `Tailwind`
- `packages/shared/` — BYOP wallet connect, unified Pollinations API client, shared UI theme

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Each app deploys to GitHub Pages from `main`.
