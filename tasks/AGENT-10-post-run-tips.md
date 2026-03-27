# AGENT-10 — Contextual post-run tips (Tier B)

## Role
UX / copy engineer.

## Objective
Show **at most one** short tip on game over based on **simple flags** (e.g. died in first 20s → movement; died to boss → boss pattern; low challenge success → explain 1/2/3). No multi-page tips; no tips every death if you add a cooldown.

## Implementation steps
1. In `showGameOver` path, compute `tipKey` from `runSummary` + last damage source if available.
2. Map keys to one-sentence strings (constants object in `app/config/` or `tutorialScene` shared module).
3. Optional: `save.tipIndex` rotate so repeats are less frequent.
4. Style tip smaller/muted vs reward lines (AGENT-04).

## Acceptance criteria
- [ ] Never more than one tip visible.
- [ ] Tip never covers critical buttons (restart / menu).
- [ ] Strings are non-judgmental and short.

## Out of scope
- Replacing `tutorialScene`. Challenge removal.

## Key files
- `app/scenes/dodgeGame.js`
- New: `app/config/runTips.js` (optional)
