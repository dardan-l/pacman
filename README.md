# Pac-Man

Single-file browser Pac-Man built in plain HTML, CSS, and JavaScript.

## Features

- Arcade-style Pac-Man gameplay with ghost personalities
- Touch swipe and on-screen D-pad controls for iPhone play
- High score saved in browser local storage
- Multi-level progression with fruit bonuses

## Run Locally

Because this is a static site, any simple file server works.

### Option 1: Python

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

### Option 2: Vercel Dev

```bash
vercel dev
```

## Controls

- Desktop: arrow keys or `WASD`
- Mobile: swipe on the game board or use the on-screen D-pad

## Deploy

This project is linked to Vercel and can be deployed directly from the repo root:

```bash
vercel --prod
```

## Files

- `index.html`: entire game
- `.gitignore`: ignores local Vercel project metadata
