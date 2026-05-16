# Skyfall

**Skyfall** is a Phaser 3 endless dodger built with Vite and packaged for desktop with Electron. The game centers on short arcade runs where the player survives escalating hazard waves, clears boss encounters, drafts perks, completes objectives/contracts, and carries progress forward through unlocks and achievements.

This repository is a portfolio-ready game project rather than a small framework demo. It includes gameplay systems, save/progression logic, accessibility/options work, automated tests, Playwright smoke coverage, Electron packaging, telemetry hooks, and Steam-readiness planning docs.

## What It Demonstrates

- Phaser 3 arcade game architecture with scene-based flow.
- Vite-powered browser build and Electron desktop build path.
- Endless dodger gameplay with heat phases, hazards, pickups, bosses, and projectiles.
- Perk drafts, archetypes, run objectives, daily contracts, achievements, and meta progression.
- Local save management with versioned settings and progression data.
- Accessibility-minded options for motion, flash, controls, and visual readability.
- Online-service boundaries for achievements, leaderboards, rich presence, telemetry, and cloud-save style integration.
- Procedural sprite/UI asset helpers and shared design tokens.
- Node test coverage for gameplay systems and Playwright e2e smoke tests.
- Production planning docs for Steam readiness, release quality, content breadth, performance, and compliance.

## Tech Stack

- JavaScript / ES modules
- Phaser 3
- Vite
- Electron / Electron Builder
- Node test runner
- Playwright
- CSS

## Key Systems

- `app/scenes/dodgeGame.js` - main run loop, hazards, pickups, bosses, rewards, objectives, and run summary.
- `app/game/runnerSpawnDirector.js` - procedural spawn pacing and wave direction.
- `app/game/perkSystem.js` - perk draft choices and run modifiers.
- `app/game/metaProgression.js` - between-run progression and unlock hints.
- `app/game/contractDirector.js` - daily/recurring objective generation.
- `app/game/bossEncounter.js` and `app/game/bossRewards.js` - boss behavior and reward flow.
- `app/save/saveManager.js` - local persistence for settings, records, unlocks, and progress.
- `app/services/onlineService.js` - platform-facing service boundary for online features.
- `electron/` - desktop shell and preload bridge.
- `test/` and `e2e/` - unit/system tests and browser smoke coverage.

## Run Locally

```bash
npm install
npm run dev
```

Useful scripts:

```bash
npm test
npm run test:e2e
npm run build
npm run electron:dev
npm run electron:build
```

## Demo run

```bash
npm install
npm run build
npm run preview -- --host 127.0.0.1 --port 4104
```

Open `http://127.0.0.1:4104/`. The browser demo uses local saves and stubbed platform/online boundaries unless release services are configured.

## Project Status

Archived/active portfolio project. The game code has a real gameplay loop and a substantial roadmap toward a Steam-style desktop release. Some docs are intentionally planning-heavy because they were used to coordinate feature, quality, and release-readiness passes.

## Notes

- The product title remains **Skyfall**.
- The repository name is descriptive for GitHub/LinkedIn discovery.
- Online and Steam-facing integrations are boundary/stub oriented unless configured for a real release environment.

## Cloudflare Pages

- Pages project name: `skyfall`
- GitHub repository: `BorisThoris/skyfall`
- Production branch: `master`
- Root directory: `.`
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `NODE_VERSION=22.16.0`
- Public URL target: `https://skyfall-bas.pages.dev/`

Do not enable Cloudflare Access for the demo deployment. Leave frame-blocking headers unset so the portfolio can iframe the public build.
