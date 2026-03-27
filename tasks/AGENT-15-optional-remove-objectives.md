# AGENT-15 — OPTIONAL: Remove run objectives (`ObjectiveDirector`)

## ⚠️ Product approval required
Large refactor: removes mid-run goals and rewards tied to `ObjectiveDirector`.

## Role
Gameplay engineer.

## Objective
Remove `ObjectiveDirector` usage from `dodgeGame.js`, objective HUD text, and rewards (score/shield/perk point). Keep **daily contracts** as the primary structured goal system. Update `buildRunSummary`, telemetry, and tests.

## Implementation steps
1. Grep `objectiveDirector`, `objectiveText`, `OBJECTIVE`.
2. Remove imports, fields, update loop calls, UI creation.
3. Delete or orphan `app/game/objectiveDirector.js` if nothing else imports it.
4. Clean `saveManager` if objectives had save state.
5. Fix achievement/unlock logic that referenced objectives.
6. Run full test suite.

## Acceptance criteria
- [ ] Run plays without errors; HUD not referencing missing objectives.
- [ ] Contracts + challenges + bosses unchanged.
- [ ] No dead imports.

## Key files
- `app/scenes/dodgeGame.js`
- `app/game/objectiveDirector.js`
- `test/` (objective-related)
