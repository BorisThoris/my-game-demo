# AGENT-05 — Personal best on run summary (Tier A)

## Role
Save / UI engineer.

## Objective
On game over (and optionally pause or HUD), show **personal best score** and **personal best survival time** for the **current mode** (`normalizeGameMode`), reading from save/high-score APIs already used in `dodgeGame` / `saveManager`.

## Background
Runner-style self-competition without multiplayer.

## Implementation steps
1. Find where per-mode high score is stored (`setHighScore`, `getHighScore`, localStorage keys).
2. If **best time** is not stored, add minimal save fields with backward-compatible defaults in `saveManager.js`.
3. Update `buildRunSummary` or game-over UI to show: `This run: X  |  Best: Y` and time analog.
4. Flag **New record!** when applicable (may already exist as `_justSetNewRecord`—extend for time if added).

## Acceptance criteria
- [ ] Player sees PB score for active mode after death.
- [ ] If time PB is in scope, it updates correctly and persists across reloads.
- [ ] Migration: old saves without time PB default to 0 or “—” without throwing.

## Key files
- `app/scenes/dodgeGame.js`
- `app/save/saveManager.js`
- Grep: `setHighScore`, `highScore`, `highestScore`
