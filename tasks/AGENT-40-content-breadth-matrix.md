# AGENT-40 — Content breadth matrix (fully fledged §B)

## Source
[`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md) axis **B — Content volume**.

## Objective
Define a **minimum content matrix** (spreadsheet or `docs/CONTENT_MATRIX.md`) with **current counts vs targets** for:

- Hazard / obstacle **families** (by phase or heat band)
- **Boss** pattern variants or boss “types”
- **Perk** count and **archetype** coverage
- **Challenge** types (`ChallengeDirector`) and rotation variety
- **Pickups** / risk objects (include **AGENT-06** if landed)
- **Modes** (Classic / Boss Rush / Draft) — distinct feel per mode

## Deliverables
1. **Inventory** — grep/list from `runnerContent.js`, `bossEncounter.js`, `challengeDirector.js`, perk defs, `modeConfig.js`.
2. **Targets** — numeric or qualitative (e.g. “≥12 distinct hazard behaviors in rotation”); justify for a **$5–15** indie scope.
3. **Backlog** — prioritized list of **adds** (data-only vs code); link to future PRs.

## Acceptance criteria
- [ ] Matrix exists and is **honest** (no aspirational fiction).
- [ ] At least **3** concrete content gaps have **owner + effort** estimate.

## Out of scope
Implementing every add in one PR—this task is **planning + optional one slice**.
