# Telemetry (local batch + optional upload)

## Local batch (always)

Run analytics events are buffered in `localStorage` under `skyfall.telemetry.v1` (ring buffer, cap 250). This supports dev tooling (`npm run telemetry:aggregate`) and future uploads.

## Optional HTTP upload (build-time)

If **`VITE_TELEMETRY_ENDPOINT`** is set at **build** time to an absolute `https://` URL, the game registers `setTelemetryUploadHook` and POSTs JSON batches to that URL. Payload shape includes `{ events, gameVersion }` (see `app/index.js`).

- **No env variable** → no upload hook; nothing is sent over the network from telemetry.
- **Consent** — Upload runs only when **Settings → Allow anonymous analytics** is on (`allowAnonymousAnalytics` in save). If off, `flushTelemetryBatch` skips the hook with reason `no-consent` and keeps the local batch for later opt-in or CLI export.

## Privacy copy

Options shows a short disclosure when telemetry upload is relevant; optional **Privacy policy** opens only if `app/config/externalLinks.js` has a real `http(s)` URL for `privacy`.

## Related

- [ONLINE_TELEMETRY.md](./ONLINE_TELEMETRY.md) — full storage/queue audit.
