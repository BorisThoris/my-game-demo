# AGENT-43 — Visual & readability pass (fully fledged §D)

## Source
[`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md) axis **D — Sensory (visual)**.

## Objective
- **Telegraph** — player can **predict** lethal vs safe (boss wind-up, hazard tint, perk glow).
- **HUD** — complements **AGENT-16**; ensure **critical** info survives busy screens (boss phase, shield, challenge timer).
- **Juice** — `phaser3-juice-plugin` + particles: **cap** worst-case flash count when **safe mode** on (**AGENT-31**).
- **Menu polish** — main menu / meta not “debug UI” (spacing, hierarchy)—incremental, no full redesign unless scoped.

## Acceptance criteria
- [ ] **3** blind screenshot tests: new player names **player**, **top hazard**, **score** without motion.
- [ ] Document **known** low-contrast pairs for future art.

## Out of scope
Replacing all procedural art with hand-drawn sprites (unless product funds).
