# AGENT-08 — Rotating daily modifier (Tier B)

## Role
Systems engineer.

## Objective
Apply **one** rule per calendar day (seed from `getContractDateKey` or equivalent) from a **small enum** (3–5 variants). Surface it on **main menu** or run start so players notice. **Do not** ship AGENT-06 risk pickup in the same release if both heavily alter difficulty—product call; document chosen combo.

## Example modifiers
- +10% player move speed for the day.
- +1 starting shield (cap-aware).
- Double contract progress rate.
- Slightly slower heat ramp.

## Implementation steps
1. Add `getDailyModifier(dateKey)` in a small module (e.g. `app/game/dailyModifier.js`).
2. Apply modifier when `dodgeGame` starts / resets; store on scene for consistent run.
3. Add one line to `mainMenuScene.js` or loading tip: “Today’s modifier: …”
4. Ensure modifier does not break boss/challenge math; test edge midnight rollover.

## Acceptance criteria
- [ ] Same day ⇒ same modifier after reload.
- [ ] Modifier text is one short phrase.
- [ ] No new save keys required unless you need “seen today” analytics (prefer not).

## Out of scope
- Live ops calendar JSON. Per-run random modifiers.

## Key files
- `app/game/contractDirector.js` (`getContractDateKey` pattern)
- `app/scenes/dodgeGame.js`
- `app/scenes/mainMenuScene.js`
