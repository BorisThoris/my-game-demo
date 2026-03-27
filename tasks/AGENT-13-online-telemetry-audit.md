# AGENT-13 — Online service + telemetry audit (safe strip / harden)

## Role
Platform engineer.

## Objective
Audit `app/services/onlineService.js`, `app/game/telemetry.js`, and callers. Produce a short **audit note** in-repo (optional: `docs/ONLINE_TELEMETRY.md`) listing: what calls network, what is localStorage-only, and what is no-op. Then either **(A)** no code change, **(B)** stub unreachable endpoints clearly, or **(C)** compile-time strip for offline builds—pick one approach and implement consistently.

## Implementation steps
1. Trace `flushTelemetryBatch`, `setTelemetryUploadHook`, leaderboard submit, rich presence.
2. Ensure failed network does not spam console in production (rate limit or silent).
3. If stripping: guard with `VITE_ENABLE_ONLINE` or `PROD` false.
4. Update tests that mock telemetry.

## Acceptance criteria
- [ ] Documented table: feature → storage vs network → purpose.
- [ ] Offline play never blocks on telemetry flush.
- [ ] `npm test` passes.

## Key files
- `app/services/onlineService.js`
- `app/game/telemetry.js`
- `app/scenes/dodgeGame.js` (flush calls)
- `scripts/telemetry/aggregateTelemetry.js` (if dev-only, note)
