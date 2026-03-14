# Click-to-Destroy Obstacles — Theory Craft

Theory-crafting doc for **clicking to delete / blow up obstacles** in a dodge-style game, with a **risk/reward** angle: some obstacles are safe to pop, others create cascades, debris, or split into more hazards. Debris can clear other obstacles *and* hit the player.

---

## Core idea

- **Click/tap** on an obstacle to destroy it.
- **Not all obstacles are equal:** some disappear cleanly; others have **effects** (split, explode, spawn debris).
- **Risk/reward:** destroying can open space and clear a path, but it can also fill the screen with debris or spawn smaller hazards that hit you or chain into other obstacles.

So the player is constantly deciding: *Do I click this one, or dodge it?*

---

## Obstacle types (theory)

### 1. **Clean / “fine” obstacles**

- One click → obstacle is removed. No extra spawns, no debris.
- **Reward:** Less clutter, clearer lanes, maybe small score bump.
- **Risk:** Mostly just “wasted” a click if you could have dodged (or if click has a cooldown/cost).

Use these as the baseline so the player doesn’t feel punished for engaging with the mechanic.

---

### 2. **Star-burst / splitter**

- On destroy: **splits into N smaller obstacles** launched in a **star pattern** (evenly spaced angles from the center).
- **Reward:** One big obstacle gone; if the small ones fly away from the player, you get a temporary clear zone.
- **Risk:** Small pieces can hit the player or drift into other obstacles and trigger more effects. More obstacles on screen than before.

Variants:

- **Fixed N** (e.g. 4 or 6 directions).
- **Asteroids-style:** smaller pieces can sometimes split again (one level deep, or more for chaos).
- **Typed split:** “Splitter” = 1 → 2 in a line; “Star” = 1 → N in a star; “Exploder” = 1 → area damage / destroy nearby only.

---

### 3. **Debris launcher**

- On destroy: **spawns debris** (small physics objects) that fly outward (e.g. cone, random scatter, or star pattern).
- **Debris:**
  - **Hits other obstacles** → can destroy them (chain reaction) or trigger *their* on-destroy effects.
  - **Hits the player** → damage / shield pop / game over (same as current hazard hit).
- **Reward:** Can set off chains to clear many obstacles at once; satisfying cause-and-effect.
- **Risk:** Debris is indiscriminate — it can clear a path or fill your lane. Positioning and timing matter.

This is the main “risk/reward” pillar: *destroying can clear the screen or get you killed.*

---

### 4. **Chain / adjacency**

- Destroying one obstacle triggers **neighbors** (by overlap, grid, or proximity) to also break or to trigger their effects.
- **Reward:** One click → big cascade; possible score multiplier for chain length (e.g. Runic Block Collapse–style).
- **Risk:** Cascade might spawn many splitters or debris launchers; screen gets chaotic fast.

Unbreakable or “absorbing” obstacles can stop the chain and add layout strategy.

---

### 5. **Lingering / area effect**

- On destroy: leaves a **zone** (e.g. damage field, slow field, or “spawns more after 1s”) instead of instant debris.
- **Reward:** Clear the main hitbox immediately.
- **Risk:** New hazard type to dodge; can combo with other obstacles.

---

## Risk/reward summary

| Action              | Reward                          | Risk                                      |
|---------------------|----------------------------------|-------------------------------------------|
| Click clean         | Clear one, no side effects       | Low (maybe click cost/cooldown)           |
| Click splitter      | One big gone                     | More small hazards, possible chains      |
| Click debris launcher | Possible chain clear           | Debris hits you or triggers more effects  |
| Click in chain      | Big cascade, score potential    | Uncontrolled chain, many effects at once  |

Design goal: **destroying is powerful but not free** — the player has to read the field (what will this spawn? where will debris go?) and choose when to click vs when to dodge.

---

## Corner cases & edge cases

Things that can go wrong or feel bad if we don’t handle them up front.

### Recursion & chain explosion

