# Backlog — optional strips not in AGENT-01…20

Items from [`docs/SKYFALL_LEAN_FEATURES.md`](../docs/SKYFALL_LEAN_FEATURES.md) **optional simplifications** that did not get a dedicated agent slot (20-agent cap). Spawn **new** `AGENT-21+` files if product approves.

| Strip | Notes |
|-------|--------|
| **Meta progression** (`metaScene`, tree, currency) | Arcade-pure pivot; needs save migration + menu removal. |
| **Daily contracts** | Remove `generateDailyContracts`, menu claims; overlaps achievements. |
| **Achievements** (whole system) | Prefer **trim list** over delete for Steam. |
| **Archetype picker** | Collapse to single character or cosmetic-only. |
| **Click-to-destroy** | Remove input + scoring hooks; update `DESTROY_STREAK_*`. |
| **Tutorial** | Shorten copy vs remove; keep first-run path. |
| **Credits scene** | Delete scene + menu link if attribution moved to README only. |
| **Full telemetry removal** | Stronger than AGENT-13 audit—delete module + calls. |
| **Full online removal** | Delete `onlineService` + leaderboard UI; stub saves. |

**Constraint:** Do not remove **ChallengeDirector** / timed **1–2–3** flow without explicit product override.

**Gap-analysis shipping work** is covered by **AGENT-21–39** in [`README.md`](./README.md) and [`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md).

**Fully fledged** (content, balance, store, trailer, gamepad, i18n, perf, CI, playtest, compliance) is **AGENT-40–54** in [`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md).
