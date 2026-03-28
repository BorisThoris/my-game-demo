# Agent board — who is on what

**Purpose:** One place for chats/agents to see **which `AGENT-NN` tasks are free** and to **claim** a row before working. Higher-level than the per-task specs.

**Spec for work:** always follow the linked `AGENT-NN-*.md` file for that row.

**Merge / conflict rules:** still follow [`PARALLEL_EXECUTION.md`](./PARALLEL_EXECUTION.md) and [`COLLISION_MATRIX.md`](./COLLISION_MATRIX.md). This board does **not** replace git worktrees (`./scripts/agents/launch_task_agents.sh`).

---

## How to use (humans + Cursor)

1. **Before starting:** open this file. Find a row with **Status** = `open` (or empty **Claimed by**).
2. **Claim:** set **Status** to `active`, set **Claimed by** to something unique (your name, chat label, `cursor-<date>`, etc.), set **Updated (UTC)** to today’s date/time, optionally add **Notes** (e.g. branch `agent/agent-07`).
3. **While working:** keep **Worktree** accurate if you use `.agents/agent-NN` (see launch script).
4. **Done:** set **Status** to `done` when merged to `main` (or `abandoned` if dropped), clear or keep **Claimed by** for history, update **Updated (UTC)**.
5. **Blocked:** set **Status** to `blocked` and explain in **Notes**; don’t leave it `active` if you stopped.
6. **Concurrent edits:** if two chats edit the same row, reconcile in git like any other file. Prefer **one claim per chat**.

### Status values

| Value | Meaning |
|--------|---------|
| `open` | No one owns it right now — OK to claim. |
| `active` | Someone is implementing it — don’t take without coordinating. |
| `blocked` | Waiting on dependency / decision (see Notes). |
| `done` | Landed on `main` (or intentionally closed). |
| `abandoned` | Stopped; row free to reclaim after you clear **Claimed by**. |

---

## Board — lean (01–20)

| ID | Summary | Status | Claimed by | Worktree | Updated (UTC) | Notes |
|----|---------|--------|------------|----------|---------------|-------|
| [01](./AGENT-01-contract-pool.md) | Daily contracts + metrics | done | cursor-lean-wave | `.agents/agent-01` | 2026-03-28 | Added Chain Artist + Spark Hunter; megaChain/gambitPickup + tests |
| [02](./AGENT-02-achievements.md) | Achievements + hooks | done | cursor-lean-wave | `.agents/agent-02` | 2026-03-28 | Milestones 400/500, meta, feats, gambit, demolisher |
| [03](./AGENT-03-next-unlock-hint.md) | Next meta unlock hint | done | cursor-lean-wave | `.agents/agent-03` | 2026-03-28 | `getNextUnlockHint` + meta scene + game over |
| [04](./AGENT-04-game-over-meta-framing.md) | Meta framing on game over | done | cursor-lean-wave | `.agents/agent-04` | 2026-03-28 | Prominent meta/contracts recap lines |
| [05](./AGENT-05-personal-best-summary.md) | PB score/time per mode | done | cursor-lean-wave | `.agents/agent-05` | 2026-03-28 | `setBestSurvivalSeconds` + game over PB |
| [06](./AGENT-06-risk-pickup.md) | Risk pickup | done | cursor-lean-wave | `.agents/agent-06` | 2026-03-28 | `gambit` pickup + `risk_gambit` achievement |
| [07](./AGENT-07-meta-nodes.md) | Meta nodes | done | cursor-lean-wave | `.agents/agent-07` | 2026-03-28 | 8-node tree incl. `arc-stabilizer`; effects apply |
| [08](./AGENT-08-daily-modifier.md) | Daily modifier | done | cursor-lean-wave | `.agents/agent-08` | 2026-03-28 | `applyDailyModifier` + menu line + fall speed scale |
| [09](./AGENT-09-perk-tags-feats.md) | Perk tags + feats | done | cursor-lean-wave | `.agents/agent-09` | 2026-03-28 | `getPerkFeatTags` + triad / pure mobility feats |
| [10](./AGENT-10-post-run-tips.md) | Post-run tips | done | cursor-lean-wave | `.agents/agent-10` | 2026-03-28 | `app/config/runTips.js` on game over |
| [11](./AGENT-11-remove-orphan-scenes.md) | Remove orphan scenes | done | cursor-agent-11 | `.agents/agent-11` | 2026-03-28 | Portfolio hub + websites.js removed |
| [12](./AGENT-12-editor-production-gate.md) | Editor prod gate | done | cursor-wave02 | `.agents/agent-12` | 2026-03-28 | DEV-only editor + loading gate |
| [13](./AGENT-13-online-telemetry-audit.md) | Online + telemetry audit | done | cursor-agent-13 | `.agents/agent-13` | 2026-03-28 | `docs/ONLINE_TELEMETRY.md` + dev-only debug |
| [14](./AGENT-14-optional-remove-game-mode.md) | Optional: remove mode | blocked | — | `.agents/agent-14` | 2026-03-28 | Awaiting explicit product approval (do not implement). |
| [15](./AGENT-15-optional-remove-objectives.md) | Optional: remove objectives | blocked | — | `.agents/agent-15` | 2026-03-28 | Awaiting explicit product approval (do not implement). |
| [16](./AGENT-16-hud-clarity-formula-checklist.md) | HUD clarity | done | cursor-lean-wave | `.agents/agent-16` | 2026-03-28 | Score/pressure copy; heat phase bar hint |
| [17](./AGENT-17-session-restart-audit.md) | Session / restart | done | cursor-handoff | `.agents/agent-17` | 2026-03-28 | R/Space replay; `docs/SESSION_RESTART.md` |
| [18](./AGENT-18-tier-c-deferrals.md) | Tier C deferrals doc | done | cursor-wave01-01 | `.agents/agent-18` | 2026-03-28 | Landed `docs/DEFERRED_FEATURES.md` |
| [19](./AGENT-19-ui-trim-gameover-options.md) | UI trim / game over | done | cursor-lean-wave | `.agents/agent-19` | 2026-03-28 | Compact challenge summary; options had no dead rows |
| [20](./AGENT-20-qa-regression.md) | QA regression (lean) | done | cursor-lean-wave | `.agents/agent-20` | 2026-03-28 | `npm test`, `npm run test:e2e`, `npm run build` OK; boot.spec Play/Achievements coords for menu layout |

