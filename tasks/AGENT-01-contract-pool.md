# AGENT-01 — Contract pool expansion (Tier A)

## Role
Gameplay data / systems engineer.

## Objective
Add **2–4 new entries** to the daily contract system using **metrics already tracked** in a run, or add **minimal** `recordContractEvent` hooks so new metrics work. No new UI panels—copy changes only if contract titles/descriptions need it.

## Background
[`docs/SKYFALL_LEAN_FEATURES.md`](../docs/SKYFALL_LEAN_FEATURES.md) Tier A: “Contract variety (data-only).” Contracts live in `app/game/contractDirector.js` (`CONTRACT_POOL`). Save/daily logic: `app/save/saveManager.js`. Run recording: `app/scenes/dodgeGame.js` (`recordContractEvent`).

## Suggested new contract themes (pick those with existing metrics)
- Destroy/obstacle breaks count (click-to-destroy or hazard clears—grep `recordContractEvent` and destroy handlers).
- Perks taken in a run (count when perk committed).
- Boss waves cleared without damage (if trackable; else skip).
- Challenge successes in one run.
- Score threshold in one run (if distinct from “survive X”).

## Implementation steps
1. Read `CONTRACT_POOL` schema and `generateDailyContracts` / completion checks.
2. Grep `recordContractEvent` and `metric` usage across `dodgeGame.js` and directors.
3. For each new contract, ensure `metric` + target resolution matches an existing accumulator **or** add a small counter + one `recordContractEvent` call.
4. Add contract definitions with `baseTarget` / `growthPerDifficulty` consistent with existing balance.
5. Run `npm test` for any contract tests.

## Acceptance criteria
- [ ] At least **2** new contract types exist in `CONTRACT_POOL`.
- [ ] Each completes and claims rewards in a normal play session when conditions are met.
- [ ] No second currency; rewards stay `currency` / `fragments` as today.
- [ ] No new scenes or modals.

## Out of scope
- New daily modifier (AGENT-08). Removing contracts (AGENT-15).

## Key files
- `app/game/contractDirector.js`
- `app/scenes/dodgeGame.js`
- `app/save/saveManager.js`
- `test/contractDirector.test.js` (extend if present)
