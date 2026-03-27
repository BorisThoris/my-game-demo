# AGENT-33 — Tutorial / onboarding pass (gap §6)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §6 — tutorial exists; depth vs interactive onboarding is open; backlog mentions shorten/remove.

## Objective
**Product fork** (state in PR which branch you took):
- **Deepen:** Add 2–3 **in-run** callouts first time (move, dodge, 1/2/3 challenge) using existing save flags—**or** extend `tutorialScene` with steps + practice.
- **Shorten:** Reduce text to one screen + link to Options → Controls; ensure `tutorialOptOut` still works.

## Acceptance criteria
- [ ] First-run flow completes in under 2 minutes for “shorten” path or under 5 for “deepen.”
- [ ] No duplicate wall of text with **AGENT-10** post-run tips—coordinate copy.

## Key files
- [`app/scenes/tutorialScene.js`](../app/scenes/tutorialScene.js)
- [`app/save/saveManager.js`](../app/save/saveManager.js) (`shouldShowTutorial`, etc.)
- [`app/scenes/mainMenuScene.js`](../app/scenes/mainMenuScene.js)