## Board — gap / shipping (21–39)

| ID | Summary | Status | Claimed by | Worktree | Updated (UTC) | Notes |
|----|---------|--------|------------|----------|---------------|-------|
| [21](./AGENT-21-electron-ipc-bridge.md) | Electron IPC | done | cursor-wave-lean | `.agents/agent-21` | 2026-03-28 | `skyfallElectron` + userData path |
| [22](./AGENT-22-steamworks-wiring.md) | Steam wiring | open | — | `.agents/agent-22` | — | After 21. |
| [23](./AGENT-23-cloud-save-merge.md) | Cloud save merge | open | — | `.agents/agent-23` | — | Serialize vs 25 on save. |
| [24](./AGENT-24-resolution-display-truth.md) | Resolution / display truth | open | — | `.agents/agent-24` | — | — |
| [25](./AGENT-25-meta-currency-fragments-clarity.md) | Currency / fragments clarity | open | — | `.agents/agent-25` | — | After 23 ideal. |
| [26](./AGENT-26-progression-tier-visibility.md) | Tier visibility | open | — | `.agents/agent-26` | — | — |
| [27](./AGENT-27-key-rebinding.md) | Key rebind | open | — | `.agents/agent-27` | — | Before 46 ideal. |
| [28](./AGENT-28-leaderboard-ui.md) | Leaderboard UI | open | — | `.agents/agent-28` | — | After 22 ideal. |
| [29](./AGENT-29-telemetry-upload-privacy.md) | Telemetry + privacy | done | cursor-handoff | `.agents/agent-29` | 2026-03-28 | Consent + `VITE_TELEMETRY_ENDPOINT`; `docs/TELEMETRY.md` |
| [30](./AGENT-30-offline-adapter-honesty-ui.md) | Offline honesty UI | done | cursor-handoff | `.agents/agent-30` | 2026-03-28 | Main menu online line |
| [31](./AGENT-31-accessibility-presentation-pass.md) | A11y presentation | done | cursor-wave-lean | `.agents/agent-31` | 2026-03-28 | Safe mode + `ACCESSIBILITY.md` |
| [32](./AGENT-32-audio-load-failure-ux.md) | Audio load failure UX | open | — | `.agents/agent-32` | — | — |
| [33](./AGENT-33-tutorial-onboarding-pass.md) | Tutorial / onboarding | open | — | `.agents/agent-33` | — | — |
| [34](./AGENT-34-credits-third-party-licenses.md) | Credits / licenses | done | cursor-wave02 | `.agents/agent-34` | 2026-03-28 | Third-party block in Credits |
| [35](./AGENT-35-doc-drift-steam-app-analysis.md) | Doc drift / Steam app | done | cursor-wave01-02 | `.agents/agent-35` | 2026-03-28 | Landed Steam/app analysis refresh |
| [36](./AGENT-36-e2e-deep-flows.md) | Deep E2E | done | cursor-wave-lean | `.agents/agent-36` | 2026-03-28 | `e2e/deep-flows.spec.js` + options scene.start |
| [37](./AGENT-37-about-privacy-support.md) | About / privacy / support | done | cursor-handoff | `.agents/agent-37` | 2026-03-28 | `aboutScene` + `externalLinks.js` |
| [38](./AGENT-38-fullscreen-qa-matrix.md) | Fullscreen QA | done | cursor-wave02 | `.agents/agent-38` | 2026-03-28 | `docs/FULLSCREEN_QA.md` |
| [39](./AGENT-39-editor-mvp-or-defer.md) | Editor MVP or defer | done | cursor-wave02 | `.agents/agent-39` | 2026-03-28 | Path B + `docs/EDITOR.md` |

