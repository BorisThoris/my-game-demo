# Skyfall — gap analysis beyond the 20 agent tasks

This document is a **deep, codebase-grounded** inventory of what is **missing, stubbed, incomplete, misleading, or drifted** relative to a polished commercial release—and how that relates to [`tasks/README.md`](../tasks/README.md): **AGENT-21–39** close these gaps; **AGENT-01–20** lean roadmap ([`SKYFALL_LEAN_FEATURES`](./SKYFALL_LEAN_FEATURES.md)); **AGENT-40–54** add “fully fledged” axes ([`FULLY_FLEDGED_EXPERIENCE`](./FULLY_FLEDGED_EXPERIENCE.md)).

**Scope:** Technical and product reality as of the repo state when this file was written. **Not** a commitment to fix everything; use it for prioritization and to avoid duplicate work.

---

## 1. Executive summary

| Layer | State |
|-------|--------|
| **Core loop** | Substantial: dodge, heat/phases, bosses, challenges (`ChallengeDirector`), perks, objectives, contracts, meta unlocks, achievements, options, pause, run summary. |
| **Agent tasks 01–20** | **Lean** improvements from `SKYFALL_LEAN_FEATURES.md`. |
| **Agent tasks 21–39** | **Gap / shipping** work from this document (platform, economy clarity, UI honesty, E2E, docs). |
| **Largest gaps (now tasked)** | Each theme has a matching **AGENT-21–39** file in [`tasks/`](../tasks/README.md) (see §10). |

---

## 2. Platform and distribution

### 2.1 Electron shell

| Topic | Evidence | Gap |
|-------|-----------|-----|
| **Window** | [`electron/main.js`](../electron/main.js) creates `BrowserWindow`, loads Vite dev URL or `dist/index.html`. | No game-specific IPC beyond quit. |
| **Preload** | [`electron/preload.js`](../electron/preload.js) exposes only `window.electronQuit`. | **No** bridge for Steam, file paths, or window controls from the game. |
| **Title** | Window title `"Skyfall"`. | OK. |

**Implication:** Shipping a **Steam** build requires a **second layer**: native/Node Steamworks binding (e.g. greenworks, steamworks.js, or game-specific native module) and **`setOnlineAdapter`** / save hooks from the renderer—**none of that is wired** in this repo today.

### 2.2 Steamworks and online adapters

| Topic | Evidence | Gap |
|-------|-----------|-----|
| **Default adapter** | [`app/services/onlineService.js`](../app/services/onlineService.js) sets `activeAdapter = makeLocalAdapter()`. | `unlockAchievement`, `submitLeaderboardScore`, `setRichPresence`, `saveToCloud` / `loadFromCloud` **resolve successfully without network or Steam**. |
| **Steam adapter factory** | `createSteamAdapter(provider)` expects `provider.unlockAchievement`, `submitLeaderboardScore`, etc. | **`setOnlineAdapter` is never called from `app/index.js` or `main.js`** with a real provider—Steam path is **dormant**. |
| **Leaderboard submission** | `submitRunLeaderboards` (e.g. from run end) pushes scores into adapter/queue. | **No UI** consumes `getLeaderboardEntries`—grep shows usage only in **`onlineService.js`** and **`test/onlineService.test.js`**. Players **never see** boards. |

**Relation to tasks:** [`AGENT-13`](../tasks/AGENT-13-online-telemetry-audit.md) covers **audit / stub / compile-time strip**—not implementing Steam.

### 2.3 Cloud saves

| Topic | Evidence | Gap |
|-------|-----------|-----|
| **Save write** | [`saveManager.js`](../app/save/saveManager.js) `setSave` → dynamic import `saveToCloud(toWrite, () => {})`. | Local adapter `saveToCloud` returns `{ ok: true }` **without persisting remotely**. |
| **Boot merge** | `initSaveFromCloud` → `loadFromCloud(callback)`. | Local `loadFromCloud` returns `null`; merge compares **`highScore`**, **`lastCompletedLevel`**, **`settings`** only—**not** a full save merge (e.g. `highScoresByMode`, `metaCurrency`, `contracts`, `unlockedAchievements` may be incomplete vs a real cloud payload). |

**Risk:** If a future Steam cloud payload is **richer** than this merge, you can **lose or skew** progress unless merge logic is expanded and versioned.

