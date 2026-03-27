# AGENT-46 — Full gamepad + Steam Input (fully fledged §H)

## Source
[`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md) axis **H**; extends **AGENT-27** (keyboard).

## Objective
1. **Phaser** — map **movement** to left stick / D-pad; **pause** to Start/Options; **challenge 1–2–3** to face buttons or bumpers (config table).
2. **Menus** — navigate Play / Options / Meta with **d-pad + confirm** (at least main menu + pause).
3. **UI** — show **glyphs** or generic “Button 1” if glyph API missing; update **Options → Controls**.
4. **Steam** — optional **Steam Input** template or “partial controller support” truth in store copy if incomplete.

## Acceptance criteria
- [ ] **Xbox-class** pad works on Windows (Electron + browser if applicable).
- [ ] No **soft-lock** in menu (always path to Back).
- [ ] Document unsupported pads in `docs/GAMEPAD.md`.

## Dependencies
After **AGENT-27** if sharing binding save schema.
