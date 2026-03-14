# Steam-Ready Gap Analysis & Expansion Plan

**Goal:** Turn the current game into a **nice, monetizable Steam title** (small price).  
**Scope:** What’s missing or bad today, and what to expand.

---

## Part 1 — What’s Wrong or Missing (Current State)

### 1.1 Identity & Branding (Critical)

| Issue | Where | Fix |
|-------|--------|-----|
| **Two different game names** | `index.html` + `beginningScene.js`: **"Interval Dodger"**. Game over + `localStorage`: **"Skyfall"**. | Pick **one** commercial name (e.g. Skyfall or Interval Dodger) and use it everywhere: title, scenes, localStorage key, build metadata. |
| **Wrong instructions** | Beginning scene says *"Survive to **35** score, then touch the right edge"*. Actual exit unlock is **120**. | Update copy to match `EXIT_UNLOCK_SCORE` (120) or make it config-driven. |
| **Portfolio, not product** | Introduction scene is a **full CV/bio** (name, age, TOEFL, RSAT, A1 Bulgaria, SoftUni, etc.). Choice scene: "Welcome To The Midpoint", "Go Back To Info", "View Websites", "Play My Game". | For a **paid Steam game**, remove or replace with **game-focused** content: story/lore, how to play, credits, link to your studio/support — not personal CV in the main flow. |
| **External links** | `websites.js` points to **personal portfolio** demos (Angular/React). | For Steam: replace with **game** links only: Store page, Discord, Support, Credits — or remove "View Websites" and fold into a single "More" / "Credits" screen. |
| **Page framing** | Header says "Phaser + Vite" and "Procedural top-down dodger…". | Feels like a tech demo. Use **game title + tagline** and optional "Powered by Phaser" in footer/credits. |

---

### 1.2 Platform & Distribution (Critical for Steam)

| Issue | Where | Fix |
|-------|--------|-----|
| **Web-only** | App runs in browser via Vite; no desktop binary. | Steam expects a **runnable build** (Windows, optionally Mac/Linux). Use **Electron** (or similar) to wrap the Vite build, or export to a desktop runtime; add install/launch flow. |
| **No Steamworks** | No Steam SDK integration. | Add **Steamworks** (or greenworks/steamworks.js for Node/Electron): **Achievements**, **Cloud Saves** (optional), **Rich Presence** (e.g. "In game – Score: 45"), overlay support. |
| **Single save** | Only `localStorage.skyfall_highscore` (or current name). | For Steam: **structured save file** (e.g. JSON) with high score, settings, unlocks, and **Steam Cloud** sync so progress survives reinstall. |
| **No build metadata** | `package.json`: generic "my-game-demo", no version in UI. | Set **product name**, **version** (e.g. 1.0.0), and show version in-game (e.g. Options or Credits) for support. |

---

### 1.3 Settings & Options (High)

| Issue | Where | Fix |
|-------|--------|-----|
| **No settings screen** | Nowhere in app. | Add **Options / Settings** (from main menu or pause): **Music volume**, **SFX volume**, **Fullscreen toggle**, **Resolution** (or quality preset). |
| **No keybind UI** | Keys are hardcoded (WASD, arrows, 1/2/3). | Add **Controls** tab: show current bindings; optionally **rebindable keys** and persist in save file. |
| **Audio hardcoded** | `DODGE_AUDIO` in `dodgeHudStyles.js`; no user control. | Drive volumes from a **settings** object (e.g. `settings.musicVolume`, `settings.sfxVolume`) saved to disk/Steam Cloud; apply in `createAudio()` and when playing sounds. |
| **No fullscreen** | Phaser scale is FIT + CENTER_BOTH; no fullscreen API. | Add **Fullscreen** toggle in Options; use browser/Electron fullscreen API and persist preference. |

---

### 1.4 Onboarding & UX (High)

| Issue | Where | Fix |
|-------|--------|-----|
| **Text-only tutorial** | Beginning scene: one block of text (move, dodge, survive to X, touch right). | Improve with **first-run tutorial**: optional overlay with step-by-step (move, dodge one hazard, pick up, exit), or short **interactive hints** in first run. |
| **No pause** | Dodge game has no pause. | **Pause** on Escape (or dedicated key): pause physics/audio, show "Paused" + Resume / Options / Quit to menu. |
| **No "Quit to menu"** | In-game you can only replay or exit at score 120. | Add **Quit to menu** in pause (and optionally on game over) so players can leave without closing the app. |
| **Replay = same scene** | Replay calls `resetRun()` in same scene. | Fine for now; ensure **Quit to menu** goes to a proper **main menu** (not portfolio Choice hub). |
| **Game over copy** | "Skyfall Ended" + Score + Best. | Align with final game name; consider short **run summary** (time survived, objectives completed, perks taken) for satisfaction. |