- **Infinite chain:** A destroys B, B’s debris destroys A (or A’s neighbor), loop. **Fix:** Each obstacle has a “destroy source” (player click vs debris vs chain). Only count “chain length” or “trigger destroy” from one initiator per frame; mark hazards as “pending destroy” and process in a single pass; or cap chain depth (e.g. max 2–3 levels of “destroyed by debris”).
- **Same-frame double trigger:** Player clicks hazard A; A’s debris hits B and C in the same frame; B and C both trigger. **Fix:** Process destroys in a queue: “to destroy” list, then resolve in one pass so each obstacle is destroyed at most once per click.
- **Chain length explosion:** 20 obstacles in a line all chain. **Fix:** Cap max chain length, or cap max spawned debris/splits per chain (e.g. after 5 triggers, rest are “clean” destroys). Prevents frame drops and “I didn’t do anything and I died.”

### Spawn overlap & crowding

- **Debris spawns inside player:** Destroy at player position → instant hit. **Fix:** Spawn debris at offset from center (e.g. outside hitbox), or give debris 1–2 frames of “grace” where it doesn’t hit player (only hazards).
- **Star pattern through player:** Splitter at top center; one ray is straight down into player. **Fix:** Bias star pattern away from player (e.g. exclude angle toward player), or add short delay before child hazards deal damage.
- **Too many entities:** Many splitters + debris at once → lag or unreadable screen. **Fix:** Global cap on hazards + debris (e.g. max 80); oldest or offscreen culled first. Optionally “chaos mode” above cap: no new spawns until count drops.

### Input & targeting

- **Click on two hazards at once:** Two overlapping sprites, one click. **Fix:** Define priority: smallest, or frontmost (depth), or “first in hazard list.” Document: “we destroy the topmost hazard under the cursor.”
- **Click during invuln / recovery:** Player just got hit, still in recovery; they click. **Fix:** Decide: allow (reward agency) or ignore clicks during recovery. If allow, consider “revenge destroy” satisfaction.
- **Rapid double-click:** Two clicks in 10 ms on same hazard. **Fix:** Cooldown per hazard (e.g. 100 ms) or per global click (e.g. 150 ms) so one click = one destroy. Prevents accidental double-spend of “click resource” if we add one.
- **Tap vs click:** Mobile tap can be fat-finger or drift. **Fix:** Slightly larger hit area for “tap to destroy” on touch; optional “hold to confirm” for debris launchers in a hard mode.

### Balance & exploit edge cases

- **Only ever click clean:** Player ignores all risky obstacles and only clicks safe ones. **Fix:** Make clean destroys scarce or low value; or add “chaos pressure” so that not destroying splitters/debris launchers makes the screen unmanageable. Reward risk-taking with score multiplier or bonus shields.
- **Always click debris launcher from far corner:** If debris is predictable, player stays safe and uses one launcher to clear the screen. **Fix:** Add randomness to debris cone (spread angle, count); or launchers that “aim” one piece toward player; or limit how many obstacles one debris can destroy (e.g. first 3 only).
- **Chain only clean obstacles:** If chain only triggers on “clean” type, player stacks cleans and gets huge score with no risk. **Fix:** Chain logic should trigger on *any* destroy in radius (including debris/split children), so chains naturally include risky types. Or: chain bonus only if chain includes at least one “risky” destroy.
- **Farming splits:** Player clicks splitters when screen is empty to farm small hazards for points. **Fix:** Small hazards worth less or zero; or “split children don’t give score”; or time pressure so farming doesn’t pay off.

### Visual & readability

- **Can’t tell type under clutter:** In heavy rain, all obstacles look the same. **Fix:** Strong silhouette/color/icon per type (clean = blue outline, splitter = cracks, debris = spark icon). Option: “focus” or scan line that highlights type on hover.
- **Debris too small to see:** Tiny debris one-shots player and feels unfair. **Fix:** Minimum size for debris; or debris has a short trail/glow so it’s readable. Ensure “I could have seen it” is true.
- **Destroy feedback unclear:** Player clicks, something happens, they’re not sure what. **Fix:** Clear VFX per type (clean = poof; splitter = burst + rays; debris = cone of particles). Sound per type. Brief text: “Split!” / “Chain x3!”.

### Failure mode summary

