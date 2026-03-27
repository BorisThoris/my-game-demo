# AGENT-16 — HUD clarity pass (formula checklist)

## Role
UX engineer.

## Objective
Align in-run HUD with [`docs/SKYFALL_LEAN_FEATURES.md`](../docs/SKYFALL_LEAN_FEATURES.md) formula checklist row: **one-glance goal** (survive, score, dodge) and optional **heat** readability. Do **not** add new stats; clarify labels, contrast, or ordering only.

## Implementation steps
1. Audit `dodgeGame.js` HUD: score, phase/heat, shields, status, challenge panel visibility.
2. Ensure phase/heat bar reads as “danger going up” without tutorial (icon, label, or color from `theme`).
3. Reduce duplicate or cryptic abbreviations.
4. Mobile: check `mobileControls` overlay does not obscure critical HUD (coordinate with existing desktop-build class).

## Acceptance criteria
- [ ] New player can name the primary goal from HUD alone in a 5s glance.
- [ ] Heat/phase progression is interpretable (not necessarily numerically exact).
- [ ] No new persistent UI widgets.

## Key files
- `app/scenes/dodgeGame.js`
- `app/config/dodgeHudStyles.js` / `styleTokens`
- `style.css` (mobile overlay)
