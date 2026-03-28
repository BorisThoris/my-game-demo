# AGENT-29 — Telemetry upload hook + privacy (gap §4, §9)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §4, §9 — `setTelemetryUploadHook` likely unset; upload needs disclosure/opt-out.

## Objective
1. **Optional upload** — If `VITE_TELEMETRY_ENDPOINT` (or similar) set, register `setTelemetryUploadHook` to POST batch JSON; handle 4xx/5xx and retry policy (align with online queue patterns or keep simple).
2. **Privacy** — Settings toggle **“Allow anonymous analytics”** (default off unless product says on) gating upload + `flushTelemetryBatch` no-op when off.
3. **Copy** — One paragraph in Options linking to privacy URL placeholder `#` or real policy.

## Acceptance criteria
- [x] Default OSS build: no network telemetry without env + consent.
- [x] Local batch still works for dev `aggregateTelemetry.js` when opted in.
- [x] Document env vars in `docs/TELEMETRY.md` extension.

## Key files
- [`app/game/telemetry.js`](../app/game/telemetry.js)
- [`app/scenes/optionsScene.js`](../app/scenes/optionsScene.js)
- [`app/save/saveManager.js`](../app/save/saveManager.js)
