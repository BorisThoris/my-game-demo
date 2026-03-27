# Steam-Ready Gap Analysis & Expansion Plan

**Goal:** Turn the current game into a **nice, monetizable Steam title** (small price).  
**Scope:** What’s missing or bad today, and what to expand.

**Living pointers:** [`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](docs/GAP_ANALYSIS_BEYOND_TASKS.md) (§2–7, §10 task map) · [`tasks/README.md`](tasks/README.md) (gap wave **AGENT-21–39**).

---

### Resolved since 2024–2026

**As of 2026-03-28**, these items from older audits are **implemented on the live path** (Loading → MainMenu → game/menus). Do not re-open them unless you are working in **legacy/orphan** files still on disk.

| Area | Status |
|------|--------|
| **Options / settings** | Options scene: audio, fullscreen, resolution/quality row, accessibility toggles, controls **shown**, build **version** in UI. |
| **Pause + quit to menu** | Dodge run supports pause and return to main menu. |
| **Achievements (in-game)** | Achievements scene + unlock plumbing; **Valve-side** achievements still need Steam adapter ([`AGENT-22`](tasks/AGENT-22-steamworks-wiring.md)). |
| **Meta progression & structured save** | Save manager, meta shop, contracts, modes/progression beyond a single `localStorage` high score key. |
| **Modes, challenges, perks, objectives, bosses** | Core loop matches the “substantial” row in [`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](docs/GAP_ANALYSIS_BEYOND_TASKS.md) §1 — not a single bare endless mode only. |
| **Loading scene** | [`app/scenes/loadingScene.js`](app/scenes/loadingScene.js): branded loading + progress bar; `#/editor` can route to editor after load. |
| **Identity (shipping shell)** | [`index.html`](index.html): title **Skyfall**, product tagline, [`favicon.svg`](favicon.svg). |
| **Electron wrapper** | [`electron/main.js`](electron/main.js) + `npm run electron:dev` / `electron:build`. **IPC beyond quit** → [`AGENT-21`](tasks/AGENT-21-electron-ipc-bridge.md). |
| **Build metadata** | [`package.json`](package.json) `name` / `version`; surfaced in Options. |
| **Run summary / game over** | Lean tasks expanded summaries; further polish may remain in individual AGENT-01–20 items. |

**Checklist (quick):** options · pause · in-game achievements · Electron shell · favicon · loading · meta/modes depth · version in UI · structured local save · main-menu-first flow.

---

### Still open (align with gap analysis §2–5)

