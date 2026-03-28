# Pac-Man

Single-file browser Pac-Man built in plain HTML, CSS, and JavaScript.

## Features

- Arcade-style Pac-Man gameplay with ghost personalities
- Touch swipe and on-screen D-pad controls for iPhone play
- High score saved in browser local storage
- Shared online Supabase leaderboard with name submission on game over
- Multi-level progression with fruit bonuses
- Pause support with `P`
- Fullscreen toggle with `F`
- Deterministic debug hooks: `window.render_game_to_text()` and `window.advanceTime(ms)`

## Run Locally

Because this is a static site, any simple file server works.

To use the shared leaderboard locally, also provide Supabase env vars for the Vercel API function:

```bash
cp .env.example .env.local
```

### Option 1: Python

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

### Option 2: Vercel Dev

```bash
vercel dev
```

Use `vercel dev` when you want the leaderboard API available locally.

## Controls

- Desktop: arrow keys or `WASD`
- Pause/resume: `P`
- Fullscreen: `F`
- Exit fullscreen: `Esc`
- Mobile: swipe on the game board or use the on-screen D-pad

## Debug Hooks

The game exposes two browser-console hooks to make automated validation and debugging easier:

```js
window.render_game_to_text()
window.advanceTime(1000)
```

`render_game_to_text()` returns the current game state as JSON. `advanceTime(ms)` steps the game deterministically at a 60 FPS equivalent and returns the updated JSON state.

## Deploy

This project is linked to Vercel and can be deployed directly from the repo root:

```bash
vercel --prod
```

After deployment, add the production URL here so the README meets the "real user can access it" bar.

## Supabase Setup

1. Create a Supabase project.
2. In the Supabase SQL editor, run `supabase/schema.sql`.
3. In Vercel project settings, add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. For local development, put the same values in `.env.local`.

This project writes to Supabase only through the server-side Vercel function in `api/leaderboard.js`, so the service role key is never exposed to the browser.

## Files

- `index.html`: entire game
- `.gitignore`: ignores local Vercel project metadata
