# Fullscreen QA matrix

**Purpose:** Track browser vs Electron fullscreen behavior for Skyfall (Phaser `Scale.FIT` + `startFullscreen` / `stopFullscreen` from **Options**).

**Doc version:** 2026-03-28 · Game version **`1.0.0`** (`app/config/version.js`)

## How to test

1. **Web:** `npm run dev` or `npm run build` + `npm run preview`; open Options → toggle **Fullscreen: On/Off**.
2. **Electron:** `npm run electron:dev` (or packaged build from **AGENT-49**); same Options toggle.
3. Note: **ESC** exits browser fullscreen in many browsers (not remapped by the game).

## Results matrix

| Platform / browser | Enter FS | Exit FS (button) | ESC | Canvas alignment | Input OK | Tester / date | Notes |
|--------------------|----------|-------------------|-----|------------------|----------|----------------|-------|
| Windows — Chrome | ☐ | ☐ | ☐ | ☐ | ☐ | | |
| Windows — Edge | ☐ | ☐ | ☐ | ☐ | ☐ | | |
| Windows — Electron (dev) | ☐ | ☐ | ☐ | ☐ | ☐ | | |
| macOS — Chrome *(optional)* | ☐ | ☐ | ☐ | ☐ | ☐ | | |

**Legend:** Check boxes when verified; fill **Notes** with build ID or SHA.

## Code references

- Fullscreen toggle: `app/scenes/optionsScene.js` (`scale.startFullscreen` / `stopFullscreen`).
- Scale mode: `app/index.js` Phaser config (`Phaser.Scale.FIT`, `CENTER_BOTH`).

## P0 vs P1

| Severity | Examples |
|----------|-----------|
| **P0 (block Steam)** | Black screen after FS; stuck fullscreen with no exit; total loss of pointer/keyboard |
| **P1 (document)** | Letterboxing differs by monitor DPI; minor 1px bars; Linux WM quirks |

## Automated coverage

- No dedicated Playwright fullscreen suite yet; this doc is the **manual** source of truth until **AGENT-36** / **AGENT-38** expand E2E.

## Last automated smoke

- `npm run test:e2e` (Chromium windowed) — green on the commit that introduced this file. Fullscreen itself is **not** exercised in CI here.
