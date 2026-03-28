# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Optional telemetry HTTP upload when `VITE_TELEMETRY_ENDPOINT` is set at build time; gated by Settings “Allow anonymous analytics” (default off).
- About scene with version and configurable external links; analytics privacy blurb in Options.
- CI workflow: `npm test`, `npm run build`, and Playwright e2e on push/PR to `master` / `main`.
- Game over: **R** or **Space** to replay (in addition to on-screen replay control).
- Daily modifiers (UTC), expanded daily contracts + event metrics, meta tree growth, gambit risk pickup, perk feat tags, survival PB times, compact game-over recap, `window.skyfallElectron` IPC surface.
- Options: photosensitivity **Safe mode**; color-blind row explains warm/cool remap.

### Documentation

- `docs/TELEMETRY.md`, `docs/SESSION_RESTART.md`, `docs/RELEASE.md`, `docs/ACCESSIBILITY.md`.
