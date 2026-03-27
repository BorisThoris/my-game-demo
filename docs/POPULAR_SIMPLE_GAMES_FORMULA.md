# Popular “simple games” — cross-genre formula (research synthesis)

This file distills recurring design patterns from **idle/clickers** (e.g. Cookie Clicker), **endless runners** (Subway Surfers, Temple Run, Canabalt lineage), **hypercasual** hits, **survivor-likes** (Vampire Survivors and followers), **incremental** games, **roguelites**, and **ultra-minimal viral** games (Flappy Bird). It is meant as a **feature checklist and design lens** for small-scope games with one dominant loop (similar in spirit to an endless dodger with meta progression).

**Sources:** Every link under [Sources opened & synthesized](#sources-opened--synthesized-march-2026) was fetched and summarized in **March 2026**. Treat this as **pattern language**, not a scientific sample.

---

## 1. The “ultimate formula” (what keeps showing up)

These elements appear again and again across different “simple” hits. Strong games usually stack **several** layers, not just one.

### A. Clarity in one screenshot

- **Obvious goal** (survive, score, collect, grow a number, reach the next unlock).
- **Readable failure** (you know why you died or stalled).
- **Low tutorial burden** — ideally learn by doing in under a minute.

*Supported by:* hypercasual guidance on instant play and minimal onboarding ([Adjust](https://www.adjust.com/blog/how-to-make-a-hyper-casual-game-successful/), [GameAnalytics](https://gameanalytics.com/blog/4-key-steps-to-making-a-successful-hyper-casual-game)); survivor-likes where stakes read from one glance ([Epic Games Store](https://store.epicgames.com/en-US/news/vampire-survivors-built-genre-autoshooter-bullet-heaven)).

### B. A tight core loop

- **Short cycle**: act → feedback → consequence within seconds.
- **Repeatable** without cognitive overload (muscle memory friendly).
- **Skill + luck mix**: pure skill burns players out; pure randomness feels unfair. Hits often blend **predictable rules** with **variable moments** (power-ups, loot, spawns, golden cookies).

### C. Numbers, juice, and milestones

- **Visible progression**: score, distance, currency, tiers, levels — something always moving.
- **Milestone cadence**: achievements, new tiers, evolutions, “first time you see X” — avoids a flat grind.
- **Juice** (particles, hit-stop, sound stingers, screen shake within reason) sells impact without adding rules.

*Cookie Clicker analysis explicitly ties each purchase to visual feedback and falling cookies* ([Game Developer — recipe](https://www.gamedeveloper.com/design/the-recipe-behind-cookie-clicker)).

### D. Automation and delegation (genre-dependent)

- **Idle/incremental**: reinvest to speed up production; unlock generators; eventually **prestige** to reset for multipliers.
- **Survivor-likes**: **auto-attack** delegates shooting; player focuses on **positioning and build choices** ([Ars Technica](https://arstechnica.com/gaming/2022/10/vampire-survivors-a-cheap-minimalistic-indie-game-is-my-game-of-the-year/), [The Verge — Galante interview](https://www.theverge.com/2022/2/19/22941145/vampire-survivors-early-access-steam-pc-mac-luca-galante)).
- **Runners**: character **auto-runs**; player handles **lanes / jump / slide** — same delegation idea ([Game World Observer](https://gameworldobserver.com/2016/06/24/subway-surfers-gameplay-analysis)).

### E. Variable rewards

- Random bonuses, crit moments, chest openings, rare drops, “golden” events — **intermittent reinforcement** keeps anticipation high when the core loop is simple.
- *Design ethics note:* same family of effects as casino-adjacent UX; several primary sources discuss this openly ([The Verge — Vampire Survivors](https://www.theverge.com/2022/2/19/22941145/vampire-survivors-early-access-steam-pc-mac-luca-galante); [Orteil on idle + microtransactions](https://www.vice.com/en/article/n7bypk/cookie-clicker-wasnt-meant-to-be-fun-why-is-it-so-popular-8-years-later)).

### F. Meta progression (especially for permadeath / short runs)

- **Something persists** after a bad run: currency, unlocks, cosmetics, new modes, permanent upgrades.
- Makes **failure feel productive** — roguelites vs. roguelikes framed explicitly as extrinsic between-run rewards ([Eric Arbizzani — Roguelike Compass](https://www.ericarbizzani.com/blog/the-roguelike-compass)).

### G. Content gates as discovery

- Show **locked** content (known unknowns) or hide surprises (unknown unknowns) so the horizon keeps expanding.
- Incremental design: gate features on currency tiers — *Cookie Clicker* cited as “unknown unknowns” until unlocked ([Envato Tuts+](https://gamedevelopment.tutsplus.com/articles/numbers-getting-bigger-the-design-and-math-of-incremental-games--cms-24023)).

### H. Session fit

- **Pick up / put down** friendly: clear breakpoints, quick restarts, short runs optional.
- Hypercasual: **one-thumb**, **seconds to play**, short sessions ([Adjust](https://www.adjust.com/blog/how-to-make-a-hyper-casual-game-successful/)).
- **GameAnalytics** adds a concrete benchmark: **D1 retention below ~30%** means major iteration needed ([GameAnalytics](https://gameanalytics.com/blog/4-key-steps-to-making-a-successful-hyper-casual-game)).

### I. Identity and vibe

- Distinct **audio hook** (runners often lean on energetic loops).
- **Readable art** (silhouette, contrast, lanes) over raw fidelity.
- **Cosmetics / collection** for expression without breaking balance.

### J. Low friction access

- Free web play, tiny price, or demo; **no account** lowers friction for historical web hits ([Game Developer — recipe](https://www.gamedeveloper.com/design/the-recipe-behind-cookie-clicker)).
- Technical: stable performance, readable UI, comfortable controls for the platform.

---

## 2. Genre capsules (signature features)

### Idle / clicker (Cookie Clicker lineage)

| Pattern | Why it lands |
|--------|----------------|
| Click → spend → automate | Turns attention into infrastructure |
| Exponential curves + new buildings/upgrades | Always a “next” purchase |
| Achievements and hidden layers | Long horizon, completionist bait |
| Random special events (e.g. golden cookies) | Spices deterministic math |
| Prestige / reset for multipliers | Refreshes late-game without new art |

**Further reading:** [Game Developer — The recipe behind Cookie Clicker](https://www.gamedeveloper.com/design/the-recipe-behind-cookie-clicker), [Game Developer — The clicker phenomenon and pure progression models](https://www.gamedeveloper.com/design/the-clicker-phenomenon-and-pure-progression-models), [VICE — Cookie Clicker popularity / Orteil interview](https://www.vice.com/en/article/n7bypk/cookie-clicker-wasnt-meant-to-be-fun-why-is-it-so-popular-8-years-later).

### Endless runner (Temple Run → Subway Surfers and beyond)

| Pattern | Why it lands |
|--------|----------------|
| Auto-forward motion | Constant pressure without complex input |
| Lanes / jump / slide (simplified from early 3D runners) | Lower skill floor, fewer unfair camera issues |
| Coins + missions + events | Gives purpose beyond raw score |
| Power-ups and variable pickups | Breaks rhythm, dopamine spikes |
| Leaderboards + cosmetics | Social proof + collection |

**Further reading:** [Game World Observer — Subway Surfers gameplay analysis](https://gameworldobserver.com/2016/06/24/subway-surfers-gameplay-analysis), [Medium (Udonis) — Subway Surfers lessons](https://medium.com/udonis/subway-surfers-lessons-from-the-record-breaking-mobile-game-8a0d26635945).

### Hypercasual / hybrid-casual (2020s market)

| Pattern | Why it lands |
|--------|----------------|
| One core verb, taught in seconds | Minimizes drop-off in ads and stores |
| Satisfying motion / VFX | “Feel” sells in short clips |
| Progressive difficulty + quick restart | “One more try” without setup cost |
| Light progression or cosmetics | Retention beyond first session |

**Further reading:** [Pocket Gamer.biz — State of hypercasual 2024](https://www.pocketgamer.biz/the-state-of-the-hypercasual-genre-in-2024/) (guest: Sergey Martinkevich, Azur Games), [Adjust — Hyper casual success](https://www.adjust.com/blog/how-to-make-a-hyper-casual-game-successful/), [GameAnalytics — Key steps](https://gameanalytics.com/blog/4-key-steps-to-making-a-successful-hyper-casual-game).

### Survivor-like / bullet-heaven (Vampire Survivors lineage)

| Pattern | Why it lands |
|--------|----------------|
| Horde clarity + auto-combat | Power fantasy with low APM |
| Build choices on level-up | Player story each run (“my build”) |
| Short runs, huge power curve | Drama compressed (often ~15–30 min cited) |
| Chest / level-up presentation as “moments” | Celebratory beats; dev ties to slots/VFX craft |
| Meta currency between runs | Bad runs still feed unlocks |

**Further reading:** [Epic Games Store — Vampire Survivors / survivor-like](https://store.epicgames.com/en-US/news/vampire-survivors-built-genre-autoshooter-bullet-heaven), [Ars Technica — GOTY-style review](https://arstechnica.com/gaming/2022/10/vampire-survivors-a-cheap-minimalistic-indie-game-is-my-game-of-the-year/), [The Verge — Galante interview](https://www.theverge.com/2022/2/19/22941145/vampire-survivors-early-access-steam-pc-mac-luca-galante).

### Incremental / “numbers go up” (general)

| Pattern | Why it lands |
|--------|----------------|
| Reinvestment changes the rate of growth | Player agency over the curve |
| Automation + offline / passive layers | Fits real life schedules |
| Prestige and soft resets | Handles unbounded scaling |
| Theme + UI clarity | Makes abstract math feel like one game |

**Further reading:** [Envato Tuts+ — Numbers getting bigger (design & math)](https://gamedevelopment.tutsplus.com/articles/numbers-getting-bigger-the-design-and-math-of-incremental-games--cms-24023), [Paper Pilot — Guide to Incrementals](https://paperpilot.dev/guide-to-incrementals/) (hub; deep pages linked from there).

### Roguelite run structure (cross-genre)

| Pattern | Why it lands |
|--------|----------------|
| Procedural or varied layouts | Reduces memorization fatigue |
| Permadeath or run loss | Stakes and stories |
| Meta unlocks | Softens loss aversion |

**Further reading:** [Geniuscrate — Roguelike mechanics](https://www.geniuscrate.com/breaking-down-the-mechanics-of-roguelike-games-why-they-re-so-addictive), [Eric Arbizzani — Roguelike Compass](https://www.ericarbizzani.com/blog/the-roguelike-compass).

### Ultra-minimal viral (Flappy Bird)

| Pattern | Why it lands |
|--------|----------------|
| One input | Shareable, mockable, cloned endlessly |
| “Easy to learn, hard to master” | Designer framed like sport / ping-pong rhythm |
| Instant restart | Compulsive retry loop |
| Brutal difficulty from iteration | Difficulty increased as dev got bored playtesting |

**Further reading:** [Wikipedia — Flappy Bird](https://en.wikipedia.org/wiki/Flappy_Bird), [The Verge — rise and fall hub](https://www.theverge.com/2014/2/11/5402688/flappy-bird-mobile-game-rise-and-fall), [Polygon — Dong Nguyen interview (difficulty, sport philosophy)](https://www.polygon.com/2014/7/21/5923105/flappy-bird-interview-dong-nguyen).

---

## 3. Map to Skyfall-shaped projects (endless dodger + meta)

Your repo describes **procedural endless dodger — heat phases, bosses, perks**. The formula sections that overlap most strongly:

- **Runner / hypercasual**: auto pressure, lane-like readability, quick restart, session length.
- **Roguelite**: perks, bosses, and **between-run** progression if present.
- **Survivor-like** (partial): build variety during a run without overwhelming inputs.
- **Incremental** (optional): persistent currencies and unlock tiers if you lean meta-heavy.

Use section **1** as a **prioritized backlog lens**: clarity → loop → milestones → meta → variable beats → identity.

---

## 4. Checklist (copy-friendly)

- [ ] One-sentence pitch matches what a new player does in 30 seconds.
- [ ] Failure is understandable; restart is one action.
- [ ] Core loop under ~3 seconds per meaningful feedback cycle.
- [ ] At least one **always-visible** progress signal (score, time, tier, currency).
- [ ] Milestones every few minutes of first-time play (new rule, enemy, perk, or goal).
- [ ] At least one **variable** positive surprise in a typical session.
- [ ] Meta or cosmetics if runs are short and lethal.
- [ ] Audio + hit feedback make success and failure distinct.
- [ ] Difficulty ramps via **readable** signals (speed, density, patterns), not hidden dice.
- [ ] Optional: collection / achievements for long-tail players.

---

## 5. Caveats

- **Correlation ≠ causation**: press narratives mix luck, timing, platform algorithm, and IP.
- **Ethics**: variable reward schedules and dark patterns can extract engagement; decide your bar.
- **Platform**: mobile F2P success mixes design with UA, monetization, and live ops — only partially covered here.

---

## Sources opened & synthesized (March 2026)

Each entry: **what we took from the live page** (not a full reproduction). Follow the link for the complete article.

### Cookie Clicker / idle

1. **[The recipe behind Cookie Clicker](https://www.gamedeveloper.com/design/the-recipe-behind-cookie-clicker)** — Tino van der Kraan, *Game Developer*, 28 Oct 2013 (republished blog). **Takeaways:** giant cookie + hover affordance teaches click immediately; no account, JS-only access; tab title shows cookie count; passive gain while tab open; prestige (“heavenly cookies”) and achievements as endgame; explicit “positive reinforcement loop” and exponential spacing of rewards.

2. **[The Clicker Phenomenon and pure Progression Models](https://www.gamedeveloper.com/design/the-clicker-phenomenon-and-pure-progression-models)** — Josh Bycer, *Game Developer*, 1 Apr 2015. **Takeaways:** clickers as **pure progression** — numbers up → unlock faster numbers; compares scale/grind loop to ARPGs; “sizzle” (art, combat, variety) is what pure systems lack vs. Diablo-like wrappers; if your progression is weaker than a clicker’s, expect engagement to suffer.

3. **[‘Cookie Clicker’ Wasn’t Meant to Be Fun…](https://www.vice.com/en/article/n7bypk/cookie-clicker-wasnt-meant-to-be-fun-why-is-it-so-popular-8-years-later)** — Patrick Klepek, *VICE*, 2021 (Steam launch context). **Takeaways:** **Orteil (Julien Thiennot)** quote — idle games tap “getting something done” vs. unclear real-world progress; game started as joke; **no microtransactions** by designer intent (“addictive idle gameplay and microtransactions” as questionable mix); repetition defended when it has “substance and sincerity”; genre history nods (Progress Quest, Cow Clicker, FarmVille).

### Endless runner

4. **[Subway Surfers: a Gameplay Analysis](https://gameworldobserver.com/2016/06/24/subway-surfers-gameplay-analysis)** — *Game World Observer*, 24 Jun 2016. **Takeaways:** removed **Temple Run** turns + gyro → **straight line, three tracks**; retention framed with **Bartle types** (achiever/explorer/socialiser/killer); live **friend scores during run**; missions → **score multipliers**; daily word-hunt on track; time-limited cosmetics; **hoverboards** as crash insurance vs Temple Run’s paid revive analog; regular world/character updates.

5. **[Subway Surfers: Lessons from the Record-Breaking Mobile Game](https://medium.com/udonis/subway-surfers-lessons-from-the-record-breaking-mobile-game-8a0d26635945)** — Andrea Knezovic, Udonis, 31 Jan 2024. **Takeaways:** cites **4B+ lifetime downloads**, **~20M DAU / ~150M MAU**; SYBO/Kiloo history; **progressive speed**; missions (3 tasks → multiplier), quests, achievements; Sybo CMO quote on 2022 as “perfect storm” of metrics + social + team growth.

### Hypercasual / market

6. **[The state of the hypercasual genre in 2024](https://www.pocketgamer.biz/the-state-of-the-hypercasual-genre-in-2024/)** — Sergey Martinkevich (Azur Games guest), *PocketGamer.biz*, 10 Jun 2024. **Takeaways:** bar raised — need **core loop + progression + visuals + tech + animation + content variety**; **“hypercore”** term for hyper/casual blur; market and eCPM described as recovering; hits need **longer polish/iteration** than early hypercasual; **IAP share** of profit up to **~35%** (vs ~10–20% year prior); idle genre now expects **multiple mechanics + minigames** tied to main progression.

7. **[A guide to hyper casual games](https://www.adjust.com/blog/how-to-make-a-hyper-casual-game-successful/)** — *Adjust* (undated; live 2026). **Takeaways:** instant play, minimal onboarding, **single mechanic** + minimalist UI but **pleasing aesthetics + progression**; lists nine mechanic families (timing, rising/falling, puzzle, stacking, agility, growing, turning, swerving, merging); **A/B test** difficulty/speed; monetization: rewarded video, banners, interstitials; cites AppMagic download leaders (Jan 2024 examples).

8. **[4 Key Steps to Making a Successful Hyper-Casual game](https://gameanalytics.com/blog/4-key-steps-to-making-a-successful-hyper-casual-game)** — *GameAnalytics*. **Takeaways:** **short, simple, satisfying**; one mechanic focus; soft launch + **D1 retention under ~30%** = needs work; iterate ads vs retention via A/B tests; **Tom Kinniburgh** quote on playable/native-feeling ads.

### Vampire Survivors / survivor-like

9. **[How Vampire Survivors built its own unlikely genre…](https://store.epicgames.com/en-US/news/vampire-survivors-built-genre-autoshooter-bullet-heaven)** — Steven T. Wright, *Epic Games Store News*, 6 Jan 2025. **Takeaways:** credits **Magic Survival** as precursor; **pick up XP crystals** forces routing; chests → weapons + **meta coins**; evolved weapons gated by build rules; **15–30 minute** run shape; chest openings as **gacha-like** moments; “lunch break game” framing.

10. **[Vampire Survivors—a cheap, minimalistic indie game—is my game of the year](https://arstechnica.com/gaming/2022/10/vampire-survivors-a-cheap-minimalistic-indie-game-is-my-game-of-the-year/)** — Aaron Zimmerman, *Ars Technica*, Oct 2022. **Takeaways:** only **move + pick upgrades**; weapons **autofire**; **XP gems must be walked over** creates risk/reward; **6 weapons + 6 passives** cap forces build commitment; **30-minute** survival win condition; evolved weapon combos; gold → **between-run permanent stat upgrades**; compares to **idle** feel but more active; notes spectacle / photosensitivity risk.

11. **[Slaying monsters in Vampire Survivors is like walking through a casino](https://www.theverge.com/2022/2/19/22941145/vampire-survivors-early-access-steam-pc-mac-luca-galante)** — Jay Peters, *The Verge*, 19 Feb 2022. **Takeaways:** **Luca Galante** on slot-style **attention to sound/animation** from gambling-industry background; chest openings as **slot machine**-like; **Magic Survival** as prototype; strong feedback inspired by **Bayonetta / DMC** but made easy to trigger.

### Incremental math & guides

12. **[Numbers Getting Bigger: The Design and Math of Incremental Games](https://gamedevelopment.tutsplus.com/articles/numbers-getting-bigger-the-design-and-math-of-incremental-games--cms-24023)** — Alexander King, *Envato Tuts+*, 30 Jun 2015. **Takeaways:** **discovery** as core fun vector; **known unknowns vs unknown unknowns** gating; **idle vs clicker** split (autonomous rate growth vs active clicking); theme/UI coherence; formal triad: **(1) currency (2) passive growth (3) spend to increase growth rate**; nonlinear cost/benefit curves to avoid boredom.

13. **[Guide to Incrementals](https://paperpilot.dev/guide-to-incrementals/)** — The Paper Pilot (living doc, hub). **Takeaways:** meta-resource for genre definition, player/dev appeal, balancing; subpages linked from hub — use for deeper incremental-specific design.

### Roguelite vs roguelike

14. **[Breaking Down the Mechanics of Roguelike Games…](https://www.geniuscrate.com/breaking-down-the-mechanics-of-roguelike-games-why-they-re-so-addictive)** — *Geniuscrate* blog. **Takeaways:** procedural levels → novelty; **permadeath** + tension; **between-run unlocks** soften failure (*Hades* example); skill + incremental rewards loop.

15. **[The Roguelike Compass](https://www.ericarbizzani.com/blog/the-roguelike-compass)** — Eric Arbizzani. **Takeaways:** **roguelite vs roguelike** = extrinsic **between-run power** vs mostly intrinsic skill/knowledge; 2D model: **progression axis × luck axis**; same genre label can mean very different moods/energy.

### Flappy Bird

16. **[Flappy Bird](https://en.wikipedia.org/wiki/Flappy_Bird)** — *Wikipedia* (accessed Mar 2026). **Takeaways:** May 2013 iOS release, sleeper hit early 2014; developer cited **~$50k/day** from ads at peak; removed Feb 2014 over **addictive concerns**; ping-pong inspiration; difficulty tightened after playtesting boredom.

17. **[The extinction of ‘Flappy Bird’…](https://www.theverge.com/2014/2/11/5402688/flappy-bird-mobile-game-rise-and-fall)** — *The Verge* hub (updated Jan 2026). **Takeaways:** cultural moment + removal narrative; documents later **trademark / revival** stories **not** tied to Nguyen — useful context that “Flappy Bird” as IP has a messy afterlife.

18. **[Flappy Bird creator says game was inspired by bouncing a ping pong ball…](https://www.polygon.com/2014/7/21/5923105/flappy-bird-interview-dong-nguyen)** — *Polygon*, Jul 2014 (Gamelab). **Takeaways:** **Dong Nguyen** — sports-like **easy to learn, hard to master**; difficulty increased by **narrower gaps / shorter spacing** as he got bored; denies designing to make people lose — failure = accuracy maintenance; **no marketing** / “fire and forget” release philosophy; warns success **not repeatable**.

---

*Internal design reference. Re-fetch primary sources periodically; secondary blogs (e.g. Geniuscrate) are weaker evidence than first-party interviews and major outlets.*