| Corner case            | Risk                          | Mitigation                                      |
|------------------------|-------------------------------|--------------------------------------------------|
| Infinite chain         | Hang / crash / unfair death   | Single-pass destroy queue; chain depth cap      |
| Debris spawn on player | Instant unavoidable hit       | Spawn offset or grace frames                     |
| Entity explosion       | Lag / unreadable              | Cap total hazards + debris; cull old/offscreen   |
| Double-click same      | Double cost / double trigger  | Per-hazard or global click cooldown              |
| Only click safe       | Boring / no risk              | Scarcity of safe; reward risk; chaos pressure     |
| Unreadable types       | Frustration / random death    | Strong telegraph; optional hover highlight       |

---

## Making it addicting

Design levers to keep players in the “one more run” loop and make destruction feel irresistible.

### Variable reward & surprise

- **Same action, different outcome:** Not every “debris launcher” destroy leads to the same chain. Sometimes 2 obstacles go, sometimes 8. **Variable ratio reward** (like slot machines) makes each click feel like “maybe this time it’s huge.”
- **Hidden bonuses:** Rare “golden” or “crystal” variant of an obstacle that looks the same but gives 2x chain score or drops a shield. Players look for them every run.
- **Surprise chain:** Occasionally a “clean” destroy triggers a hidden chain (e.g. was right next to a fragile obstacle). “I didn’t expect that” = memorable moment.

### Near-miss & “almost”

- **Near-miss debris:** Debris passes a few pixels from the player — show a “CLOSE!” or a heartbeat sound. Brain interprets near-miss as “almost won,” not “lost,” and tries again.
- **Survived the cascade:** Screen full of debris, player weaves through; on clear, short celebration (flash, sound, “CLEAR!”). Reinforce “I can handle chaos.”
- **One shield left, big chain:** Tension peak: low shields, player triggers a risky destroy. Success = huge relief + score spike. Failure = “I’ll do it differently next time.”

### Mastery & skill ceiling

- **Read the field:** Expert play = knowing which obstacle to click first (e.g. debris launcher near a cluster) so the cascade does maximum clear and minimum harm. **Visible skill growth** = “last week I couldn’t do that.”
- **Optimal order:** Levels or waves where there’s an “intended” order (destroy A, then B, then C) for max score. Discovery = “I found the trick.”
- **Style play:** Bonus for “chain only” runs or “no clean clicks” runs. Replayability and bragging rights.

### Tension & release

- **Build-up:** Phase or wave builds obstacles (more spawn, faster). Tension rises.
- **Release:** One well-placed click triggers a chain and clears half the screen. Big visual + audio + score pop. **Dopamine hit** right after tension.
- **Rhythm:** Short cooldown on click (e.g. 0.4 s) so actions are deliberate but frequent. Not spammy, not slow — a beat the player locks into.

### Juice & feel

- **Click:** Cursor flash, small screen shake, click sound. **Destroy:** Freeze frame 1–2 frames on big chain, then particle burst and “x5” floating text.
- **Sound:** Different destroy sounds per type; chain length = pitch or layer (longer chain = bigger sound). Satisfying “crunch” or “pop.”
- **Score:** Numbers that ramp: +10, +30, +100. Chain multiplier that stacks (e.g. “x2”, “x3”). Big numbers feel good.

### Streaks & commitment

- **Destruction streak:** “5 destroys without taking damage” → small bonus (extra click or shield fragment). Encourages aggressive play and risk.
- **Survival streak:** “30 s without hit” already in game; pair with “destroyed 10 in that window” for a “clean run” bonus. Two parallel tracks: survive *and* destroy.
- **Run commitment:** “Exit unlocked at score X” — player has invested; they want to reach exit or beat high score. Sunk cost + clear goal = one more run.

### FOMO & scarcity

- **Limited clicks per phase:** “You have 3 clicks this wave.” Every click matters; choosing wrong feels bad, choosing right feels great. Scarcity increases perceived value.
- **Rare “mega chain” setup:** Sometimes the RNG gives a perfect layout (one click could chain 6). If you miss the window, it’s gone. “Next time I’ll click faster.”
- **Daily / run-unique challenge:** “This run: debris launchers give 2x chain length.” One run only. Play now or miss it.

