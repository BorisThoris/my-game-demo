# Skyfall — parallel agent tasks

| Wave | Agents | Doc |
|------|--------|-----|
| **Lean** | **01–20** | [`docs/SKYFALL_LEAN_FEATURES.md`](../docs/SKYFALL_LEAN_FEATURES.md) |
| **Gap / shipping** | **21–39** | [`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) |
| **Fully fledged** | **40–54** | [`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md) |

**Formula research:** [`docs/POPULAR_SIMPLE_GAMES_FORMULA.md`](../docs/POPULAR_SIMPLE_GAMES_FORMULA.md)

**Many chats in parallel:** [`PARALLEL_EXECUTION.md`](./PARALLEL_EXECUTION.md) + [`launch/`](./launch/) (wave files + `serial/` + `ui-serial/` for `launch_task_agents.sh`).

**Who claimed which task:** [`AGENT_BOARD.md`](./AGENT_BOARD.md) (status + claim column for chats).

**Lean QA (AGENT-20):** On 2026-03-28, `npm test`, `npm run test:e2e` (chromium), and `npm run build` completed successfully for lean **01–13**, **16–20** (integration pass: meta hint UI, game-over banner/PB HUD, `meta_lifetime_100`, duplicate contract event fix, `e2e/boot.spec.js` click coords for shifted main menu). Agents **14–15** remain **blocked** pending product approval.

Assign **one autonomous agent per `AGENT-XX-*.md` file**. Respect dependency groups.

---

## Dependency groups

