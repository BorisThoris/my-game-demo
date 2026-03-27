# AGENT-27 — Key rebinding (gap §4)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §4 — [`controlLabels.js`](../app/config/controlLabels.js) says rebinding not implemented.

## Objective
Persist custom key codes in save (`settings.keyBindings` or similar). Options scene: **rebind** movement, pause, challenge 1–2–3. Update `dodgeGame` (and any scene) to read bindings from save with **defaults** = current hardcoded keys.

## Deliverables
1. Save schema + migration defaults.
2. Rebind UI flow (listen next key; cancel on Esc).
3. Update [`CONTROL_LABELS`](../app/config/controlLabels.js) generation from saved bindings for display.

## Acceptance criteria
- [ ] Defaults match today’s behavior for new saves.
- [ ] Rebound keys work in dodge + challenges.
- [ ] Invalid / duplicate key handling with user message.

## Out of scope
Gamepad full mapping (optional stretch).
