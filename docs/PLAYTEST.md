# Playtest & feedback program

This page is the **single entry point** for running external playtests, collecting structured feedback, and routing it into backlog work (notably balance vs onboarding).

---

## Build / artifact (repeatable handoff)

Playtest builds should match the **same artifact story** as release engineering:

- **Source of truth (task):** [`tasks/AGENT-49-ci-cd-release-engineering.md`](../tasks/AGENT-49-ci-cd-release-engineering.md) — CI expectations, `electron-builder` output naming, changelog ritual, and signing notes.
- **Shipping ritual (doc):** When present, follow [`docs/RELEASE.md`](./RELEASE.md) for version sync (`GAME_VERSION` / `package.json`) and the “how to ship 1.x.y” checklist. If that file is not in the repo yet, treat AGENT-49 as the interim spec and keep a **named zip or branch per playtest wave** (e.g. `playtest-2026-03-28-v0.9.0`) so reports are attributable.

**Tester package (minimum):**

- One installable or portable build for their OS (per AGENT-49 artifact layout).
- This `PLAYTEST.md` link (or a one-pager PDF export) so they know what to report and where.

---

## Tester requirement: visible version (AGENT-37)

Every playtester must be able to **read the exact build version in-game** so bug reports and difficulty comments map to the right commit or release.

- **Requirement owner:** [`tasks/AGENT-37-about-privacy-support.md`](../tasks/AGENT-37-about-privacy-support.md) — About / Options surfaces must expose **`GAME_VERSION`** (from [`app/config/version.js`](../app/config/version.js) or the project’s single source of truth).
- **Instruction to testers:** Before playing, open **Options** (or **About**) and **copy the version string** into the feedback form or discussion post’s first line.

If version is missing or unclear, **do not run a formal cycle** until AGENT-37 is satisfied; informal notes should still mention “unknown build” and date only as a last resort.

---

## Feedback template

Use **either** a short Google Form **or** a GitHub Discussions “Playtest feedback” thread template. Keep it under ~5 minutes to complete.

### Option A — Google Form (suggested fields)

| Section        | Field / question |
|----------------|------------------|
| Build          | Version string (required) — paste from in-game About/Options |
| Context        | OS + input device (keyboard, gamepad model) |
| Skill          | Self-rated: new to runners / casual / experienced / speedrunner-ish |
| Session        | Approx. minutes played this session |
| Deaths         | Approx. deaths (or “lost count”) |
| Comprehension  | In one sentence: what were you trying to do? Did the game communicate goals clearly? |
| Friction       | Top 1–3 moments of confusion, unfairness, or “I didn’t know why I died” |
| Polish         | Anything that felt slow, noisy, or repetitive (optional) |
| Open text      | Anything else + optional screenshot links |

### Option B — GitHub Discussions outline

Post in **Discussions → Playtest** (or a pinned issue) with this skeleton:

```markdown
## Playtest feedback — [your name or alias]

**Version (from game):** 
**OS / input:** 
**Skill (self):** new / casual / experienced
**Time played:** 
**Deaths (approx):** 

### Did you understand goals and failure?
### Top friction (1–3 bullets)
### Balance / fairness (too easy / too hard / uneven)
### Optional: polish / UX noise
```

Moderators should **reply once** with thanks and, if applicable, the internal issue IDs after triage.

---

## Rubric: P0 vs P2 and routing to AGENT-41 / AGENT-33

Use this to turn raw feedback into **actionable issues** without debating every opinion.

| Signal | Priority | Route | Notes |
|--------|----------|--------|--------|
| Cannot start, soft-lock, crash on load | **P0** | Engineering / release (AGENT-49 area) | Not 41/33 unless caused by tutorial gate |
| “I don’t know what to do,” tutorial skipped but still lost, wrong key hints, first 2 min incomprehensible | **P0 confusion** | **[`AGENT-33`](../tasks/AGENT-33-tutorial-onboarding-pass.md)** | Onboarding, copy, first-run flow, `tutorialScene` / menu paths |
| “I died but don’t understand why,” HUD/objective clarity in first sessions | **P0 / P1** | **AGENT-33** first; coordinate HUD tasks if separate | If the rule is learned but unreadable, may split to UI clarity tasks |
| Mode feels **unfair** or **trivial** after rules are understood; boss timing; spawn density; perk power spikes; contract difficulty vs run length | **P1–P2 balance** | **[`AGENT-41`](../tasks/AGENT-41-balance-pacing-pass.md)** | Pacing knobs, `RunnerSpawnDirector` / `modeConfig`, tuning doc |
| Typos, minor copy, “would be nice” audio/visual | **P2 polish** | Backlog / AGENT-42–43 as appropriate | Do not block balance/onboarding unless it masks failure feedback |

**Rule of thumb:** If a **new player** would fail to learn the loop, it is **AGENT-33** territory. If they **understand** the loop but **dispute fairness or depth**, it is **AGENT-41** territory.

---

## Schedule, confidentiality, contact

| Item | Guidance |
|------|-----------|
| **Cadence** | Aim for **at least one** external cycle per milestone (e.g. pre-release candidate or monthly). Internal smoke tests do not replace external eyes. |
| **Session length** | Ask for **20–30 minutes** minimum for first impressions; optional second session for meta/progression. |
| **NDA** | **None by default** for friends/family closed playtests. If you later use paid or press testers, add a one-line NDA reference here and store the signed copy outside the repo. |
| **Contact** | Replace with real channels before wide distribution: maintainer email, Discord, or GitHub Discussions. For Steam builds, prefer **Steam forums or support** links once live (see AGENT-37 placeholders). |

---

## Sample cycle *(hypothetical example — not a real logged run)*

Use this shape when documenting a **real** cycle later; replace bullets with actual tester quotes and build IDs.

1. **Hypothetical:** Build `0.9.0-dev`, three testers, 25-minute cap — two reported **version** from About; one pasted `package.json` version by mistake → **process fix:** remind testers to copy from in-game UI only (AGENT-37).  
2. **Hypothetical:** Two testers said “first boss appears before I understood scoring” → triage as **AGENT-41** pacing (time-to-first-boss) plus **AGENT-33** check for missing pre-boss tip.  
3. **Hypothetical:** One tester could not find **rebind** menu → **AGENT-33** / navigation clarity (not balance).

---

## Related tasks

- [`AGENT-50`](../tasks/AGENT-50-playtest-feedback-program.md) — owns this document and program definition.
- [`AGENT-49`](../tasks/AGENT-49-ci-cd-release-engineering.md) — CI, artifacts, `docs/RELEASE.md`.
- [`AGENT-37`](../tasks/AGENT-37-about-privacy-support.md) — version visibility for reporters.
- [`AGENT-41`](../tasks/AGENT-41-balance-pacing-pass.md) — balance & pacing intake.
- [`AGENT-33`](../tasks/AGENT-33-tutorial-onboarding-pass.md) — onboarding & comprehension intake.
