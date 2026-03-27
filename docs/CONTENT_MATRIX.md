# Content breadth matrix

**Purpose:** Factual inventory of runnable content as implemented in `app/game/` (Axis B — content volume). Sources: `runnerContent.js`, `bossEncounter.js`, `challengeDirector.js`, `perkLibrary.js`, `modeConfig.js`. **AGENT-06** (risk pickup) is referenced from `tasks/AGENT-06-risk-pickup.md`; it is **not** present in `PICKUP_TYPES` today.

**Last audited:** 2026-03-28 (code read + grep).

---

## 1. Hazards / obstacles

| Dimension | Current (repo) | Notes |
|-----------|----------------|--------|
| **Obstacle keys** (`OBSTACLE_LIBRARY`) | **14** | `meteor`, `shard`, `crusher`, `zigzag`, `sentinel`, `pulse`, `streak`, `spinner`, `ring`, `star`, `cross`, `drone`, `slicer`, `hex` |
| **On-destroy behaviors** | **4** | `clean`, `splitter`, `debrisLauncher`, `lingering` (documented in `runnerContent.js` comment block above `OBSTACLE_LIBRARY`) |
| **Run phases** (`RUNNER_PHASES`) | **4** | `recovery`, `push`, `heat`, `reset` — each has `durationMs` and `pressure` |
| **Spawn edge unlocks** | **9 edges** gated by intensity | `top` always; `left`/`right` ≥0.32; `bottom` ≥0.48; diagonal corners in two tiers (0.58 / 0.72) — `getAllowedSpawnEdges` |
| **Spawn patterns** (`PATTERN_LIBRARY`) | **23** distinct `key` entries | Patterns declare `phases`, optional `minIntensity` / `maxIntensity`, and `weight` |

### Targets ($5–15 indie scope)

| Metric | Suggested target | Rationale |
|--------|------------------|-----------|
| Distinct hazard **types** in library | **≥10** (hold **12–16** as healthy) | You already have **14**; this band matches a small premium/arcade SKU without implying a content factory. |
| Distinct **on-hit behaviors** | **≥3** | You have **4**; enough for readable variety without new systems. |
| Patterns in weighted rotation | **≥15** | You have **23**; maintain count when adding modes, don’t shrink pool accidentally. |

---

## 2. Bosses

| Dimension | Current (repo) | Notes |
|-----------|----------------|--------|
| **Procedural boss archetypes** (`BOSS_ARCHETYPES` in `runnerContent.js`) | **5** | Storm Core, Void Spire, Ember Nexus, Frost Shard, Chaos Rift — each `weight: 1` |
| **Attack signatures** (strings used in configs + `bossEncounter.js`) | **3** | `fan`, `aimedBurst`, `cross` — bosses use **pairs** of signatures across two phases |
| **Phase logic** | **2 phases** | `getBossAttackProfile` phase 1 vs 2; cadence/count/spread scale from config |
| **Mini-boss wave** (`buildMiniBossWave`) | **1 fixed identity** | Always named `"Storm Core"`, fixed tint/params — **not** drawn from `pickBossArchetype` |

### Targets ($5–15 indie scope)

| Metric | Suggested target | Rationale |
|--------|------------------|-----------|
| Procedural boss **archetypes** | **3–6** | You meet **5**; enough for “not always the same fight” in a short session. |
| **Signature** vocabulary | **≥3** | Satisfied (**3**); adding 1–2 new signatures would be a **code** project, not data-only. |
| Mini-boss vs main boss **parity** | Optional: mini-boss uses same archetype picker | Today’s gap: mini-boss is **hardcoded** (factual). |

---

## 3. Perks & debuffs

| Dimension | Current (repo) | Notes |
|-----------|----------------|--------|
| **Perks** (`PERK_LIBRARY` in `perkLibrary.js`) | **15** | Movement **4**, Defense **5**, Score **4**, Utility **2** |
| **Perk categories** (`PERK_CATEGORIES`) | **4** | `movement`, `defense`, `score`, `utility` — all populated |
| **Debuffs** (`DEBUFF_LIBRARY`) | **8** | Mix of movement, defense, score, and **curse** |
| **Icon frames** | **8** slots in `proceduralUiAssets.js` / `perkIcons` | Several perks reuse the same `iconFrame` (e.g. multiple movement perks use `0`) — **cosmetic** density is lower than perk count |

### Targets ($5–15 indie scope)

| Metric | Suggested target | Rationale |
|--------|------------------|-----------|
| Perk count | **12–20** | **15** is in band; avoids “infinite roguelike” expectations for price point. |
| Category coverage | **All defined categories used** | Already true. |
| Visually distinct perk icons | **≥8** unique reads at a glance | **Gap:** many perks share frames; acceptable for prototype, weak for $15 polish. |

