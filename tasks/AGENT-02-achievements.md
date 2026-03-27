# AGENT-02 — Achievement sprinkles (Tier A)

## Role
Gameplay / progression engineer.

## Objective
Add **3–5** achievements in `app/config/achievements.js` and wire unlocks in `app/scenes/dodgeGame.js` (and `saveManager` if needed) following **existing patterns** (score milestones, boss clears, no-hit windows, challenge streaks).

## Background
Lean doc: avoid dozens of achievements; reinforce long-tail goals tied to **stats you already compute**.

## Ideas (choose 3–5; align with AGENT-01 contracts if useful)
- Meta currency lifetime earned or first meta purchase.
- Single-run destroy streak or total destroys.
- Clear **N** challenges in one run.
- Survive first boss without shield loss.
- Reach a mode-specific score in Boss Rush / Draft.

## Implementation steps
1. Open `ACHIEVEMENTS`, `SCORE_ACHIEVEMENT_MILESTONES`, and similar arrays.
2. Add achievement IDs + titles + descriptions.
3. Mirror `unlockAchievement("…")` calls next to analogous logic (grep existing `unlockAchievement`).
4. Ensure `achievementsScene` lists them (usually automatic if driven by `ACHIEVEMENTS` object).
5. Add or extend tests in `test/` for save/achievement contracts if present.

## Acceptance criteria
- [ ] 3–5 new IDs exist and unlock under correct conditions.
- [ ] No duplicate unlock spam; idempotent save behavior preserved.
- [ ] Achievements scene shows new rows with correct copy.

## Out of scope
- Perk-tag feats (AGENT-09). Removing achievements system.

## Key files
- `app/config/achievements.js`
- `app/scenes/dodgeGame.js`
- `app/save/saveManager.js`
- `app/scenes/achievementsScene.js`
- `test/saveManager.test.js` / `test/metaProgression.test.js` (if relevant)
