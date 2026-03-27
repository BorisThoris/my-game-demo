# Steam partner parity checklist

Parity between in-game identifiers and what you configure in the [Steamworks partner site](https://partner.steamgames.com/). Source of truth in this repo:

- Achievements: [`app/config/achievements.js`](../app/config/achievements.js) (`ACHIEVEMENTS`)
- Leaderboard IDs and daily pattern: [`app/services/onlineService.js`](../app/services/onlineService.js) (`submitRunLeaderboards`, `computeDailySeedLeaderboardId`)

## Verification (AGENT-22)

Live unlock and leaderboard submission behavior is **not** validated by this document. Use **[`tasks/AGENT-22-steamworks-wiring.md`](../tasks/AGENT-22-steamworks-wiring.md)** for wiring `setOnlineAdapter` / mock or real Steam provider, then confirm: each unlock fires **once**, API names have **no** typos vs the table below, and boards accept scores.

## Steam-free build / incomplete integration

This repository does **not** ship confirmed Steamworks dashboard strings. Until AGENT-22 is done and achievements or boards are created in partner with names pasted into the “Steam API name (partner)” column below, treat builds as **Steam-free** for parity purposes: Steam features may be no-ops or local-only via the default adapter.

Screenshots of partner config (redacted) can be appended here when available.

---

## Achievements: in-game ID → Steam API name

The game passes the **in-game achievement id** string to `unlockAchievement` / the Steam adapter. Steam’s **API Name** field must match that string **exactly** (case-sensitive). There is **no** mapping layer in the default app path—**type these API names verbatim** when creating achievements in Steamworks.

| In-game ID (`ACHIEVEMENTS` key) | In-game title (reference) | **Steam API name to create (must match)** | Partner dashboard filled? |
|--------------------------------|---------------------------|-------------------------------------------|---------------------------|
| `first_run` | First Record | `first_run` | ☐ |
| `score_50` | 50 Up | `score_50` | ☐ |
| `score_100` | Century | `score_100` | ☐ |
| `score_250` | Skyline | `score_250` | ☐ |
| `boss_clear_1` | Boss Breaker | `boss_clear_1` | ☐ |
| `boss_clear_5` | Boss Veteran | `boss_clear_5` | ☐ |
| `challenge_streak_3` | In The Zone | `challenge_streak_3` | ☐ |
| `challenge_streak_5` | Perfect Cadence | `challenge_streak_5` | ☐ |
| `no_hit_30s` | Untouched | `no_hit_30s` | ☐ |
| `no_hit_60s` | Ghost Runner | `no_hit_60s` | ☐ |

**Coverage:** 10 / 10 in-game achievements from `ACHIEVEMENTS` have defined Steam API names (**100%**). Check the last column after you create rows in Steamworks and smoke-test with **AGENT-22**.

### Partner screenshots (optional)

Redacted screenshots of the achievement and leaderboard admin pages can be embedded here once configured. Until then, this table is the contract.

---

## Leaderboards (align with `onlineService.js`)

Create Steam leaderboards whose **API names** match the strings the game submits.

| Purpose | Leaderboard ID used in code | Notes |
|--------|------------------------------|--------|
| Best run score | `best_score` | Submitted in `submitRunLeaderboards` as run score. |
| Longest survival | `longest_survival_sec` | Submitted as seconds (numeric). |
| Daily seed board | `daily_seed_YYYYMMDD` | UTC date, zero-padded month/day, e.g. `daily_seed_20260328`. Computed by `computeDailySeedLeaderboardId` in `onlineService.js`. |

You must create **one Steam leaderboard per calendar day** if you want daily boards to resolve, **or** change the game to use a fixed id (out of scope here).

---

## Release checklist (short)

- [ ] Depots and default branch point at the Steam-capable build (when applicable).
- [ ] Achievements: all rows above have partner API names filled and match unlock calls.
- [ ] Leaderboards: `best_score`, `longest_survival_sec`, and strategy for `daily_seed_*` boards.
- [ ] Optional **beta** branch for limited testing.
- [ ] AGENT-22 verification passed (mock or real).