### Addiction levers summary

| Lever              | Implementation idea                              | Why it hooks |
|--------------------|---------------------------------------------------|--------------|
| Variable reward    | Random chain length; rare golden obstacles       | “Maybe next click is huge” |
| Near-miss         | “CLOSE!” when debris barely misses               | “Almost” → try again      |
| Mastery           | Optimal order; chain-first or no-clean challenges | “I got better”            |
| Tension/release   | Build obstacles → one click clears many           | Big payoff after stress   |
| Juice             | Freeze, particles, sound, stacking score numbers  | Feel good every action    |
| Streaks           | Destroy streak bonus; survival + destroy dual track | Commitment to the run   |
| Scarcity          | Limited clicks per wave; rare mega-chain layouts  | Every choice matters      |

---

## References & patterns (from research)

- **Teardown:** Destruction as core mechanic; planning then execution; destruction creates paths and shortcuts. Avoid “destruction for spectacle” — tie it to goals. [Teardown design notes; RPS]
- **Chain reactions:** Reward bigger chains (e.g. more points per block in a chain); penalize single-block removal to encourage planning. [Runic Block Collapse]
- **Pre-built vs dynamic:** Swap pre-broken variants for performance vs fracture-at-impact for variety. [GMTK – How Games Do Destruction]
- **Debris as hazard:** Same debris that clears obstacles can damage the player; positioning and timing are the skill. [Subagent synthesis]
- **Split-on-destroy:** “Asteroids” splitter (1 → many smaller); control escalation with “prevents split” or “burns remains” modifiers. [Subagent synthesis]
- **Destruction as path-making:** Obstacles exist to be removed; order of destruction and placement of indestructibles shape the flow. [Subagent synthesis]

---

## Ties to our dodge game

- **Hazards** already fall and overlap the player; we’d add **click/tap** on a hazard to trigger “destroy” (with possible cooldown or limited clicks per phase).
- **Debris** from destroyed hazards would behave like small hazards: same overlap → `handleHazardHit` (or a dedicated “debris” group that also damages the player).
- **Splitters** would use the same spawn pipeline as hazards (e.g. `spawnHazard` / `spawnFromDescriptor`) with a “star pattern” velocity set.
- **Chain:** On destroy, check overlap or distance to other hazards; trigger their destroy logic (with guard to avoid infinite recursion).
- **Projectiles** and **boss** can stay non-destructible or get a special rule (e.g. boss only takes damage from debris, not from direct click).

---

## Open questions

1. **Click cost:** Limited clicks per wave / per phase, or only cooldown? (Scarcity = addicting but can frustrate; cooldown = more flow.)
2. **Targeting:** Click exact hazard vs “click in area” (e.g. destroy all in radius)?
3. **Visual telegraph:** How do we show “this one splits” vs “this one shoots debris” vs “clean” before the player clicks?
4. **Difficulty curve:** Introduce clean first, then splitters, then debris launchers, then chains?
5. **Corner-case priority:** Which mitigations first? (Recommend: destroy queue + recursion cap, then debris spawn grace/offset, then entity cap.)
6. **Addiction budget:** How many “addiction levers” per run? (Too many = noisy; 2–3 strong ones per run is enough.)

---

## Next steps

- [ ] Define obstacle “archetypes” in data (clean, splitter, debrisLauncher, chainCapable).
- [ ] Implement click/tap detection on hazards and a `destroyHazard(hazard, source)` that runs on-destroy effects.
- [ ] Add debris as a new group (or reuse hazards with `debris: true`) that overlap both player and hazards.
- [ ] Implement star-pattern and cone spread for spawns; chain trigger by overlap/radius.
- [ ] **Corner cases:** Single-pass destroy queue; chain depth cap; debris spawn offset/grace; global entity cap; click cooldown.
- [ ] **Addiction:** One variable-reward hook (e.g. random chain length or golden variant); near-miss feedback; one streak or scarcity lever (e.g. limited clicks per wave).

*Last updated: corner cases + addiction levers added.*
