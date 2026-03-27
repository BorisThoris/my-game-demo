# AGENT-14 — OPTIONAL: Remove one game mode

## ⚠️ Product approval required
Do **not** start without explicit sign-off. Lean doc suggests **Draft** as lowest-impact candidate if it overlaps other perk cadence.

## Role
Gameplay engineer.

## Objective
Remove **one** of `Classic` / `Boss Rush` / `Draft` from `app/game/modeConfig.js` and all menu references in `mainMenuScene.js`. Migrate saves that reference removed mode to `Classic`. Update tests and copy.

## Implementation steps
1. Delete mode from `GAME_MODES` and `MODE_CONFIGS`.
2. `normalizeGameMode` maps unknown → `Classic`.
3. Remove menu rows and any mode-specific tests.
4. Grep mode string literals across `app/` and `test/`.

## Acceptance criteria
- [ ] Only approved mode is removed; remaining modes work.
- [ ] Old save loads without crash.
- [ ] E2E updated if it selected removed mode.

## Key files
- `app/game/modeConfig.js`
- `app/scenes/mainMenuScene.js`
- `test/gameModes.smoke.test.js` (if present)
