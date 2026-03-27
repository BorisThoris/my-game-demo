# AGENT-19 — UI trim: game over + options (lean doc)

## Role
UI engineer.

## Objective
Execute lean doc **UI / copy trims**: (1) shorten game over text—e.g. cap **challenge outcome** lines to last **N** entries or collapse to “+K challenges cleared”; (2) **Options** scene: remove or hide placeholder rows that do not apply to current build (grep `TODO`, `not implemented`, duplicate controls).

## Implementation steps
1. Find `challengeOutcomeLog` / summary assembly in `dodgeGame.js`.
2. Replace wall of text with compact summary + optional “details” toggle **only if** trivial; prefer single shorter block per lean anti-bloat.
3. Open `optionsScene.js` + `controlLabels.js`; align with real bindings.
4. Verify achievements/options links still work.

## Acceptance criteria
- [ ] Game over readable in ~5–7 lines of body text for a long run (excluding titles/buttons).
- [ ] Options contains no misleading controls.
- [ ] No removal of Challenge/QTE copy that explains 1/2/3 **if** it’s the only place—trim repetition only.

## Key files
- `app/scenes/dodgeGame.js`
- `app/scenes/optionsScene.js`
- `app/config/controlLabels.js`