### 2.4 Resolution and display settings

| Topic | Evidence | Gap |
|-------|-----------|-----|
| **Options UI** | [`optionsScene.js`](../app/scenes/optionsScene.js) toggles `resolutionOrQuality` (`1280x720` / `1920x1080`) and persists via `setSettings`. | Setting is **saved** but **not applied** to Phaser’s canvas size in a traced code path. |
| **Game dimensions** | [`gameConfig.js`](../app/config/gameConfig.js) exports `GAME_WIDTH` / `GAME_HEIGHT` from **`theme.components.game.layout`**. | Fixed layout from tokens—**no** `scale.resize` or dynamic `game.config` update tied to `resolutionOrQuality`. |

**User-facing effect:** The resolution row **looks like a real option** but **does not change** internal resolution the way a PC player expects (unless some uncaptured mechanism exists outside these files).

**Relation to tasks:** Not covered by AGENT-01–20.

---

## 3. Economy and progression clarity

### 3.1 Two parallel buckets: `metaCurrency` vs `metaFragments`

| Mechanism | Location | Behavior |
|-----------|-----------|----------|
| **Meta shop** | [`metaScene.js`](../app/scenes/metaScene.js), [`metaProgression.js`](../app/game/metaProgression.js) | UI displays **`metaCurrency`** only. |
| **Contract claims** | `claimCompletedContract` in [`saveManager.js`](../app/save/saveManager.js) | Adds **`metaCurrency`** and **`metaFragments`** from `reward.currency` / `reward.fragments`. |
| **`addMetaFragments`** | `saveManager.js` | Increments **both** `metaFragments` **and** `metaCurrency` by the same amount. |
| **`getMetaProgression`** | `saveManager.js` | Returns `{ currency, unlockFragments }`—fragments exposed to callers but **not** the meta scene. |

**Issues:**

1. **Cognitive load:** Contracts and UI mention **“f” fragments** (e.g. main menu claims) while the meta screen only shows **currency**.
2. **Dual path:** Some rewards inflate **both** pools via `addMetaFragments`; contract rewards add **independently** to each—**economy semantics are easy to misread** when balancing.
3. **Spend sink:** If `metaFragments` are intended as a **second spend currency**, there is **no** dedicated spend UI in `metaScene`; if they are **flavor-only**, the extra counter and copy still confuse.

**Relation to tasks:** **Not** in AGENT-01–20; optional backlog item: **unify or explain** (single currency + rename, or second row + sinks).

### 3.2 `lastCompletedLevel`

| Topic | Evidence | Gap |
|-------|-----------|-----|
| **Purpose** | Used in [`contractDirector.js`](../app/game/contractDirector.js) `createDifficultyProfile` and [`runnerContent.js`](../app/game/runnerContent.js) level commentary. | Drives **difficulty tier** without a clear **player-visible “level”** in HUD unless implemented elsewhere. |
| **Persistence** | `setLastCompletedLevel` / `getLastCompletedLevel` in `saveManager.js`. | **Opaque** to most players—documentation in UI is thin. |

---

## 4. Features that exist but are thin or misleading

| Feature | What exists | What’s missing / misleading |
|---------|-------------|-----------------------------|
| **Editor (`#/editor`)** | [`editorScene.js`](../app/scenes/editorScene.js): placeholder text + Back. | No editing tools. **AGENT-12** gates prod registration—does not build editor. |
| **Key rebinding** | [`controlLabels.js`](../app/config/controlLabels.js): “rebinding not implemented yet”; Options lists bindings. | No rebind UI, no persisted custom keys. |
| **Leaderboards** | Submit API + queue + daily seed id in `onlineService.js`. | **No in-game leaderboard scene**; `getLeaderboardEntries` **unused** outside tests. |
| **Telemetry** | [`telemetry.js`](../app/game/telemetry.js): events in `localStorage`; `flushTelemetryBatch` needs **`setTelemetryUploadHook`**. | Default build likely **never uploads**—data sits local until hook provided. |
| **Achievements vs Steam** | In-game list + `unlockAchievement` in online service. | Without Steam adapter, **Steam Achievement unlocks** do not fire on Valve’s side. |
| **Fullscreen** | Options toggles Phaser `scale.startFullscreen` / `stopFullscreen`. | Browser/Electron quirks vary; worth **QA matrix** (not a task file). |

