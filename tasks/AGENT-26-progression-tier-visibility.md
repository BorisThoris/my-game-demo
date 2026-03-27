# AGENT-26 — `lastCompletedLevel` / contract tier visibility (gap §3.2)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §3.2 — `createDifficultyProfile` uses `lastCompletedLevel`; player never sees “why contracts got harder.”

## Objective
Surface **one** readable signal, e.g.:
- “Progress tier **N**” on main menu next to contracts, **or**
- Tooltip on first contract card: “Difficulty scales with your best run progress,” **or**
- HUD line only if it doesn’t clutter (prefer menu).

## Acceptance criteria
- [ ] New players understand contracts aren’t random punishment.
- [ ] No new simulation—read from `getLastCompletedLevel()` / save only.

## Key files
- [`app/game/contractDirector.js`](../app/game/contractDirector.js) (copy only if needed)
- [`app/scenes/mainMenuScene.js`](../app/scenes/mainMenuScene.js)
