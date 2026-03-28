# Releasing Skyfall (1.x.y)

## Version source (keep in sync)

1. Bump **`package.json`** `version` (npm/Electron convention).
2. Bump **`app/config/version.js`** `GAME_VERSION` to the **same** string (in-game Options, Credits, About, telemetry payload).

Commit both together with a clear message, e.g. `chore: release 1.0.1`.

## Pre-ship checks (local)

```bash
npm ci
npm test
npm run build
npm run test:e2e
```

CI runs the same on push/PR (see `.github/workflows/ci.yml`).

## Web / Vite build

```bash
npm run build
```

Output: `dist/`. Deploy `dist/` to static hosting.

## Desktop (Electron)

```bash
npm run electron:build
```

Artifacts land under `release/` (see `package.json` / electron-builder `directories.output`).

### Windows code signing (optional)

If you have an Authenticode certificate:

- Sign the installer and/or unpacked `.exe` with **`signtool`** (Windows SDK) using your PFX and timestamp server.
- Document thumbprint, vault location, and CI secret names in your internal runbook.

**Without a cert:** ship an **unsigned** build; SmartScreen may warn until reputation builds. Note “unsigned” in release notes when applicable.

## Changelog

Maintain root **`CHANGELOG.md`** ([Keep a Changelog](https://keepachangelog.com/) style): Unreleased section during dev; on release, add `## [x.y.z]` with date and bullet list of user-visible changes.