## Board — fully fledged (40–54)

| ID | Summary | Status | Claimed by | Worktree | Updated (UTC) | Notes |
|----|---------|--------|------------|----------|---------------|-------|
| [40](./AGENT-40-content-breadth-matrix.md) | Content breadth matrix | done | cursor-wave01-03 | `.agents/agent-40` | 2026-03-28 | Landed `docs/CONTENT_MATRIX.md` |
| [41](./AGENT-41-balance-pacing-pass.md) | Balance / pacing | open | — | `.agents/agent-41` | — | — |
| [42](./AGENT-42-audio-production-pass.md) | Audio production | open | — | `.agents/agent-42` | — | — |
| [43](./AGENT-43-visual-readability-pass.md) | Visual readability | open | — | `.agents/agent-43` | — | — |
| [44](./AGENT-44-steam-store-press-kit.md) | Steam store / press | done | cursor-wave01-04 | `.agents/agent-44` | 2026-03-28 | Landed checklist + `docs/PRESS_KIT.md` |
| [45](./AGENT-45-trailer-capture-workflow.md) | Trailer workflow | done | cursor-wave01-05 | `.agents/agent-45` | 2026-03-28 | Landed `docs/TRAILER_NOTES.md` + `marketing/` gitignore |
| [46](./AGENT-46-gamepad-steam-input.md) | Gamepad / Steam Input | open | — | `.agents/agent-46` | — | After 27 ideal. |
| [47](./AGENT-47-localization-i18n-foundation.md) | i18n foundation | open | — | `.agents/agent-47` | — | — |
| [48](./AGENT-48-performance-min-spec.md) | Performance / min spec | open | — | `.agents/agent-48` | — | — |
| [49](./AGENT-49-ci-cd-release-engineering.md) | CI / release | done | cursor-handoff | `.agents/agent-49` | 2026-03-28 | `.github/workflows/ci.yml` + `docs/RELEASE.md` + `CHANGELOG.md` |
| [50](./AGENT-50-playtest-feedback-program.md) | Playtest program | done | cursor-wave01-06 | `.agents/agent-50` | 2026-03-28 | Landed `docs/PLAYTEST.md` (sample cycle hypothetical) |
| [51](./AGENT-51-integrity-save-leaderboards.md) | Integrity / saves | done | cursor-wave01-07 | `.agents/agent-51` | 2026-03-28 | Landed `docs/INTEGRITY.md` |
| [52](./AGENT-52-steam-partner-achievement-parity.md) | Steam partner parity | done | cursor-wave01-08 | `.agents/agent-52` | 2026-03-28 | Landed `docs/STEAM_PARTNER_PARITY.md` |
| [53](./AGENT-53-ratings-regional-compliance.md) | Ratings / compliance | done | cursor-wave01-09 | `.agents/agent-53` | 2026-03-28 | Landed `docs/RATING.md` |
| [54](./AGENT-54-lore-flavor-pass.md) | Lore / flavor (optional) | done | cursor-wave01-10 | `.agents/agent-54` | 2026-03-28 | Landed `docs/WORLD.md` + menu tagline |

---

## Changelog (optional)

Append a line when you do a bulk reset or housekeeping:

- `2026-03-28` — **Lean 01–10, 16–20** closed on integration pass (contracts, meta/daily/game-over/HUD, gambit pickup, QA); **14–15** left `blocked` (product approval).
- `2026-03-28` — **AGENT-13** online/telemetry audit doc; `[online]` debug logs gated to Vite DEV.
- `2026-03-28` — **AGENT-11** orphan portfolio scenes removed; `websites.js` removed; docs updated.
- `2026-03-28` — wave 02 (agents **12, 34, 38, 39**) completed; editor prod gate, credits notices, fullscreen QA doc, editor defer.
- `2026-03-28` — wave 01 (agents **18, 35, 40, 44, 45, 50, 51, 52, 53, 54**) completed in parallel; board rows set `done`.
- `2026-03-28` — **AGENT-17, 29, 30, 37, 49** — restart keys, telemetry consent + docs, About/links, CI + release doc + changelog.
- _Example: `2026-03-27` — reset all rows to `open` after shipping v1._