Prioritize using this table and [`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](docs/GAP_ANALYSIS_BEYOND_TASKS.md), not Part 1–4 alone.

| Theme | Gap (short) | Tasks |
|-------|-------------|--------|
| Electron bridge | Preload exposes only quit; no Steam/paths/window-controls IPC | [`AGENT-21`](tasks/AGENT-21-electron-ipc-bridge.md) |
| Steam / online adapter | `setOnlineAdapter` not wired; local adapter no-ops “success” | [`AGENT-22`](tasks/AGENT-22-steamworks-wiring.md), [`AGENT-13`](tasks/AGENT-13-online-telemetry-audit.md) |
| Cloud merge | Partial merge vs full save payload | [`AGENT-23`](tasks/AGENT-23-cloud-save-merge.md) |
| Resolution truth | Option saved; canvas/layout not clearly tied to setting | [`AGENT-24`](tasks/AGENT-24-resolution-display-truth.md) |
| `metaCurrency` vs `metaFragments` | Dual economy / UI confusion | [`AGENT-25`](tasks/AGENT-25-meta-currency-fragments-clarity.md) |
| `lastCompletedLevel` visibility | Opaque to players | [`AGENT-26`](tasks/AGENT-26-progression-tier-visibility.md) |
| Key rebinding | No persisted custom keys | [`AGENT-27`](tasks/AGENT-27-key-rebinding.md) |
| Leaderboard UI | No scene consuming `getLeaderboardEntries` | [`AGENT-28`](tasks/AGENT-28-leaderboard-ui.md) |
| Telemetry upload + privacy | Hook / opt-in / disclosure | [`AGENT-29`](tasks/AGENT-29-telemetry-upload-privacy.md) |
| Offline honesty UI | Clarify local vs networked features | [`AGENT-30`](tasks/AGENT-30-offline-adapter-honesty-ui.md) |
| A11y + presentation | Beyond baseline sliders | [`AGENT-31`](tasks/AGENT-31-accessibility-presentation-pass.md) |
| Audio load failures | Player-visible retry/messaging broadly | [`AGENT-32`](tasks/AGENT-32-audio-load-failure-ux.md) |
| Tutorial / onboarding | Depth / optional strips | [`AGENT-33`](tasks/AGENT-33-tutorial-onboarding-pass.md) |
| Credits / third-party | Notices pipeline | [`AGENT-34`](tasks/AGENT-34-credits-third-party-licenses.md) |
| Deep E2E | Long flows untested in automation | [`AGENT-36`](tasks/AGENT-36-e2e-deep-flows.md) |
| About / privacy / support | In-game compliance surface | [`AGENT-37`](tasks/AGENT-37-about-privacy-support.md) |
| Fullscreen QA | Platform matrix | [`AGENT-38`](tasks/AGENT-38-fullscreen-qa-matrix.md) |
| Editor | Placeholder vs MVP vs defer | [`AGENT-39`](tasks/AGENT-39-editor-mvp-or-defer.md), [`AGENT-12`](tasks/AGENT-12-editor-production-gate.md) |
| Orphan portfolio scenes / stale copy | Files may remain **off** [`app/index.js`](app/index.js) boot order | [`AGENT-11`](tasks/AGENT-11-remove-orphan-scenes.md) |

**This doc refresh:** [`AGENT-35`](tasks/AGENT-35-doc-drift-steam-app-analysis.md).

---

## Part 1 — Residual risks & legacy files (not “current state” from 2024)

> **Read `Resolved since 2024–2026` and `Still open` first.** Part 1 below calls out **what can still bite** (Steam, orphan files, legal) and **what used to be true** before the main-menu stack.

### 1.1 Identity & Branding (Critical)

| Issue | Where | Fix |
|-------|--------|-----|
| **Stale name / copy in orphan files** | *(Mitigated)* Portfolio orphan scenes **removed** ([`AGENT-11`](tasks/AGENT-11-remove-orphan-scenes.md)); verify [`index.html`](index.html) + player-facing scenes only. |
| **Portfolio scenes off the live path** | Introduction / choice / websites scenes may still exist on disk with CV/portfolio tone. | Delete or quarantine; live menu is game-focused ([`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](docs/GAP_ANALYSIS_BEYOND_TASKS.md) §6). |

---

### 1.2 Platform & Distribution (Critical for Steam)

| Issue | Where | Fix |
|-------|--------|-----|
| **Steamworks** | No wired Steam SDK in repo. | [`AGENT-22`](tasks/AGENT-22-steamworks-wiring.md) + [`AGENT-21`](tasks/AGENT-21-electron-ipc-bridge.md). |
| **Cloud parity** | Local save is rich; **remote** merge and Steam Cloud are not production-complete. | [`AGENT-23`](tasks/AGENT-23-cloud-save-merge.md). |
| **Shippable desktop build** | **Done (baseline):** Electron wraps Vite build. | Still need Steam pipe + signed builds for store ([`tasks/README.md`](tasks/README.md) **AGENT-44+**). |

---

### 1.3 Settings & Options (High)

| Issue | Where | Fix |
|-------|--------|-----|
| **Key rebinding** | Bindings shown; **custom** keys not persisted. | [`AGENT-27`](tasks/AGENT-27-key-rebinding.md). |
| **Resolution honesty** | Setting stored; Phaser canvas/layout linkage incomplete per trace. | [`AGENT-24`](tasks/AGENT-24-resolution-display-truth.md). |

