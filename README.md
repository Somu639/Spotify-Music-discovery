# Spotify AI Discovery Lab

This MVP demonstrates how AI-powered music discovery can solve real user pain points that traditional recommendation systems miss. Built as Part 4 of a PM assignment, it connects survey research to product features: **Trending Section** explains why tracks are spiking in context (not just that they're popular), and **Smart Shuffle** detects repetition loops and bridges users into mood-matched playlists without jarring transitions. The goal is to show how Claude enables discovery that *reasons* about listening behavior rather than merely counting it.

**Live demo (full UI):** Deploy to [Vercel](https://vercel.com/new) from this repo — see [Deploy](#deploy) below.

> **Note:** The `streamlit/` folder is a thin shell that embeds the Next.js app in an iframe. Streamlit Cloud cannot run the React frontend natively. For the same UI you see locally, use **Vercel** (recommended) or run `npm run dev` locally.

---

## Deploy

### Vercel (recommended — same frontend as local)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → Import `Somu639/Spotify-Music-discovery`.
3. Framework preset: **Next.js** (auto-detected).
4. Add environment variable: `ANTHROPIC_API_KEY` = your Anthropic key.
5. Deploy. Your app URL will be like `https://spotify-music-discovery.vercel.app`.

Vercel redeploys automatically on every push to `master`.

### Streamlit Community Cloud (iframe wrapper)

Streamlit shows the **same** Next.js UI by embedding your Vercel URL:

1. Deploy to Vercel first (steps above).
2. On [share.streamlit.io](https://share.streamlit.io), create an app:
   - **Main file:** `streamlit/streamlit_app.py`
3. In **Settings → Secrets**, add:
   ```toml
   APP_URL = "https://YOUR-VERCEL-URL.vercel.app"
   ```
4. Reboot the Streamlit app.

For local Streamlit + local Next.js together:
```bash
# Terminal 1
npm run dev

# Terminal 2
cd streamlit
copy .streamlit\secrets.toml.example .streamlit\secrets.toml
streamlit run streamlit_app.py
```

---

## Setup

### Prerequisites

- Node.js 18+
- npm
- [Anthropic API key](https://console.anthropic.com/)
- [Vercel account](https://vercel.com/) (for deployment)

### Local development

```bash
# Clone and install
cd spotify-ai-discovery
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local and set ANTHROPIC_API_KEY=sk-ant-...

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — this is the full Spotify Music Discovery UI.

### Deploy to Vercel (CLI)

```bash
npm run vercel-deploy
```

Or connect GitHub for automatic deploys on push to `master`.

---

## Why Traditional Systems Are Insufficient

- **Collaborative filtering hits a ceiling** — "Users like you also liked" recycles the same catalog and reinforces existing taste loops instead of breaking them.
- **Popularity charts lack context** — Weekly top-track lists don't explain *why* something is trending or whether it fits your current mood or activity.
- **No repetition awareness** — Rule-based systems keep serving tracks you already love without detecting when you're stuck in an unconscious loop.

## What AI Unlocks

- **Contextual trend reasoning** — Claude analyzes tempo, mood, genre, and play patterns to explain why a track is spiking *right now*.
- **Mood-bridged transitions** — AI selects bridge tracks that match energy levels between playlists, avoiding jarring context switches.
- **Proactive loop intervention** — Natural-language detection of repetition patterns with personalized playlist suggestions tied to mood similarity.

## How AI Changes UX

- **Discovery feels intentional** — Users hear recommendations explained like a knowledgeable friend, not a black-box algorithm.
- **Transitions feel designed** — Switching playlists becomes a smooth mix rather than a random hard cut.
- **Trust through transparency** — Every AI suggestion includes a human-readable reason, reducing skip fatigue from opaque picks.

---

## Architecture

| Layer | Purpose |
|---|---|
| `lib/anthropic-server.ts` | Server-only Anthropic API calls (API key never sent to browser) |
| `app/api/claude/*` | Secure API routes: `/trend`, `/shuffle`, `/detect-repetition`, `/playlist-mood` |
| `lib/claude.ts` | Client-safe facade that calls internal API routes |
| `lib/spotify-mock.ts` | Mock library data for MVP demo |
| `lib/survey-insights.ts` | Hardcoded pain points from user research |

## Survey insights

Survey data from Google Forms responses informed the 5 core pain points encoded in `/lib/survey-insights.ts`. These map directly to MVP features in the Insights Banner (research → product connection).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run vercel-deploy` | Deploy to Vercel production |

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude (server-side only) |

See `.env.local.example` for a template.