| Group | Tasks | Note |
|-------|-------|------|
| **A — Lean Tier A** | 01–06 | 04 before 03 if both touch game-over layout. |
| **B — Lean Tier B** | 07–10 | 09 vs 02: coordinate achievements. |
| **C — Safe strips** | 11–13 | Orphan scenes; editor gate; online audit. |
| **D — Optional strips** | 14–15 | **Product approval** required. |
| **E — Lean polish / QA** | 16–20 | **20** last for lean wave. |
| **F — Platform / economy truth** | 21–26 | Electron → **22** Steam; **24** resolution vs **16** HUD. |
| **G — Online UX / a11y / content** | 27–34 | **28** + **30** after **22** ideal; **29** + **37** privacy. |
| **H — Docs / QA / editor** | 35–39 | **36** after big UI merges. |
| **I — Content & feel** | **40–43** | **40** plan → **41** tune; **42**/**43** sensory. |
| **J — Discovery** | **44–45** | Store assets + trailer. |
| **K — Input / locale / perf** | **46–48** | **46** after **27** ideal; **48** informs **44** min spec. |
| **L — Ship & trust** | **49–53** | CI → playtest → integrity → Steam parity → ratings. |
| **M — Optional flavor** | **54** | Skip for pure abstract game. |

---

## Task index — 01–20 (lean)

| ID | File | Summary |
|----|------|---------|
| 01 | [`AGENT-01-contract-pool.md`](./AGENT-01-contract-pool.md) | New daily contract definitions + metrics |
| 02 | [`AGENT-02-achievements.md`](./AGENT-02-achievements.md) | 3–5 new achievements + hooks |
| 03 | [`AGENT-03-next-unlock-hint.md`](./AGENT-03-next-unlock-hint.md) | Next meta unlock hint |
| 04 | [`AGENT-04-game-over-meta-framing.md`](./AGENT-04-game-over-meta-framing.md) | Prominent meta on game over |
| 05 | [`AGENT-05-personal-best-summary.md`](./AGENT-05-personal-best-summary.md) | PB score/time per mode |
| 06 | [`AGENT-06-risk-pickup.md`](./AGENT-06-risk-pickup.md) | Single risk pickup |
| 07 | [`AGENT-07-meta-nodes.md`](./AGENT-07-meta-nodes.md) | 2–3 meta nodes |
| 08 | [`AGENT-08-daily-modifier.md`](./AGENT-08-daily-modifier.md) | Rotating daily modifier |
| 09 | [`AGENT-09-perk-tags-feats.md`](./AGENT-09-perk-tags-feats.md) | Perk tags + feats |
| 10 | [`AGENT-10-post-run-tips.md`](./AGENT-10-post-run-tips.md) | Contextual tip on death |
| 11 | [`AGENT-11-remove-orphan-scenes.md`](./AGENT-11-remove-orphan-scenes.md) | Delete orphan scenes |
| 12 | [`AGENT-12-editor-production-gate.md`](./AGENT-12-editor-production-gate.md) | Gate `#/editor` prod |
| 13 | [`AGENT-13-online-telemetry-audit.md`](./AGENT-13-online-telemetry-audit.md) | Online + telemetry audit |
| 14 | [`AGENT-14-optional-remove-game-mode.md`](./AGENT-14-optional-remove-game-mode.md) | Remove one mode (approval) |
| 15 | [`AGENT-15-optional-remove-objectives.md`](./AGENT-15-optional-remove-objectives.md) | Remove objectives (approval) |
| 16 | [`AGENT-16-hud-clarity-formula-checklist.md`](./AGENT-16-hud-clarity-formula-checklist.md) | HUD clarity |
| 17 | [`AGENT-17-session-restart-audit.md`](./AGENT-17-session-restart-audit.md) | Session / restart |
| 18 | [`AGENT-18-tier-c-deferrals.md`](./AGENT-18-tier-c-deferrals.md) | DEFERRED_FEATURES doc |
| 19 | [`AGENT-19-ui-trim-gameover-options.md`](./AGENT-19-ui-trim-gameover-options.md) | UI trim |
| 20 | [`AGENT-20-qa-regression.md`](./AGENT-20-qa-regression.md) | QA regression |

## Task index — 21–39 (gap / shipping)

| ID | File | Summary |
|----|------|---------|
| 21 | [`AGENT-21-electron-ipc-bridge.md`](./AGENT-21-electron-ipc-bridge.md) | Electron IPC |
| 22 | [`AGENT-22-steamworks-wiring.md`](./AGENT-22-steamworks-wiring.md) | Steam adapter wiring |
| 23 | [`AGENT-23-cloud-save-merge.md`](./AGENT-23-cloud-save-merge.md) | Full cloud merge |
| 24 | [`AGENT-24-resolution-display-truth.md`](./AGENT-24-resolution-display-truth.md) | Resolution honest |
| 25 | [`AGENT-25-meta-currency-fragments-clarity.md`](./AGENT-25-meta-currency-fragments-clarity.md) | Currency vs fragments |
| 26 | [`AGENT-26-progression-tier-visibility.md`](./AGENT-26-progression-tier-visibility.md) | Tier visibility |
| 27 | [`AGENT-27-key-rebinding.md`](./AGENT-27-key-rebinding.md) | Key rebind |
| 28 | [`AGENT-28-leaderboard-ui.md`](./AGENT-28-leaderboard-ui.md) | Leaderboard UI |
| 29 | [`AGENT-29-telemetry-upload-privacy.md`](./AGENT-29-telemetry-upload-privacy.md) | Telemetry + privacy |
| 30 | [`AGENT-30-offline-adapter-honesty-ui.md`](./AGENT-30-offline-adapter-honesty-ui.md) | Offline honesty UI |
| 31 | [`AGENT-31-accessibility-presentation-pass.md`](./AGENT-31-accessibility-presentation-pass.md) | A11y + presentation |
| 32 | [`AGENT-32-audio-load-failure-ux.md`](./AGENT-32-audio-load-failure-ux.md) | Audio failure UX |
| 33 | [`AGENT-33-tutorial-onboarding-pass.md`](./AGENT-33-tutorial-onboarding-pass.md) | Tutorial pass |
| 34 | [`AGENT-34-credits-third-party-licenses.md`](./AGENT-34-credits-third-party-licenses.md) | Credits / licenses |
| 35 | [`AGENT-35-doc-drift-steam-app-analysis.md`](./AGENT-35-doc-drift-steam-app-analysis.md) | Doc drift refresh |
| 36 | [`AGENT-36-e2e-deep-flows.md`](./AGENT-36-e2e-deep-flows.md) | Deep E2E |
| 37 | [`AGENT-37-about-privacy-support.md`](./AGENT-37-about-privacy-support.md) | About / privacy |
| 38 | [`AGENT-38-fullscreen-qa-matrix.md`](./AGENT-38-fullscreen-qa-matrix.md) | Fullscreen QA |
| 39 | [`AGENT-39-editor-mvp-or-defer.md`](./AGENT-39-editor-mvp-or-defer.md) | Editor MVP or defer |

## Task index — 40–54 (fully fledged)

| ID | File | Axes (see fully fledged doc) |
|----|------|------------------------------|
| 40 | [`AGENT-40-content-breadth-matrix.md`](./AGENT-40-content-breadth-matrix.md) | B — content volume |
| 41 | [`AGENT-41-balance-pacing-pass.md`](./AGENT-41-balance-pacing-pass.md) | A, C — loop + balance |
| 42 | [`AGENT-42-audio-production-pass.md`](./AGENT-42-audio-production-pass.md) | D — audio |
| 43 | [`AGENT-43-visual-readability-pass.md`](./AGENT-43-visual-readability-pass.md) | D — visual |
| 44 | [`AGENT-44-steam-store-press-kit.md`](./AGENT-44-steam-store-press-kit.md) | G — store |
| 45 | [`AGENT-45-trailer-capture-workflow.md`](./AGENT-45-trailer-capture-workflow.md) | G — trailer |
| 46 | [`AGENT-46-gamepad-steam-input.md`](./AGENT-46-gamepad-steam-input.md) | H — gamepad |
| 47 | [`AGENT-47-localization-i18n-foundation.md`](./AGENT-47-localization-i18n-foundation.md) | H — i18n |
| 48 | [`AGENT-48-performance-min-spec.md`](./AGENT-48-performance-min-spec.md) | I — perf |
| 49 | [`AGENT-49-ci-cd-release-engineering.md`](./AGENT-49-ci-cd-release-engineering.md) | J — CI/release |
| 50 | [`AGENT-50-playtest-feedback-program.md`](./AGENT-50-playtest-feedback-program.md) | K — playtest |
| 51 | [`AGENT-51-integrity-save-leaderboards.md`](./AGENT-51-integrity-save-leaderboards.md) | L — integrity |
| 52 | [`AGENT-52-steam-partner-achievement-parity.md`](./AGENT-52-steam-partner-achievement-parity.md) | M — Steam parity |
| 53 | [`AGENT-53-ratings-regional-compliance.md`](./AGENT-53-ratings-regional-compliance.md) | M — ratings |
| 54 | [`AGENT-54-lore-flavor-pass.md`](./AGENT-54-lore-flavor-pass.md) | N — lore (optional) |

---

## Challenge / “QTE” constraint

**Do not remove** `ChallengeDirector` timed beats or perk **1/2/3** unless product overrides [`docs/SKYFALL_LEAN_FEATURES.md`](../docs/SKYFALL_LEAN_FEATURES.md).

---

## Optional code strips (not gap / not fully fledged)

[`BACKLOG-OPTIONAL-STRIPS.md`](./BACKLOG-OPTIONAL-STRIPS.md) — promote to **AGENT-55+** if approved.

## Still outside *any* agent (by design)

Marketing spend, paid influencers, live ops seasons, legal retainers—**process**, not repo tasks. See [`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md) §6.