---

### 1.4 Onboarding & UX (High)

| Issue | Where | Fix |
|-------|--------|-----|
| **Tutorial depth** | Tutorial scene exists; optional strips / depth are product calls. | [`AGENT-33`](tasks/AGENT-33-tutorial-onboarding-pass.md). |
| **Game over / run summary polish** | Improved vs 2024 baseline; keep aligning with lean/gap tasks. | [`tasks/README.md`](tasks/README.md) **AGENT-01–20** as needed. |

---

### 1.5 Content & Replayability (Medium–High)

| Issue | Where | Fix |
|-------|--------|-----|
| **Leaderboards in UI** | Scores may be submitted; **no** in-game board. | [`AGENT-28`](tasks/AGENT-28-leaderboard-ui.md). |
| **Steam achievements** | In-game list ≠ Steam partner unlocks until adapter lands. | [`AGENT-22`](tasks/AGENT-22-steamworks-wiring.md). |
| **Content expansion** | More perks/modes/bosses = ongoing product work. | [`docs/FULLY_FLEDGED_EXPERIENCE.md`](docs/FULLY_FLEDGED_EXPERIENCE.md) / **AGENT-40+**. |

---

### 1.6 Polish & Accessibility (Medium)

| Issue | Where | Fix |
|-------|--------|-----|
| **Error handling breadth** | Loading scene has **Retry** on load error; dodge/asset paths may need the same rigor everywhere. | [`AGENT-32`](tasks/AGENT-32-audio-load-failure-ux.md) + general hardening. |
| **Fonts / a11y depth** | Baseline options exist; not a full commercial a11y pass. | [`AGENT-31`](tasks/AGENT-31-accessibility-presentation-pass.md). |

---

### 1.7 Technical & Legal (Medium)

| Issue | Where | Fix |
|-------|--------|-----|
| **Dependency on GitHub** | `phaser3-juice-plugin` from `github:RetroVX/phaser3-juice-plugin`. | Pin exact commit/tag or **vendor** (see [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)). |
| **EULA / Privacy / support** | In-game surface still thin vs platform expectations. | [`AGENT-37`](tasks/AGENT-37-about-privacy-support.md). |
| **Mobile in Steam build** | Joystick overlay + mobile CSS still present in web shell. | [`AGENT-38`](tasks/AGENT-38-fullscreen-qa-matrix.md) / desktop polish. |

---

## Part 2 — What to Expand (Roadmap)

> **Status:** Many §2.1–2.2 bullets are **done** for web/Electron (see **Resolved since 2024–2026**). Treat Part 2 as a **backlog narrative**; execution order = **Still open** + gap doc §11.

### 2.1 Must-Have for “Nice Game on Steam at a Small Price”

1. **Single, clear identity** — **Largely done** on boot path; finish orphan file cleanup ([`AGENT-11`](tasks/AGENT-11-remove-orphan-scenes.md)).
2. **Desktop + Steam** — Electron **done**; **Steamworks** + IPC **open** ([`AGENT-21`](tasks/AGENT-21-electron-ipc-bridge.md), [`AGENT-22`](tasks/AGENT-22-steamworks-wiring.md)).
3. **Options** — **Done** baseline; **rebind** + **resolution truth** open ([`AGENT-27`](tasks/AGENT-27-key-rebinding.md), [`AGENT-24`](tasks/AGENT-24-resolution-display-truth.md)).
4. **Pause + Quit** — **Done**.
5. **Correct copy & flow** — Live flow uses main menu; verify **orphan** files if retained.
6. **Save system** — **Local structured save done**; **cloud merge** open ([`AGENT-23`](tasks/AGENT-23-cloud-save-merge.md)).
7. **Store presence** — Marketing / Steamworks partner work (**AGENT-44+**, not gap 21–39 core).

---

