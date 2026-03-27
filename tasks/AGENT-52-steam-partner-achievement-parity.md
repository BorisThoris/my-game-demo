# AGENT-52 — Steam partner: achievements & boards parity (fully fledged §M)

## Source
[`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md) axis **M**.

## Objective
1. **Spreadsheet** — each `ACHIEVEMENTS` id ↔ **Steam API name** (exact string in partner site).
2. **Leaderboards** — create boards in partner: `best_score`, `longest_survival_sec`, daily seed ids match `onlineService.js`.
3. **Verify** — with **AGENT-22** mock or real build: unlock fires once; **no** duplicate API name typos.
4. **Checklist** — depots, launch build branch, **beta** branch optional.

## Acceptance criteria
- [x] `docs/STEAM_PARTNER_PARITY.md` — table of ids; **100%** in-game achievements have Steam entries **or** explicit “Steam-free build” note.
- [x] Screenshots of partner config redacted OK in doc. *(Optional section present; embed when dashboard exists.)*

## Dependencies
**AGENT-22** for live verification.