---

## 5. Accessibility and presentation

| Area | Implementation | Limits |
|------|----------------|--------|
| **Screen shake / flash** | Options scale; `dodgeGame.js` reads `accessibilitySettings`. | Good baseline. |
| **Color-blind palette** | `dodgeGame.js` maps **warm / cool / mid** via `colorBlindPaletteMode`. | **Not** a full semantic recolor per hazard type—effectiveness depends on art. |
| **Typography** | Widespread **Arial** (menus, HUD). | **Brand differentiation** weak vs commercial titles; no task covers font licensing/pipeline. |
| **Photosensitivity** | Flash intensity slider exists. | **Juice plugin** and other effects may still combine flashes—no holistic “safe mode” audit. |
| **Audio load failures** | Not deeply surfaced to player. | STEAM doc called out **retry / message** patterns—still a gap. |

---

## 6. Content, onboarding, narrative

| Area | State | Gap |
|------|--------|-----|
| **Tutorial** | Tutorial scene + `shouldShowTutorial` / opt-out in save. | Depth vs **interactive** onboarding is a **design** choice; [`BACKLOG-OPTIONAL-STRIPS.md`](../tasks/BACKLOG-OPTIONAL-STRIPS.md) mentions shorten/remove. |
| **Lore / campaign** | None. | Intentional for arcade scope. |
| **Credits** | `creditsScene.js`. | Small; optional strip in backlog. |
| **Orphan portfolio scenes** | `beginningScene`, `choiceScene`, `introductionScene`, `websitesScene`, `navigationScene` **not** in [`app/index.js`](../app/index.js) scene list. | **AGENT-11** deletion candidate; narrative in those files is **not** player-facing in current boot. |

---

## 7. Codebase and documentation drift

| Document | Risk |
|----------|------|
| [`STEAM_READY_GAP_ANALYSIS.md`](../STEAM_READY_GAP_ANALYSIS.md) | **Partially outdated**: claims no options, no pause, no achievements, web-only, blank favicon, etc.—**many are fixed** (Options, meta, achievements, Electron, favicon, loading). **Still valid** for: real Steamworks, real cloud, real resolution behavior, in-game leaderboard display, EULA/privacy. |
| [`APP_ANALYSIS_FULL.md`](../APP_ANALYSIS_FULL.md) (if present) | May describe **BeginningScene as first scene**—current boot is **Loading → MainMenu** per `index.js`. |
| **Two names / wrong copy** | STEAM doc cited “Interval Dodger” / score 35 vs **120**—verify [`index.html`](../index.html) and [`beginningScene.js`](../app/scenes/beginningScene.js) if orphan files remain after AGENT-11. |

---

## 8. Testing and quality gates

| Layer | Coverage | Gap |
|-------|-----------|-----|
| **Unit tests** | `test/` includes contracts, save, online mocks, meta, bosses, etc. | Does not cover **full scene flows**. |
| **E2E** | [`e2e/game.spec.js`](../e2e/game.spec.js): start game, canvas visible, arrow key, no `console.error` on start. [`boot.spec.js`](../e2e/boot.spec.js), [`panels.spec.js`](../e2e/panels.spec.js). | **No** automated path through: challenge 1–2–3, perk draft, game over summary, meta purchase, contract claim, options persistence. |
| **AGENT-20** | Regression gate after merges. | Runs existing tests—**does not mandate** new E2E breadth. |

---

## 9. Legal, privacy, support (no agent coverage)

| Topic | Note |
|-------|------|
| **Privacy** | If telemetry **upload** is enabled later, you need **disclosure** and opt-out policy consistent with platform rules. |
| **Steam** | Store page EULA/support/refund expectations; optional **in-game “About”** with version + link (version already in Options via `GAME_VERSION`). |
| **Third-party** | `phaser`, `phaser3-juice-plugin` (GitHub pin)—[`docs/DEPENDENCIES.md`](./DEPENDENCIES.md) documents pin; legal notices in credits if required by licenses. |

---

## 10. Mapping gaps to `tasks/` (AGENT-01–39)

