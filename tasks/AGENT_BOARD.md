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
| [01](./AGENT-01-contract-pool.md) | Daily contracts + metrics | open | — | `.agents/agent-01` | — | — |
| [02](./AGENT-02-achievements.md) | Achievements + hooks | open | — | `.agents/agent-02` | — | — |
| [03](./AGENT-03-next-unlock-hint.md) | Next meta unlock hint | open | — | `.agents/agent-03` | — | — |
| [04](./AGENT-04-game-over-meta-framing.md) | Meta framing on game over | open | — | `.agents/agent-04` | — | Merge before 03 if same layout. |
| [05](./AGENT-05-personal-best-summary.md) | PB score/time per mode | open | — | `.agents/agent-05` | — | — |
| [06](./AGENT-06-risk-pickup.md) | Risk pickup | open | — | `.agents/agent-06` | — | — |
| [07](./AGENT-07-meta-nodes.md) | Meta nodes | open | — | `.agents/agent-07` | — | — |
| [08](./AGENT-08-daily-modifier.md) | Daily modifier | open | — | `.agents/agent-08` | — | — |
| [09](./AGENT-09-perk-tags-feats.md) | Perk tags + feats | open | — | `.agents/agent-09` | — | Coordinate with 02 if overlap. |
| [10](./AGENT-10-post-run-tips.md) | Post-run tips | open | — | `.agents/agent-10` | — | — |
| [11](./AGENT-11-remove-orphan-scenes.md) | Remove orphan scenes | open | — | `.agents/agent-11` | — | — |
| [12](./AGENT-12-editor-production-gate.md) | Editor prod gate | done | cursor-wave02 | `.agents/agent-12` | 2026-03-28 | DEV-only editor + loading gate |
| [13](./AGENT-13-online-telemetry-audit.md) | Online + telemetry audit | open | — | `.agents/agent-13` | — | — |
| [14](./AGENT-14-optional-remove-game-mode.md) | Optional: remove mode | open | — | `.agents/agent-14` | — | Product approval. |
| [15](./AGENT-15-optional-remove-objectives.md) | Optional: remove objectives | open | — | `.agents/agent-15` | — | Product approval. |
| [16](./AGENT-16-hud-clarity-formula-checklist.md) | HUD clarity | open | — | `.agents/agent-16` | — | — |
| [17](./AGENT-17-session-restart-audit.md) | Session / restart | open | — | `.agents/agent-17` | — | — |
| [18](./AGENT-18-tier-c-deferrals.md) | Tier C deferrals doc | done | cursor-wave01-01 | `.agents/agent-18` | 2026-03-28 | Landed `docs/DEFERRED_FEATURES.md` |
| [19](./AGENT-19-ui-trim-gameover-options.md) | UI trim / game over | open | — | `.agents/agent-19` | — | — |
| [20](./AGENT-20-qa-regression.md) | QA regression (lean) | open | — | `.agents/agent-20` | — | Prefer after other lean gameplay. |

## Board — gap / shipping (21–39)

| ID | Summary | Status | Claimed by | Worktree | Updated (UTC) | Notes |
|----|---------|--------|------------|----------|---------------|-------|
| [21](./AGENT-21-electron-ipc-bridge.md) | Electron IPC | open | — | `.agents/agent-21` | — | Before 22. |
| [22](./AGENT-22-steamworks-wiring.md) | Steam wiring | open | — | `.agents/agent-22` | — | After 21. |
| [23](./AGENT-23-cloud-save-merge.md) | Cloud save merge | open | — | `.agents/agent-23` | — | Serialize vs 25 on save. |
| [24](./AGENT-24-resolution-display-truth.md) | Resolution / display truth | open | — | `.agents/agent-24` | — | — |
| [25](./AGENT-25-meta-currency-fragments-clarity.md) | Currency / fragments clarity | open | — | `.agents/agent-25` | — | After 23 ideal. |
| [26](./AGENT-26-progression-tier-visibility.md) | Tier visibility | open | — | `.agents/agent-26` | — | — |
| [27](./AGENT-27-key-rebinding.md) | Key rebind | open | — | `.agents/agent-27` | — | Before 46 ideal. |
| [28](./AGENT-28-leaderboard-ui.md) | Leaderboard UI | open | — | `.agents/agent-28` | — | After 22 ideal. |
| [29](./AGENT-29-telemetry-upload-privacy.md) | Telemetry + privacy | open | — | `.agents/agent-29` | — | — |
| [30](./AGENT-30-offline-adapter-honesty-ui.md) | Offline honesty UI | open | — | `.agents/agent-30` | — | — |
| [31](./AGENT-31-accessibility-presentation-pass.md) | A11y presentation | open | — | `.agents/agent-31` | — | — |
| [32](./AGENT-32-audio-load-failure-ux.md) | Audio load failure UX | open | — | `.agents/agent-32` | — | — |
| [33](./AGENT-33-tutorial-onboarding-pass.md) | Tutorial / onboarding | open | — | `.agents/agent-33` | — | — |
| [34](./AGENT-34-credits-third-party-licenses.md) | Credits / licenses | done | cursor-wave02 | `.agents/agent-34` | 2026-03-28 | Third-party block in Credits |
| [35](./AGENT-35-doc-drift-steam-app-analysis.md) | Doc drift / Steam app | done | cursor-wave01-02 | `.agents/agent-35` | 2026-03-28 | Landed Steam/app analysis refresh |
| [36](./AGENT-36-e2e-deep-flows.md) | Deep E2E | open | — | `.agents/agent-36` | — | After big UI merges ideal. |
| [37](./AGENT-37-about-privacy-support.md) | About / privacy / support | open | — | `.agents/agent-37` | — | — |
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
| [49](./AGENT-49-ci-cd-release-engineering.md) | CI / release | open | — | `.agents/agent-49` | — | — |
| [50](./AGENT-50-playtest-feedback-program.md) | Playtest program | done | cursor-wave01-06 | `.agents/agent-50` | 2026-03-28 | Landed `docs/PLAYTEST.md` (sample cycle hypothetical) |
| [51](./AGENT-51-integrity-save-leaderboards.md) | Integrity / saves | done | cursor-wave01-07 | `.agents/agent-51` | 2026-03-28 | Landed `docs/INTEGRITY.md` |
| [52](./AGENT-52-steam-partner-achievement-parity.md) | Steam partner parity | done | cursor-wave01-08 | `.agents/agent-52` | 2026-03-28 | Landed `docs/STEAM_PARTNER_PARITY.md` |
| [53](./AGENT-53-ratings-regional-compliance.md) | Ratings / compliance | done | cursor-wave01-09 | `.agents/agent-53` | 2026-03-28 | Landed `docs/RATING.md` |
| [54](./AGENT-54-lore-flavor-pass.md) | Lore / flavor (optional) | done | cursor-wave01-10 | `.agents/agent-54` | 2026-03-28 | Landed `docs/WORLD.md` + menu tagline |

---

## Changelog (optional)

Append a line when you do a bulk reset or housekeeping:

- `2026-03-28` — wave 02 (agents **12, 34, 38, 39**) completed; editor prod gate, credits notices, fullscreen QA doc, editor defer.
- `2026-03-28` — wave 01 (agents **18, 35, 40, 44, 45, 50, 51, 52, 53, 54**) completed in parallel; board rows set `done`.
- _Example: `2026-03-27` — reset all rows to `open` after shipping v1._
