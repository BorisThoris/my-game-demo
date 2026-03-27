# AGENT-23 — Cloud save merge completeness (gap §2.3)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §2.3 — `initSaveFromCloud` merges only `highScore`, `lastCompletedLevel`, `settings`; risks losing `highScoresByMode`, meta, contracts, achievements, etc.

## Objective
Define a **versioned** full-save merge strategy when `loadFromCloud` returns a JSON object. Prefer **field-wise max / union** rules with explicit conflict policy (e.g. meta currency = max of local vs remote).

## Deliverables
1. **`mergeCloudSave(local, remote)`** — pure function in `saveManager.js` or `save/mergeCloud.js`; unit tests for branches.
2. **Cover** at minimum: `highScoresByMode`, `metaCurrency`, `metaFragments`, `unlockTree`, `unlockedAchievements` / achievement state, `contracts` (careful with daily expiry), `settings` (last-write-wins per key or merge).
3. **Document** merge rules in `docs/CLOUD_SAVE_MERGE.md` (short).

## Acceptance criteria
- [ ] `npm test` includes merge tests; no regression on `migrateSave`.
- [ ] Remote-only fields don’t wipe local on null remote.
- [ ] Invalid remote shape fails safe (keep local, log).

## Dependencies
Works with local adapter returning `null` today; **AGENT-22** when real cloud payload exists.
