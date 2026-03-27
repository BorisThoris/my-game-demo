# AGENT-32 — Audio load / decode failure UX (gap §5)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §5 — failures not surfaced to player.

## Objective
Wrap critical `this.sound` / `this.load.audio` paths in `dodgeGame` (and menu) with **try/catch** or Phaser load error handlers. On failure: show **non-blocking** toast or one-line game over area message **“Audio unavailable — check device settings”**; game remains playable muted.

## Acceptance criteria
- [ ] Forced failure path tested (mock broken URL in dev).
- [ ] No uncaught exception from audio init.
- [ ] Document behavior in `docs/` only if non-obvious (short).

## Key files
- [`app/scenes/dodgeGame.js`](../app/scenes/dodgeGame.js)
- [`app/scenes/mainMenuScene.js`](../app/scenes/mainMenuScene.js) / loading scene if audio preloaded there