### 2.2 Should-Have (More Value for Price)

1. **Achievements** — In-game **done**; Steam **open** ([`AGENT-22`](tasks/AGENT-22-steamworks-wiring.md)).
2. **Leaderboards** — Submit path exists; **UI** open ([`AGENT-28`](tasks/AGENT-28-leaderboard-ui.md)).
3. **Loading & errors** — Loading **done**; broaden failure UX ([`AGENT-32`](tasks/AGENT-32-audio-load-failure-ux.md)).
4. **Run summary** — **Improved**; iterate with product.
5. **Difficulty or mode** — **Multiple modes/features** exist; balance/expansion = ongoing.
6. **Credits** — Scene exists; **license** rigor ([`AGENT-34`](tasks/AGENT-34-credits-third-party-licenses.md)).

---

### 2.3 Nice-to-Have (Polish)

1. **Tutorial** — [`AGENT-33`](tasks/AGENT-33-tutorial-onboarding-pass.md).
2. **More content** — **AGENT-40+**.
3. **Meta-progression** — Present; economy clarity ([`AGENT-25`](tasks/AGENT-25-meta-currency-fragments-clarity.md)).
4. **Accessibility** — [`AGENT-31`](tasks/AGENT-31-accessibility-presentation-pass.md).
5. **Font & icon** — Favicon **done**; font pipeline / Steam art = **AGENT-43+** / **AGENT-44+**.

---

## Part 3 — Summary Tables (archive; prefer sections at top)

### What’s bad or missing (by area) — 2026 lens

| Area | Severity | Items |
|------|----------|--------|
| Identity / branding | Critical (if orphans remain) | Stale Interval Dodger / portfolio copy in **non-boot** files |
| Platform / Steam | Critical | Steamworks wiring, cloud merge, IPC |
| Settings | Medium | Rebind, resolution truth |
| Onboarding / UX | Low–Medium | Tutorial depth, long-tail polish |
| Content / replay | Medium | Leaderboard UI, Steam achievement parity |
| Polish / a11y | Medium | Error surfacing, font/a11y pass |
| Technical / legal | Medium | Juice pin, privacy/support surfacing |

### What to expand (priority) — 2026 lens

| Priority | Expansion |
|----------|-----------|
| **P0** | **Still open** table: **AGENT-21–24**, **AGENT-22–23** Steam/cloud, **AGENT-11** orphans |
| **P1** | **AGENT-25–31**, **AGENT-28**, **AGENT-32**, **AGENT-37** |
| **P2** | **AGENT-33–34**, **AGENT-36**, **AGENT-38–39**, **AGENT-40+** |

---

## Part 4 — Suggested Next Steps

1. **Decide the product** — Positioning is closer to shipped; align store/comms with **Skyfall**.
2. **Close platform truth** — **AGENT-21 → 22 → 23 → 24** (dependency-aware).
3. **Economy + boards** — **AGENT-25**, **AGENT-28**, **AGENT-30**.
4. **Trust + compliance** — **AGENT-29**, **AGENT-37**, **AGENT-34**.
5. **QA depth** — **AGENT-36**, **AGENT-38**.
6. **Store assets** — **AGENT-44+** when ready.

**Canonical gap list:** [`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](docs/GAP_ANALYSIS_BEYOND_TASKS.md). **Task index:** [`tasks/README.md`](tasks/README.md).

---

## Part 5 — Telemetry Dashboard Baselines

A first telemetry pass is now defined for balance validation. Track these KPI baselines per build:

- **Median run length** (`run_end.runTimeMs` median).
- **First boss reach rate** (runs with a boss clear / runs started).
- **Challenge success rate** (successful `challenge_performance` / all challenge attempts).

Supporting implementation docs and scripts:
- `docs/TELEMETRY.md`
- `scripts/telemetry/aggregateTelemetry.js`

These KPIs should be displayed as 7-day and 30-day trends, segmented by difficulty/mode once those are added.
