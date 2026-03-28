# Pac-Man

This project is the single-file browser game in `/Users/dardan/Documents/dev/pacman`.

## Goal

- Preserve the feel of an arcade game while keeping the implementation understandable.
- Prioritize gameplay correctness and mobile usability over ornamental refactors.

## Stack

- Plain HTML
- Plain CSS
- Plain JavaScript
- Main implementation in `index.html`

## Commands

- Local static server: `python3 -m http.server 8000`
- Alternate local server: `vercel dev`

## Validation Workflow

- Use the `develop-web-game` skill for meaningful feature or gameplay changes.
- Use browser automation to validate movement, collisions, scoring, ghost behavior, pause/fullscreen flows, and mobile controls.
- Prefer deterministic debugging with:
  - `window.render_game_to_text()`
  - `window.advanceTime(ms)`
- Check console errors before treating a gameplay change as complete.

## Working Norms

- Keep the game playable on desktop and mobile.
- Avoid introducing unnecessary architecture into a deliberately compact single-file project.
- If a refactor makes the game harder to inspect or debug, it is probably the wrong refactor.
- Keep controls and feedback crisp; laggy or ambiguous input is a product bug.

## Done Means

- The game runs locally without errors.
- The changed behavior is verified in-browser, not just inspected in code.
- Obvious regressions in controls, score progression, or ghost behavior are checked.
- README instructions still match how the project is actually run.
