# AGENT-31 — Accessibility & presentation pass (gap §5)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §5 — color-blind partial, juice + flash combos, Arial everywhere, photosensitivity.

## Objective
1. **Photosensitivity / “Safe mode”** — One settings toggle that clamps flash intensity max, reduces screen shake cap, and documents juice plugin limitations (cannot disable all Phaser tweens without audit).
2. **Color-blind** — Document in Options what the mode **does** (warm/cool remap) and add **one** playtest note in `docs/ACCESSIBILITY.md`.
3. **Typography (optional stretch)** — Add **one** licensed webfont for title + menu via Vite; keep HUD readable fallback Arial.

## Acceptance criteria
- [ ] Safe mode demonstrably reduces brightest flashes in a test run (before/after screenshot or metric).
- [ ] No regression to default experience when safe mode off.
- [ ] If font skipped, doc states “future work” explicitly.

## Out of scope
Full semantic recolor for every hazard type (unless trivial extension of existing palette hook).