---

### 1.5 Content & Replayability (Medium–High)

| Issue | Where | Fix |
|-------|--------|-----|
| **One mode** | Single endless dodge run. | Add **difficulty levels** (e.g. Normal / Hard) or **game modes** (Classic, Time Attack, Daily Challenge with seed) to justify a paid price. |
| **No leaderboards** | Only local best in `localStorage`. | For Steam: **Steam Leaderboards** (e.g. best score, longest survival) to drive replay and visibility. |
| **No achievements** | None. | Define **Steam Achievements** (e.g. First run, Score 50/100/120, Beat a boss, Complete objective, Collect N perks) and hook them to existing events. |
| **Limited meta-progression** | Perks only within a run. | Optional: **persistent unlocks** (e.g. starting perks, cosmetics, or difficulty unlocks) saved and synced via Steam Cloud. |
| **Challenges/perks** | 8 perks, 4 challenge types. | Expand over time: more perks, more challenge types, or mutators to keep runs varied. |

---

### 1.6 Polish & Accessibility (Medium)

| Issue | Where | Fix |
|-------|--------|-----|
| **No loading screen** | Preload runs; no progress or "Loading…" for slow connections. | Add **loading scene** or splash with progress bar so players see feedback during asset/audio load. |
| **No error handling** | If audio or texture creation fails, no user message. | **Try/catch** or Phaser load errors → show a simple "Something went wrong" + Retry, and log for support. |
| **Fonts** | Everything **Arial**. | Consider a **distinctive font** (even one free font) for title and HUD to feel less generic. |
| **Accessibility** | No subtitles, no color-blind options, keybinds not shown in UI. | **Subtitles/captions** for any voiced or important text; document keys in Options; consider **high-contrast / color-blind** option for hazards. |
| **Icon & favicon** | `index.html`: `href="data:,"` (blank favicon). | Add a proper **game icon** (and Steam capsule art later). |

---

### 1.7 Technical & Legal (Medium)

| Issue | Where | Fix |
|-------|--------|-----|
| **Dependency on GitHub** | `phaser3-juice-plugin` from `github:RetroVX/phaser3-juice-plugin`. | Pin exact commit/tag or **vendor** the plugin so builds don’t break if the repo changes. |
| **No EULA / Privacy** | Not present. | For Steam: **Steam EULA** applies; add in-game **Privacy Policy** link if you collect anything; **refund** policy is via Steam. |
| **No version in UI** | Users/support can’t see build version. | Show **version** in Options or Credits (e.g. "v1.0.0"). |
| **Mobile in Steam build** | Joystick overlay and mobile CSS are for web/mobile. | In **desktop/Steam** build, hide or disable mobile-only UI to avoid clutter. |

---

## Part 2 — What to Expand (Roadmap)

### 2.1 Must-Have for “Nice Game on Steam at a Small Price”

1. **Single, clear identity**  
   - One game name everywhere (title, scenes, saves, game over).  
   - Main menu that feels like a **game** (Play, Options, Credits, Quit), not a portfolio hub.

2. **Desktop + Steam**  
   - **Electron** (or equivalent) wrapper around Vite build.  
   - **Steamworks**: Achievements, Cloud Saves (save file with high score + settings), Rich Presence.  
   - **Steam build pipeline**: Windows (and Mac/Linux if you want).

3. **Options**  
   - **Audio**: Music volume, SFX volume.  
   - **Display**: Fullscreen, resolution or quality preset.  
   - **Controls**: Show keybinds; optional rebinding later.  
   - All persisted in save file and Steam Cloud.

4. **Pause + Quit**  
   - **Pause** (e.g. Escape): pause game, Resume / Options / Quit to menu.  
   - **Quit to menu** from pause and from game over.

5. **Correct copy & flow**  
   - Fix "Survive to 35" → 120 (or config).  
   - Remove or replace CV/intro with game intro or skip.  
   - Replace "View Websites" with game links or Credits.

