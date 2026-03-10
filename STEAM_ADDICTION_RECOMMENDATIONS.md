# Skyfall — Full Gameplay Audit + Steam Addictiveness Upgrade Plan

## 1) Current game snapshot (what exists today)

### Core loop
- Genre: survival dodge/avoidance run in a single main gameplay scene (`DodgeGame`).
- Player moves freely with WASD/Arrows while hazards spawn from multiple edges and intensify over time.
- Score rises with survival time plus bonus points.
- Run ends when shields are depleted and player takes a hit.
- A run is considered “cleared” when score reaches `120` and player exits at the right edge.

### Input and platform support
- Keyboard controls: movement + challenge answer keys (1/2/3) + pause (Esc).
- Mobile virtual joystick exists.
- Game runs via Phaser + Vite, with Electron scaffolding present.

### Meta systems already present
- **Phases/intensity scaling**: Recovery → Push → Heat → Reset cycle with pressure curves.
- **Spawn director**: pattern-based hazard generation with pacing tied to intensity.
- **Mini-boss waves**: occasional boss entries in Heat with projectile attacks and reward pickup.
- **Pickups**: shield / speed / invuln / score multiplier.
- **Challenges**: short cognitive prompts mid-run with rewards/penalties.
- **Objectives**: random per-run goals (pickup count, survival, boss clear).
- **Perk points + perk choices**: perk economy with random selections.
- **Save data**: high score, settings, last completed level.

### Front-end product shell
- Loading, Main Menu, Options, Credits scenes are wired into startup flow.
- Rich menu style and options panel already implemented.

---

## 2) Strengths to preserve

1. **High readability + immediate accessibility**
   - Simple movement-only input makes onboarding fast.
2. **Good “micro decisions” density**
   - Dodging + pickups + challenge response keeps attention active.
3. **System layering already started**
   - You already have phases, perks, objectives, and bosses: strong base for “one more run” compulsion.
4. **Procedural content scaffolding exists**
   - Great foundation for variety without requiring huge art content volume.

---

## 3) Biggest retention gaps (why it may not yet feel Steam-addictive)

1. **Long-term progression is too thin**
   - Current persistence mostly stores score/settings/last level; little permanent account growth.
2. **Run identity is weak**
   - Players need stronger build expression (e.g., clear archetypes like shield tank / glass cannon / pickup gambler).
3. **Not enough “spikes” of emotional payoff**
   - Big unlocks, dramatic choices, and run-defining moments should happen more predictably.
4. **Social stickiness is not fully connected yet**
   - Leaderboards/achievements service is currently placeholder logic.
5. **Content cadence for Steam expectations**
   - To remain addictive, players need rotating goals (daily/weekly), multiple modes, and milestone unlock map.

---

## 4) Highest-impact additions (priority order)

## P0 — Must-have to become genuinely sticky

### A) Persistent meta progression (“account level” + unlock tree)
Add a **between-run progression currency** (e.g., Core Shards) and an unlock tree:
- Permanent stat tracks: +starting shield cap, +pickup potency, +challenge reward multiplier, +boss reward quality.
- Unlockable perk pools and hazard variants.
- Cosmetic unlock tracks (player aura/trails/skins, HUD themes).

**Why it works:** converts failure into progress and drives session chaining.

### B) Build archetypes at run start
At run start, choose one of 3 “loadouts”:
- **Bulwark** (extra shield, lower score rate)
- **Surge** (speed + challenge bonus)
- **Gambler** (high reward, harsher penalties)

Then let perks strongly branch those archetypes.

**Why it works:** players start theorycrafting; each run feels intentionally different.

### C) Stronger boss identity + boss rewards
Upgrade mini-bosses into named encounters with:
- Distinct attack signatures and telegraphs.
- Mid-fight phase shift at 50% duration.
- Boss-specific relic drops (temporary or permanent unlock progress).

**Why it works:** memorable “set-piece moments” increase attachment and replay.

