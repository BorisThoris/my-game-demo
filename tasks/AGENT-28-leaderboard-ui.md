# AGENT-28 — In-game leaderboard UI (gap §2.2, §4, epic 5)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) — `getLeaderboardEntries` **unused** in app code; submissions exist without display.

## Objective
Add a **minimal** scene or panel (from main menu): **best score**, **longest survival**, **today’s daily seed board** (ids must match `submitRunLeaderboards` in [`onlineService.js`](../app/services/onlineService.js)).

## Behavior
- **Local adapter:** show **local bests from save** (`highScoresByMode`, best survival if tracked) with label “Local only.”
- **Steam adapter:** call `getLeaderboardEntries` and render returned rows; fallback message on failure.

## Acceptance criteria
- [ ] Players see at least one meaningful ranking without external tools.
- [ ] No fake “global” label when adapter is local (honesty aligns with **AGENT-30**).

## Dependencies
Optional after **AGENT-22** for live Steam entries.
