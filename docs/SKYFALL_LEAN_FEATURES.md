# Skyfall — lean feature ideas (no bloat)

This doc maps patterns from [POPULAR_SIMPLE_GAMES_FORMULA.md](./POPULAR_SIMPLE_GAMES_FORMULA.md) to **Skyfall** (endless dodger: heat, bosses, perks, meta) and answers: **what helps without turning the game into a second job.**

**Already in the ballpark (don’t “add” these as new pillars):** visible score/best, run end flow, **run summary**, **achievements**, **meta currency + unlock tree**, **daily contracts**, challenge streaks / destroy streak juice, bosses, options + tutorial prompt. The job is to **deepen** what exists or add **one new layer at a time**, not stack five genres.

---

## Principles (anti-bloat)

1. **One new verb per release** — e.g. either “pick A/B perk” *or* “complete a daily,” not both redesigned at once.
2. **Prefer data over systems** — new achievement rows, contract templates, or one UI line beats a new progression currency.
3. **Reuse pipes** — anything that can hang off `buildRunSummary()`, contracts, or meta rewards stays coherent.
4. **Say no to** second economies, gacha chests, battle passes, social feeds, and “live ops calendars” unless you’re shipping a mobile SKU with a dedicated team.

---

## Tier A — high impact, low complexity

These mostly extend **existing** hooks. Risk of complication stays low if you keep counts small.

| Idea | Why it matches the formula | How to keep it lean |
|------|---------------------------|---------------------|
| **Contract variety (data-only)** | Subway-style “missions” without a new mode — you already have **daily contracts**. | Add a few entries to `CONTRACT_POOL` with **distinct metrics** you already track (e.g. destroy count, perk taken, boss no-damage). No new UI beyond contract copy. |
| **Achievement sprinkles** | Milestones for long-tail players; cheap dopamine. | 3–5 rows in `achievements.js` + unlock sites in `dodgeGame` (same pattern as existing score/boss hooks). Avoid 50 achievements. |
| **“Next unlock” hint on game over or meta screen** | Clear goal like idle games’ “next purchase” without a full tech tree UI. | One line: “+12 meta to unlock *Quick Steps*” using `META_UNLOCK_NODES` + current balance. |
| **Stronger game-over framing of meta gain** | Failure feels productive ([formula §1F](./POPULAR_SIMPLE_GAMES_FORMULA.md)). | You already grant meta on death — ensure **one sentence + number** is impossible to miss (copy/layout only). |
| **Per-run “personal best” lines** | Runner-style self-competition without multiplayer. | If not already shown: “Best time / best score this mode” on summary (read from save; no new simulation). |
| **Single optional “risk” pickup or modifier** | Variable reward ([formula §1E](./POPULAR_SIMPLE_GAMES_FORMULA.md)) if it’s **one rule**. | e.g. rare pickup: short score mult + slightly faster heat **or** one extra perk choice next gate — **not** a shop with six consumables. |

---

## Tier B — meaningful, but watch scope

Worth it if one pillar still feels thin after Tier A.

| Idea | Benefit | Bloat risk | Mitigation |
|------|---------|------------|------------|
| **2–3 more meta nodes (not 20)** | Roguelite-style between-run growth; extends current tree. | Tree balance + UI creep. | Linear prereqs only; cap at **~8 total nodes** until you’ve playtested a month. |
| **“Rotating” daily modifier** | Freshness like runner world updates — without new art pipelines. | Becomes noise if tuned wrong. | **One** rule per day from a tiny enum (e.g. +10% speed, +1 shield start, double contract progress). Reuse `getContractDateKey` seeding mindset. |
| **Lightweight perk “tags” for feats** | Build identity (survivor-like) without new combat layer. | Feat matrix explosion. | At most **3 tags** (e.g. mobility / defense / score); achievements like “finish a run having taken only X.” |
| **Post-run tips (contextual)** | Tutorial energy without a wall of text. | Feels preachy. | **Max 1 tip** per death, triggered by simple flags (e.g. died in first 20s → movement tip). |

---

## Tier C — usually too heavy for “small Skyfall”

Skip or defer unless you change product direction.

| Idea | Why it’s risky |
|------|----------------|
| **Idle/offline earnings** | New economy + expectation of passive play; fights core fantasy of dodging. |
| **Multiple currencies + vendors** | Cognitive load; balancing hell. |
| **Procedural narrative / run “quests” beyond contracts** | Writing + branching; duplicates contracts poorly. |
| **Full cosmetic shop** | Asset and UI cost; OK for a **Phase 2** if you want expression, not for “one more patch.” |
| **Real-time leaderboards / async PvP** | Backend, moderation, expectation of fairness across builds. |
| **Roguelike “full relic grid”** | You’d be building *Hades*, not tightening Skyfall. |

---

## What can be stripped (or shelved)

Goal: fewer parallel systems teaching the player different rules. **Your call:** treat **timed challenge beats** (math / Simon / logic / sequence — `ChallengeDirector`, number keys **1–3**) as **non-negotiable** here; they’re the main “think fast” break from pure dodging and pair with **perk drafts** the same input path. Everything below is optional removal **except** that lane.

### Keep (core identity + your constraint)

