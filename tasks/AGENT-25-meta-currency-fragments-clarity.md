# AGENT-25 — `metaCurrency` vs `metaFragments` clarity (gap §3.1, epic 2)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §3.1 — dual pools, `addMetaFragments` doubles into currency, fragments not shown on meta scene, contract copy shows “f”.

## Objective
**Product decision** encoded in code + UI (choose one):
1. **Unify:** Single spendable currency; migrate fragments into currency once; remove `metaFragments` from rewards or alias 1:1 with deprecation.
2. **Separate:** Two currencies with **two visible balances** on meta + main menu + game over; distinct spend sinks for fragments (e.g. cosmetic-only node tier) OR rename “fragments” to “bonus score chips” if they only affect run score.

## Deliverables
1. Design note in PR description (one paragraph).
2. Update [`metaScene.js`](../app/scenes/metaScene.js), [`mainMenuScene.js`](../app/scenes/mainMenuScene.js), [`saveManager.js`](../app/save/saveManager.js) `addMetaFragments` / `claimCompletedContract` consistency.
3. Migration in `migrateSave` if consolidating fields.

## Acceptance criteria
- [ ] Player can answer “what are fragments?” from UI alone.
- [ ] No accidental double-drip into currency unless intentional and documented.
- [ ] Tests updated for new economy rules.
