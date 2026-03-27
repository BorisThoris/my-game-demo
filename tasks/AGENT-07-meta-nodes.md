# AGENT-07 — Meta unlock tree expansion (Tier B)

## Role
Balance / progression engineer.

## Objective
Add **2–3** nodes to `META_UNLOCK_NODES` in `app/game/metaProgression.js` with **linear prereqs** only. Total nodes should stay **≤ ~8** after this task (per lean doc cap). Update `metaScene` labels/costs if hardcoded.

## Design rules
- Each node: `id`, `label`, `description`, `cost`, `prereqs`, `effect` matching existing effect application sites in `dodgeGame` or save hydration.
- Effects must be **readable** (e.g. small % move speed, shield, score mult)—no new effect types unless trivial to wire.

## Implementation steps
1. Trace where `effect` fields apply on run start (`dodgeGame` reset / modifier merge).
2. Add nodes; ensure `purchaseUnlock` and UI list them.
3. Tune costs vs `calculateMetaCurrencyReward` pacing.
4. Extend tests in `test/metaProgression.test.js` if present.

## Acceptance criteria
- [ ] 2–3 new nodes purchasable with correct prereqs.
- [ ] Effects visibly change one run stat the player can notice.
- [ ] Tree remains understandable (no branching maze).

## Out of scope
- Second meta currency. Prestige resets.

## Key files
- `app/game/metaProgression.js`
- `app/scenes/metaScene.js`
- `app/scenes/dodgeGame.js`
- `app/save/saveManager.js`
