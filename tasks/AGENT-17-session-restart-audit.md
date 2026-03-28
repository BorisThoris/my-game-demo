# AGENT-17 — Session fit + instant restart audit (formula checklist)

## Role
UX / QA engineer.

## Objective
Verify **short sessions** and **one-action restart** after death: no blocking modals, no forced meta scene, no animation lock longer than necessary. Document gaps and fix **small** issues (e.g. focus, keyboard repeat, mobile tap target).

## Implementation steps
1. Trace `replayButton`, keyboard shortcuts, and scene restart from game over.
2. Time or manually count steps: death → playing again.
3. Fix issues where `activeChallenge` or `pendingPerkChoices` block restart incorrectly.
4. Add brief note to `docs/SKYFALL_LEAN_FEATURES.md` or `tasks/README.md` “verified restart flow” if useful.

## Acceptance criteria
- [x] Restart from game over in ≤2 inputs (e.g. click replay or one key).
- [x] Pause/ESC behavior still sane (no soft-lock).
- [x] Documented list of any intentional friction (e.g. must see summary)—should be minimal.

## Key files
- `app/scenes/dodgeGame.js`
- `e2e/boot.spec.js` or game flow specs (extend if needed)
