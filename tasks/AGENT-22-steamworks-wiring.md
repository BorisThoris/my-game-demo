# AGENT-22 — Steamworks / `setOnlineAdapter` wiring (gap §2.2, §4)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §2.2, §4 — `createSteamAdapter` exists but **`setOnlineAdapter` never called**; Steam achievements do not hit Valve.

## Objective
From the **renderer** (after boot), call [`setOnlineAdapter`](../app/services/onlineService.js) with either:
- **A)** A real Steam provider (greenworks, steamworks.js, or custom preload IPC to native), **or**
- **B)** A **feature-flagged** dev provider that logs calls but matches the same interface—so integration can be tested without SDK.

## Deliverables
1. **Provider module** — thin wrapper implementing `unlockAchievement`, `submitLeaderboardScore`, `setRichPresence`, `saveToCloud`/`loadFromCloud`, `getLeaderboardEntries` as required by `createSteamAdapter`.
2. **Boot wiring** — `app/index.js` or a tiny `bootstrapOnline.ts/js` imported once: if `VITE_STEAM` / IPC says Steam available → `setOnlineAdapter(createSteamAdapter(provider))`.
3. **Achievement ID map** — document or config mapping game `ACHIEVEMENTS` ids → Steam API names (Steamworks dashboard must match).
4. **Leaderboard IDs** — align `submitRunLeaderboards` ids with Steam board names.

## Acceptance criteria
- [ ] With flag off: behavior identical to today (local adapter).
- [ ] With mock provider: `unlockAchievement` invoked when in-game achievement unlocks (verify in console or test double).
- [ ] README or `docs/STEAM_BUILD.md` explains env vars and build steps (even if “TODO: paste SDK path”).

## Dependencies
**AGENT-21** if provider lives in main process via IPC.

## Out of scope
Building full Steam depot pipeline (Valve partner tasks).
