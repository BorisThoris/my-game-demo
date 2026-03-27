# AGENT-18 — Tier C deferrals document (policy)

## Role
Technical writer / lead.

## Objective
Create **`docs/DEFERRED_FEATURES.md`** listing everything in lean doc **Tier C** and similar “never for small Skyfall” items, with **one-line rationale** each. Prevents scope creep when agents propose features.

## Content checklist (from SKYFALL_LEAN_FEATURES)
- Idle/offline earnings
- Multiple currencies + vendors
- Procedural narrative / run quests beyond contracts
- Full cosmetic shop (Phase 2 note)
- Real-time leaderboards / async PvP (unless infra owned)
- Roguelike full relic grid
- Optional: gacha chests, battle passes, live ops calendars

## Implementation steps
1. Copy table from Tier C; expand with “signal to reopen” (e.g. mobile F2P SKU).
2. Cross-link [`POPULAR_SIMPLE_GAMES_FORMULA.md`](../docs/POPULAR_SIMPLE_GAMES_FORMULA.md) caveats.
3. Keep under one printed page.

## Acceptance criteria
- [ ] File exists at `docs/DEFERRED_FEATURES.md`.
- [ ] Each deferred item has rationale + “revisit when” condition.
- [ ] No code changes required (doc only).