---

## 4. Challenges (`ChallengeDirector`)

| Dimension | Current (repo) | Notes |
|-----------|----------------|--------|
| **Challenge types** (`type` field) | **4** | `math-rush`, `simon-says`, `logic-gate`, `sequence-lock` |
| **Builders** (`CHALLENGE_BUILDERS`) | **4** | Uniform random selection each trigger |
| **Trigger cadence** | Score-based | `nextTriggerScore` starts **12**, then `+= 14 + floor(rng * 7)` |
| **Reward on success** | Score bonus, optional shield, **1 perk point** | `durationMs` scales with intensity |

### Targets ($5–15 indie scope)

| Metric | Suggested target | Rationale |
|--------|------------------|-----------|
| Distinct challenge **types** | **≥4** | Met at minimum; **5–6** reads better for repeat runs in a $10–$15 game. |
| Rotation variety | Not only uniform RNG | Current: **uniform** over 4 builders — fine for MVP; thin for long retention. |

---

## 5. Pickups & risk

| Dimension | Current (repo) | Notes |
|-----------|----------------|--------|
| **Pickup effect types** (`PICKUP_TYPES`) | **4** | `shield`, `speed`, `invuln`, `scoreMult` — weighted (4, 2, 1, 2) |
| **Spawn integration** | Patterns + boss reward | `pickup-pocket`, `pickup-anywhere`, `pickup-flank`, `pickup-rise`; `rewardPickup` on bosses |
| **AGENT-06 risk pickup** | **Not implemented** | Spec in `tasks/AGENT-06-risk-pickup.md`; no fifth pickup type or risk flag in `runnerContent.js` |

### Targets ($5–15 indie scope)

| Metric | Suggested target | Rationale |
|--------|------------------|-----------|
| Core pickup types | **3–5** benign | **4** is adequate. |
| Optional **one** risk/reward pickup | **0 or 1** (lean) | AGENT-06 scope: **one** optional type — still **backlog** in code. |

---

## 6. Modes (`modeConfig.js`)

| Mode | Distinct parameters (factual) | “Feel” (short) |
|------|-----------------------------|----------------|
| **Classic** | `bossCooldownScale` **1**, `fillerHazardSpawnChance` **1**, `challengeScoreInterval` **12**, no draft timer | Baseline loop. |
| **Boss Rush** | Boss cooldown **×0.4**, filler hazards **×0.55**, challenges every **18** score | More bosses, fewer filler hazards. |
| **Draft** | Boss cooldown **×0.85**, filler **×0.9**, challenges every **20**, **`draftPerkIntervalSeconds` 20** | Periodic forced perk drafts, slightly softer challenge pacing. |

### Targets ($5–15 indie scope)

| Metric | Suggested target | Rationale |
|--------|------------------|-----------|
| Mode count | **≥2** | **3** is solid for a small indie vertical slice + replay hooks. |
| Per-mode **tunable** deltas | At least boss rate, hazard density, draft/challenge spacing | Present as above; further differentiation would need **code + tuning**. |

---

## 7. Backlog (prioritized adds)

| Priority | Item | Kind | Owner | Effort |
|----------|------|------|--------|--------|
| P0 | **AGENT-06:** single risk/reward pickup (spec exists) | Code + tuning + minimal VFX | Gameplay engineer | **M** (2–5 days) |
| P1 | **Mini-boss variety:** `buildMiniBossWave` uses archetype picker or shares `buildProceduralBoss` | Code (small) | Gameplay engineer | **S** (0.5–1 day) |
| P1 | **Challenge type #5** (e.g. reaction or pattern tap) + optional weight curve | Code + copy | Gameplay engineer | **M** |
| P2 | **Perk icon differentiation** — map unique `iconFrame` or new `perkIcons` frames | Art / UI data | UI or art | **S** (1–2 days) |
| P2 | **New obstacle key** in `OBSTACLE_LIBRARY` + one pattern using it | Data + procedural params if needed | Gameplay engineer | **M** if new `procedural` family |

*Effort:* **S** = small slice, **M** = multi-file / needs playtest, **L** = not listed (out of scope for this matrix).

---

## 8. Criteria self-check

| Criterion | Status |
|-----------|--------|
| Matrix is **factual** (grounded in named files / counts) | Yes — counts from `runnerContent.js`, `challengeDirector.js`, `perkLibrary.js`, `modeConfig.js`; boss phase math from `bossEncounter.js`. |
| **≥3** content gaps with **owner + effort** | Yes — rows P0, P1×2 in backlog (five rows total). |
| **AGENT-06** called out explicitly | Yes — task file linked; code state: **not landed**. |
