# AGENT-03 — “Next unlock” hint (Tier A)

## Role
UI / meta progression engineer.

## Objective
Show **one clear line** of copy telling the player how much meta currency they need for the **cheapest or next logical** unlock from `META_UNLOCK_NODES` in `app/game/metaProgression.js`—on **`metaScene`** and optionally **game over** summary.

## Background
Idle-game clarity: “+12 meta to unlock *Quick Steps*.” Use `getMetaState`, node `cost`, `prereqs`, and `unlockedNodes` to compute the next purchasable node (or next by prereq chain).

## Implementation steps
1. Read `metaScene.js` layout; add a text line below currency or tree.
2. Implement a small pure helper (e.g. `getNextUnlockHint(state)`) in `metaProgression.js` or a tiny `metaUiHelpers.js` to avoid scene bloat.
3. If game over should show it, extend `showGameOver` / summary in `dodgeGame.js` **after** AGENT-04 if both touch same text block—coordinate layout.
4. Handle edge cases: all unlocked → “All unlocks owned” or hide line.

## Acceptance criteria
- [ ] Meta scene always shows accurate hint when unlocks remain.
- [ ] No new currency or nodes required (display only unless combined with AGENT-07).
- [ ] Copy is one short sentence; no tooltip wall.

## Dependencies
Prefer merging **after** AGENT-04 if both edit game-over layout heavily; otherwise parallel with careful merge.

## Key files
- `app/scenes/metaScene.js`
- `app/game/metaProgression.js`
- `app/scenes/dodgeGame.js` (optional line)
