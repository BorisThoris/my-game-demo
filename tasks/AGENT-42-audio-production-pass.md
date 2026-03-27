# AGENT-42 — Audio production pass (fully fledged §D)

## Source
[`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md) axis **D — Sensory (audio)**.

## Objective
Move audio from **functional** to **intentional**:

1. **Music** — menu loop + in-run loop (or dynamic layers); levels balanced vs `musicVolume`; **loop seams** acceptable.
2. **SFX** — boss spawn, challenge tick, perk pick, damage, game over: **distinct** and not fatiguing; respect `sfxVolume`.
3. **Mix** — duck music slightly on game over / pause if product agrees (optional).
4. **Licensing** — list sources in **AGENT-34** credits; prefer assets with clear license.

## Acceptance criteria
- [ ] No **unmuted** ear-piercing default; spot-check at 100% SFX.
- [ ] **AGENT-32** failure path still works (muted degrade).

## Key files
- `dodgeGame.js`, `mainMenuScene.js`, `loadingScene.js`, audio config modules

## Dependencies
After **AGENT-32** if concurrent.