| This document (themes) | Task coverage |
|--------------------------|----------------|
| Orphan scenes, `sceneKeys` | **AGENT-11** |
| Editor prod gate | **AGENT-12** |
| Online + telemetry audit / stub | **AGENT-13** |
| Optional mode / objectives removal | **AGENT-14, 15** (approval) |
| HUD / session / formula checklist | **AGENT-16, 17** |
| Tier C deferrals doc | **AGENT-18** |
| Game over + options trim | **AGENT-19** |
| Lean regression gate | **AGENT-20** |
| Tier A/B lean features | **AGENT-01–10** |
| Electron IPC bridge | **AGENT-21** |
| Steam / `setOnlineAdapter` wiring | **AGENT-22** |
| Cloud save merge (full save) | **AGENT-23** |
| Resolution truth (wire or relabel) | **AGENT-24** |
| metaCurrency vs metaFragments | **AGENT-25** |
| `lastCompletedLevel` / tier visibility | **AGENT-26** |
| Key rebinding | **AGENT-27** |
| Leaderboard UI | **AGENT-28** |
| Telemetry upload + privacy toggle | **AGENT-29** |
| Offline / local adapter honesty UI | **AGENT-30** |
| Accessibility + presentation pass | **AGENT-31** |
| Audio load failure UX | **AGENT-32** |
| Tutorial / onboarding | **AGENT-33** |
| Credits + third-party licenses | **AGENT-34** |
| Doc drift (STEAM_READY, APP_ANALYSIS) | **AGENT-35** |
| Deep E2E | **AGENT-36** |
| About / privacy / support | **AGENT-37** |
| Fullscreen QA matrix | **AGENT-38** |
| Editor MVP or defer | **AGENT-39** |
| Optional strips (meta, contracts, archetypes, …) | [`BACKLOG-OPTIONAL-STRIPS.md`](../tasks/BACKLOG-OPTIONAL-STRIPS.md) → **AGENT-40+** if approved |

---

## 11. Follow-up epics → agent mapping

Ordered roughly by **dependency** and **player trust** (each line maps to **AGENT-21+**):

1. **Truth in settings** — **AGENT-24**
2. **Economy clarity** — **AGENT-25**
3. **Offline-first honesty** — **AGENT-30** (with **AGENT-28** copy)
4. **Steam epic** — **AGENT-21**, **AGENT-22**, **AGENT-23**
5. **Leaderboards UX** — **AGENT-28**
6. **E2E expansion** — **AGENT-36**
7. **Doc refresh** — **AGENT-35**

---

## 12. Key file index (quick navigation)

| Concern | Primary files |
|---------|----------------|
| Boot / scenes | [`app/index.js`](../app/index.js), [`app/config/sceneKeys.js`](../app/config/sceneKeys.js) |
| Save / meta / fragments | [`app/save/saveManager.js`](../app/save/saveManager.js), [`app/game/metaProgression.js`](../app/game/metaProgression.js), [`app/scenes/metaScene.js`](../app/scenes/metaScene.js) |
| Online / Steam-shaped API | [`app/services/onlineService.js`](../app/services/onlineService.js) |
| Telemetry | [`app/game/telemetry.js`](../app/game/telemetry.js) |
| Options | [`app/scenes/optionsScene.js`](../app/scenes/optionsScene.js) |
| Game layout size | [`app/config/gameConfig.js`](../app/config/gameConfig.js), [`app/config/styleTokens/`](../app/config/styleTokens/) |
| Electron | [`electron/main.js`](../electron/main.js), [`electron/preload.js`](../electron/preload.js) |
| Lean roadmap | [`docs/SKYFALL_LEAN_FEATURES.md`](./SKYFALL_LEAN_FEATURES.md) |
| Agent tasks | [`tasks/README.md`](../tasks/README.md) (AGENT-01–39 gap wave; **40–54** = fully fledged — [`FULLY_FLEDGED_EXPERIENCE.md`](./FULLY_FLEDGED_EXPERIENCE.md)) |

---

*Maintainer note: update §7 and §10 when major features land (e.g. Steam, resolution fix). Each gap row should keep a live pointer to its `tasks/AGENT-XX-*.md` file until closed.*

**Beyond gap closure:** content, balance, store, trailer, gamepad, i18n, perf, CI, playtest, and compliance are **AGENT-40–54** in [`FULLY_FLEDGED_EXPERIENCE.md`](./FULLY_FLEDGED_EXPERIENCE.md).
