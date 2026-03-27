# AGENT-09 — Perk tags + feat achievements (Tier B)

## Role
Gameplay designer / engineer.

## Objective
Tag **each perk** (or perk family) with **at most 3** tags, e.g. `mobility`, `defense`, `score`. Add **1–2** achievements for feats such as “Complete a run using only mobility-tagged perks” (define “complete” as survive X minutes or score threshold—pick one consistent rule).

## Background
Survivor-like build identity without new combat verbs.

## Implementation steps
1. Locate perk definitions (grep `perk`, `ownedPerks`, draft pool in `dodgeGame` / `modeConfig` / related modules).
2. Add `tags: Set` or string array on perk defs; validate at load.
3. Track run set of tags chosen; on `endRun` or gate exit, evaluate feat.
4. Add achievements in `achievements.js`; unlock like AGENT-02.

## Acceptance criteria
- [ ] ≤3 tag names total across the game.
- [ ] Every draftable perk has ≥1 tag (or explicit `neutral` if needed—prefer not).
- [ ] At least 1 achievement tied to tag discipline fires correctly.
- [ ] Does not break Draft mode cadence.

## Dependencies
Coordinate copy with AGENT-02 if adding many achievements.

## Key files
- Perk definition modules (grep from `dodgeGame.js`)
- `app/config/achievements.js`
- `app/scenes/dodgeGame.js`