### D) Real achievements + leaderboards + ghost/rival hooks
Implement real platform integration (Steamworks or backend proxy):
- Achievement tiers (bronze/silver/gold variants).
- Daily seeded leaderboard.
- “Beat your rival ghost” asynchronous challenge.

**Why it works:** social comparison is one of the strongest retention engines on Steam.

---

## P1 — High-value content depth

### E) Additional game modes
Ship at least 2 more modes:
- **Classic Endless** (current)
- **Boss Rush** (consecutive short boss gauntlets)
- **Draft Mode** (forced perk draft every X seconds)

### F) Biomes / visual phases
Tie each phase cycle to biome themes:
- sky palette, hazard art family, audio layer, unique modifier.

### G) Daily/weekly contracts
Examples:
- “Survive 90 sec with no speed pickup.”
- “Defeat 2 bosses using Bulwark start.”
Rewards feed meta progression.

---

## P2 — Polish for conversion + reviews

### H) Session pacing refinements
- First dramatic event within 30–45 seconds.
- Guaranteed perk moment by score/time thresholds.
- “Near miss” scoring/FX to reward skill expression.

### I) UX quality-of-life
- Better onboarding tutorialization (interactive, <60 sec).
- Accessibility toggles: color-blind palettes, hitflash intensity, screen shake strength slider.
- Better death recap (what killed you, objective progress, best split, loadout used).

### J) Live-ops readiness
- Seasonal modifier packs.
- Rotating mutators.
- Data telemetry hooks (run duration, death source, churn points).

---

## 5) Design targets for “addictive feel”

Set explicit KPIs and tune toward them:
- Median run length (new players): 4–7 min
- Median run length (returning): 8–15 min
- D1 retention target: 35%+
- D7 retention target: 12–18%
- “One more run” trigger frequency: a meaningful unlock/reward every 3–6 min

If you don’t instrument these, balancing becomes guesswork.

---

## 6) Recommended implementation roadmap

### Milestone 1 (2–3 weeks): retention foundation
- Add persistent currency + unlock tree.
- Add 3 run-start archetypes.
- Add proper post-run summary with progress gained.

### Milestone 2 (2–3 weeks): content spike
- Add 2 new boss patterns and one new mode (Boss Rush).
- Add daily contract generator.
- Add at least 10 new achievements.

### Milestone 3 (2–4 weeks): Steam-readiness
- Wire real leaderboard + achievements.
- Add accessibility + graphics options polish.
- Add telemetry + balancing passes.

---

## 7) Concrete feature ideas tailored to current systems

These fit your existing architecture with minimal rewrite:

1. **Perk synergies**
   - Tag perks by keyword (e.g., `shield`, `tempo`, `risk`) and grant bonus effects for 2/3-piece combos.

2. **Objective chains**
   - Completing one objective unlocks a harder chained objective in same run for bigger rewards.

3. **Challenge streak multiplier**
   - Consecutive successful challenges multiply score and perk-point rewards.

4. **Boss bounty selection**
   - Before boss fight, pick 1 of 2 bounties (harder rule for better drop).

5. **Exit variants**
   - At exit unlock, offer “extract now” or “continue for overcharge rewards” risk option.

6. **Failure insurance mechanic**
   - Spend meta currency pre-run to buy one emergency revive token.

7. **Run seed + share code**
   - Let players share “crazy run seeds” for social/community stickiness.

---

## 8) Steam launch checklist (fun + business)

- Strong trailer moments: boss telegraphs, perk combos, near-miss saves.
- 30+ achievements at launch.
- At least 3 modes or mutators.
- Meaningful progression in first 20 minutes.
- Daily reason to return.
- Controller UX parity and rebinding.
- Roadmap visible in main menu.

---

## 9) Bottom line

Your project already has the **hard part started**: a layered run loop with phases, perks, objectives, and bosses.
To reach “addicting and fun Steam game” status, prioritize:

1) permanent progression,
2) stronger build identity,
3) social/competitive hooks,
4) repeatable content cadence.

If you execute P0 + P1 cleanly, this can move from “cool prototype” to “high-retention indie arcade roguelite.”