- **ChallengeDirector microgames + perk choice flow** — the timed **1 / 2 / 3** prompts (what you’re calling QTEs). Removing them collapses a designed cadence and a lot of `dodgeGame` state (`activeChallenge`, `pendingPerkChoices`, streaks, telemetry).
- **Core dodge loop** — spawn director, phases/heat, shields, game over / restart.

### Safe cuts (little or no player-facing loss today)

| Target | Why it’s strip-friendly |
|--------|-------------------------|
| **Orphan scenes** — portfolio hub | **Done (AGENT-11):** removed unused `beginningScene`, `choiceScene`, `introductionScene`, `websitesScene`, `navigationScene`, and `config/websites.js`. |
| **`#/editor` + `EditorScene`** | Dev/asset tooling. For a **player build**, omit the scene from the bundle or guard registration so shipping builds stay smaller and simpler. |
| **Docs-only / analysis markdown** you don’t read | No runtime effect; optional repo hygiene only. |

### Optional simplifications (product tradeoffs)

| Target | What you gain | What you lose |
|--------|---------------|---------------|
| **Game modes** (`Classic` / `Boss Rush` / `Draft` in `modeConfig.js`) | One tuning surface, less menu copy. | Variety for players who like draft cadence or boss density. **Lowest-impact strip:** drop **one** mode (e.g. Draft if it overlaps “lots of perks” with other tuning). |
| **Run objectives** (`ObjectiveDirector` — pickup/survive/boss mini-goals in-run) | Less HUD + mental stack; contracts already give daily goals. | Mid-run structured goals and their rewards (score/shield/perk point hooks). |
| **Meta progression** (`metaScene`, unlock tree, meta currency) | Pure “high score + contracts” game; easier balance. | Between-run power curve and long-term retention hook. Only strip if you consciously want arcade-pure. |
| **Daily contracts** | Simpler save + menu; no date-keyed generation. | Reason to open the game tomorrow; overlaps with achievements if those stay. |
| **Achievements scene + tracking** | Less UI and save fields. | Completionist hook; Steam-style surface if you ship there. Could **trim the list** instead of removing the system. |
| **`onlineService` / leaderboard queue / rich presence** | Offline-first, no ghost features if backends aren’t real. | Social proof and sync narrative. Many calls are already stubs-friendly — audit what actually hits the network. |
| **Telemetry batching** (`telemetry.js` + flush hooks) | Privacy simplicity, less code in hot paths. | You lose data for balancing; keep if you use aggregates. |
| **Archetype picker** (`archetypeSystem`, menu selection) | Fewer knobs per run. | Build variety / replay framing. |
| **Click-to-destroy** (if you still treat it as optional spice) | Stricter “dodge only” fantasy. | Risk/reward expression and destroy-streak scoring. |
| **Tutorial scene + first-run prompt** | Faster time-to-play for returning players. | Onboarding for new players — usually better to **shorten** than delete. |
| **Credits** | One less scene. | Attribution; negligible code cost. |

### UI / copy trims (cheap)

- Shorten **game over** text blocks (e.g. last N challenge lines) if the panel feels like a spreadsheet.
- Collapse **Options** sections if any are placeholders (e.g. controls that don’t apply to build).

### Do *not* strip lightly (high coupling or feel)

- **Boss pipeline** — defines peaks and variety.
- **`phaser3-juice-plugin` / juice** — cheap wins for impact; removing reads as “flat.”
- **Save schema** — removing features still needs migration or tolerant reads in `saveManager.js`.

---

## “Formula checklist” — mapped to your game

Short read: are we covered without new systems?

| Formula pillar | Skyfall today (approx.) | Lean next step |
|----------------|-------------------------|----------------|
| One-glance goal | Survive, score, dodge | Keep HUD minimal; optional “heat” readout clarity only if playtests ask |
| Tight loop | Dodge + perks + challenges | Tier A variable pickup or Tier B daily modifier **one at a time** |
| Visible progression | Score, meta, contracts, unlocks | “Next unlock” copy; summary meta line |
| Variable moments | Bosses, challenges, pickups | Rare risk pickup **or** rotating modifier — not both at once |
| Meta / productive death | Meta currency + contracts | Emphasize on game over; don’t add second metaprogression |
| Session fit | Short runs, restart | Instant restart already wins; avoid mandatory 10-min setup flows |

---

## Suggested order (if you only do three things)

1. **Game over / summary:** make meta + contracts completed impossible to miss (+ optional “next unlock” line).  
2. **Data:** 2–3 new **contracts** and **achievements** that use **existing** stats.  
3. **Optional spice:** **one** of — rare risk pickup **or** single daily modifier — then ship and measure feel before adding the other.

---

## Related docs

- [POPULAR_SIMPLE_GAMES_FORMULA.md](./POPULAR_SIMPLE_GAMES_FORMULA.md) — cross-genre research and sources.  
- [GAP_ANALYSIS_BEYOND_TASKS.md](./GAP_ANALYSIS_BEYOND_TASKS.md) — engineering gaps → tasks **21–39**.  
- [FULLY_FLEDGED_EXPERIENCE.md](./FULLY_FLEDGED_EXPERIENCE.md) — commercial “full game” axes → tasks **40–54**.  
- Repo reality check: `app/game/metaProgression.js`, `app/game/contractDirector.js`, `app/config/achievements.js`, `app/scenes/dodgeGame.js` (`buildRunSummary`, `endRun`).

---

*Internal roadmap; trim or reorder as you ship.*
