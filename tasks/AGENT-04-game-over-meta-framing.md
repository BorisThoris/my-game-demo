# AGENT-04 — Game over: meta + contracts prominence (Tier A)

## Role
UI / UX engineer.

## Objective
Make **meta currency gained this run** and **contracts completed / progressed** **impossible to miss** on game over—larger type, color, spacing, or dedicated lines. Per lean doc: “productive death.”

## Background
`endRun` in `dodgeGame.js` calls `grantMetaCurrency`, `claimCompletedContracts`, `buildRunSummary`, `showGameOver`. Summary text may currently bury rewards.

## Implementation steps
1. Read `showGameOver`, `gameOverSummaryText`, and related layout.
2. Add dedicated lines, e.g. **“+NN meta”** and **“Contract: Title ✓”** or bullet list of claims.
3. Use existing theme tokens from `styleTokens` / `sceneStyles`—no hardcoded rainbow spam unless theme already allows accent.
4. Ensure new record / PB lines from AGENT-05 still fit (flex layout or wrap).

## Acceptance criteria
- [ ] Meta reward number visible without scrolling on typical resolutions.
- [ ] At least one contract completion is called out when `claimCompletedContracts` fires.
- [ ] No regression to restart / menu flow.

## Dependencies
Do **before** or **with** AGENT-03 if game-over panel is shared; avoid duplicate conflicting text objects.

## Key files
- `app/scenes/dodgeGame.js`
- `app/config/sceneStyles.js` / theme (if needed)
