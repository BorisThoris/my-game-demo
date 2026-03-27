# AGENT-48 — Performance & minimum spec (fully fledged §I)

## Source
[`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md) axis **I**.

## Objective
1. **Profile** — Chrome DevTools + Phaser; 2–3 **stress** scenarios (late run horde, boss + particles). Record **FPS** and **frame time** variance.
2. **Budget** — cap concurrent projectiles / particles if needed; optional **low FX** setting ties to **AGENT-31** safe mode.
3. **Doc** — `docs/MINIMUM_SPEC.md`: target **GPU/CPU/RAM** statement + “tested on …” honesty.
4. **Steam** — paste min spec into store page (**AGENT-44**).

## Acceptance criteria
- [ ] **60 FPS** target on agreed **reference machine** (define in doc) for **median** run, or document **30 FPS** floor.
- [ ] No **unbounded** allocations in hot path (fix worst offender if found in profile).

## Key tools
Browser Performance, `npm run build` + Electron prod build.
