# AGENT-30 — Offline / local adapter honesty (gap epic 3)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §11 epic 3 — when `activeAdapter.name === 'local'`, players should understand scores aren’t on Steam.

## Objective
- Options or main menu: one line **“Online: Off (local profile)”** when local adapter.
- When **AGENT-22** sets Steam adapter, show **“Steam: Connected”** or error state from last sync patch (`onlineService` state if exposed).

## Acceptance criteria
- [ ] No code path claims “global leaderboard” for local adapter.
- [ ] Submissions can remain (queued no-ops) or be hidden behind copy—product choice documented in PR.

## Key files
- [`app/services/onlineService.js`](../app/services/onlineService.js) — export `getAdapterName()` or similar read-only.
- [`app/scenes/mainMenuScene.js`](../app/scenes/mainMenuScene.js) / options

## Dependencies
Easiest after **AGENT-22** exposes adapter identity consistently.
