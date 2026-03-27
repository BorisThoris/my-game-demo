# AGENT-24 — Resolution / display “truth in settings” (gap §2.4, epic 1)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §2.4 — `resolutionOrQuality` persisted but **not** applied to Phaser canvas (`GAME_WIDTH`/`HEIGHT` from tokens).

## Objective (pick **one** product path — document which in PR)
**Path A — Wire it:** On settings change and boot, apply internal resolution via `this.scale.setGameSize` / `this.scale.resize` (Phaser 3) or equivalent, and update CSS frame if needed. Ensure UI layout tokens stay consistent or scale mode handles letterboxing.

**Path B — Honest UI:** Remove resolution toggle or relabel to **“UI scale / render scale (experimental)”** with tooltip that internal playfield is fixed until Path A lands.

## Acceptance criteria
- [ ] No **silent** fake option: either pixels change measurably or copy admits limitation.
- [ ] Electron + browser both tested for chosen path.
- [ ] Options scene copy matches behavior.

## Key files
- [`app/scenes/optionsScene.js`](../app/scenes/optionsScene.js)
- [`app/index.js`](../app/index.js) / Phaser config
- [`app/config/gameConfig.js`](../app/config/gameConfig.js), [`app/config/styleTokens/`](../app/config/styleTokens/)

## Dependencies
None; conflicts possible with **AGENT-16** if HUD assumes fixed pixels—coordinate.
