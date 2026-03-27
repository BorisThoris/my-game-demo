# AGENT-06 — Single “risk” pickup (Tier A)

## Role
Gameplay engineer.

## Objective
Implement **exactly one** optional risk/reward pickup type in the dodge loop (lean doc: rare pickup with **one** clear tradeoff). **Do not** add a shop or multiple consumable types.

## Design constraints (pick one package and stick to one)
- **Package A:** Short **score multiplier** + slightly **faster phase/heat** for N seconds.
- **Package B:** **One extra perk choice** at next draft gate + temporary **fragile** state (e.g. no shields for M seconds).
- **Package C:** Burst **score** + single **screen flash** warning (juice only)—mildest option.

## Implementation steps
1. Find pickup spawn path in `dodgeGame.js` / `runnerContent.js` / spawn director.
2. Add a rare spawn weight (tunable constant at file top).
3. On collect: set run-scoped flags consumed by score tick / phase speed / next `pendingPerkChoices`.
4. Add minimal VFX/sound using existing juice/audio patterns.
5. Document constant names for designers.

## Acceptance criteria
- [ ] Pickup spawns rarely; readable on screen (distinct color/shape).
- [ ] Tradeoff is obvious within one sentence in a floating hint or pickup label.
- [ ] No additional currencies; no inventory screen.
- [ ] `npm test` still passes; add unit test if pure logic extracted.

## Out of scope
- Daily modifier (AGENT-08). Second risk pickup type.

## Key files
- `app/scenes/dodgeGame.js`
- `app/game/runnerSpawnDirector.js` (if pickups spawned there)
- `app/game/runnerContent.js`
