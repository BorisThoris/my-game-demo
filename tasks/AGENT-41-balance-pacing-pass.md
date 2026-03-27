# AGENT-41 — Balance & pacing pass (fully fledged §A, §C)

## Source
[`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md) axes **A (loop depth)** and **C (balance)**.

## Objective
One **directed** pass over **pacing knobs** so runs feel fair for **casual → skilled** players:

- `RunnerSpawnDirector` / phase heat: time-to-first-boss, density ramps
- `modeConfig.js`: Boss Rush vs Draft vs Classic **relative pressure**
- Perk **power spikes** vs danger (avoid trivial invincibility windows unless intended)
- Contract **targets** vs typical run length (`contractDirector` + **AGENT-40** matrix)
- Optional: **Easy / Normal / Hard** as **multipliers** on spawn rate, damage, or heat (new setting + `migrateSave`)

## Deliverables
1. **Tuning doc** `docs/BALANCE_NOTES.md` — before/after intent, not just numbers.
2. **Code changes** where needed (constants centralized; avoid magic numbers scattered).
3. **Playtest log** — 5 runs noted (duration, death cause, “felt fair?”).

## Acceptance criteria
- [ ] No mode is **accidentally** 2× harder with no UI explanation.
- [ ] **AGENT-26** tier visibility still makes sense after changes.

## Dependencies
Coordinate **AGENT-40** if content adds shift balance targets.
