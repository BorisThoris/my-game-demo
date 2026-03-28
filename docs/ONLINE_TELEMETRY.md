# Online service & telemetry audit

**Date:** 2026-03-28 · **Task:** [`tasks/AGENT-13-online-telemetry-audit.md`](../tasks/AGENT-13-online-telemetry-audit.md)

## Summary

| Area | Storage | Network | Purpose |
|------|---------|---------|---------|
| **Telemetry events** (`app/game/telemetry.js`) | `localStorage` key `skyfall.telemetry.v1` (ring buffer ≤250) | Only if `setTelemetryUploadHook` / `flushTelemetryBatch` is called with a hook | Run/death/boss/challenge analytics; default **no upload** until a hook is registered |
| **Online queue & sync meta** (`onlineService.js`) | `skyfall_online_queue`, `skyfall_online_state` | Via **adapter** only (`unlockAchievement`, `submitLeaderboardScore`, etc.) | Retries with backoff; **local** adapter is no-op success |
| **Achievements (sync flag)** | Persisted in online state | Steam/other when adapter wired | Unlock always stored locally first |
| **Leaderboard submits** | Last submission snapshot in state | Adapter | Queued on failure |
| **Rich presence** | Cached string in state | Adapter | Queued on failure |
| **Cloud save** (`saveToCloud` / `loadFromCloud`) | — | Adapter | Callback no-op on failure |

## Build-time upload endpoint + consent

- If **`VITE_TELEMETRY_ENDPOINT`** is set at build time, the app may register an upload hook (see `app/index.js`). Upload still requires **Settings → Allow anonymous analytics** (`allowAnonymousAnalytics`); otherwise `flushTelemetryBatch` skips with `no-consent`.
- Env vars and player-facing copy: **[TELEMETRY.md](./TELEMETRY.md)**.

## Offline / no hook behavior

- **`flushTelemetryBatch`:** If there is no upload hook or the batch is empty, returns immediately `{ uploaded: 0, skipped: true }` — **does not block** gameplay.
- **End-of-run path:** `dodgeGame` calls `uploadTelemetryBatch()` with no arguments; with default hook **null**, telemetry stays on disk until a future uploader is registered (e.g. Steam build).
- **Adapter failures:** Operations are queued and retried; after max attempts the entry is dropped and `sync.lastError` is updated. **`debug()` logs are Vite DEV-only** (`import.meta.env.DEV`) so production consoles are not spammed.

## Dev tooling

- **`scripts/telemetry/aggregateTelemetry.js`** — CLI to read local batch from a path; **dev / support**, not shipped to players.

## Related tasks

- **AGENT-22** — real Steam adapter.
- **AGENT-29** — privacy copy for any upload hook.
- **AGENT-30** — offline / adapter honesty in UI.