6. **Save system**  
   - One **save file** (e.g. JSON): high score, options, unlocked content if any.  
   - Local + **Steam Cloud** so progress survives reinstall.

7. **Store presence**  
   - **Capsule art**, **screenshots**, **short trailer**, **description**, **price** (e.g. $2.99–4.99).  
   - Clear "What you get": e.g. endless dodge, phases, bosses, challenges, perks, objectives.

---

### 2.2 Should-Have (More Value for Price)

1. **Achievements**  
   - 10–15 meaningful achievements (first run, score milestones, boss kill, objectives, perks).  
   - Hook into existing events in `dodgeGame.js` and spawn/objective/challenge logic.

2. **Leaderboards**  
   - Steam Leaderboards: e.g. Best Score, Longest Survival (seconds).  
   - Submit on game over and on voluntary exit.

3. **Loading & errors**  
   - Loading scene with progress.  
   - Simple error message + Retry if load fails.

4. **Run summary**  
   - Game over: score, best, time survived, objectives completed, "New record" when applicable.

5. **Difficulty or mode**  
   - At least **Normal / Hard** (e.g. faster ramp, fewer shields) or a second mode (e.g. Time Attack) to differentiate from free web demos.

6. **Credits**  
   - Credits scene: game name, your name/studio, tech (Phaser, Vite), music/sfx if any, link to support/Discord.

---

### 2.3 Nice-to-Have (Polish)

1. **Tutorial**  
   - First-run overlay or optional tutorial level (move, dodge, pickup, exit).

2. **More content**  
   - More perks, more challenge types, more boss variety or mutators.

3. **Meta-progression**  
   - Unlockable starting perks or cosmetics, saved and synced.

4. **Accessibility**  
   - Subtitles, high-contrast option, keybinds visible in UI.

5. **Font & icon**  
   - Custom or licensed font; proper favicon and Steam assets.

---

## Part 3 — Summary Tables

### What’s bad or missing (by area)

| Area | Severity | Items |
|------|----------|--------|
| Identity / branding | Critical | Two names (Interval Dodger vs Skyfall), wrong exit score (35 vs 120), portfolio CV in main flow, portfolio links |
| Platform / Steam | Critical | Web-only, no Steamworks, no desktop build, no cloud save |
| Settings | High | No options screen, no volume/fullscreen/resolution, no keybind display |
| Onboarding / UX | High | Text-only tutorial, no pause, no quit to menu |
| Content / replay | Medium–High | One mode, no leaderboards, no achievements, limited meta-progression |
| Polish / a11y | Medium | No loading screen, no error handling, Arial only, no accessibility options |
| Technical / legal | Medium | Juice plugin from GitHub, no EULA/version in UI |

### What to expand (priority)

| Priority | Expansion |
|----------|-----------|
| **P0** | Single game name + correct copy; remove/replace portfolio content and links; Options (audio, fullscreen, controls); Pause + Quit to menu; Save file + Steam Cloud; Desktop (Electron) + Steamworks (achievements, cloud save, rich presence); Store page (capsule, trailer, description, price). |
| **P1** | Achievements; Leaderboards; Loading scene; Error handling; Run summary on game over; Difficulty/mode; Credits. |
| **P2** | Tutorial; More perks/challenges; Meta-progression; Accessibility; Font + icon. |

---

## Part 4 — Suggested Next Steps

1. **Decide the product**  
   - Final **game name** (e.g. Skyfall or Interval Dodger).  
   - Position: "Endless dodge with phases, bosses, and perks" — no portfolio in main path.

2. **Fix identity & flow**  
   - Replace intro/choice/websites with **Main Menu** (Play, Options, Credits, Quit).  
   - Fix "Survive to 35" → 120.  
   - Use one name in game over and localStorage/save key.

3. **Add Options + Pause**  
   - Options: music, SFX, fullscreen, resolution (or quality).  
   - Pause menu: Resume, Options, Quit to menu.

4. **Implement save system**  
   - One JSON save (high score, settings, unlocks).  
   - Local file for Electron; sync via Steam Cloud when integrated.

5. **Electron + Steamworks**  
   - Wrap Vite build in Electron; add Steamworks; implement achievements and cloud save; test on Windows.

6. **Store assets**  
   - Capsule, screenshots, short trailer, description, set price (e.g. $2.99–4.99).

This document is the single source of truth for **what’s missing or bad** and **what to expand** for a Steam-ready, monetizable game at a small price.

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
