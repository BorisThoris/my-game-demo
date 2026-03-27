# Full App Analysis — firstNodeProject

> **Historical — deep-dive written against an older scene stack.** Current boot order, shipping gaps, and task mapping: [`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](docs/GAP_ANALYSIS_BEYOND_TASKS.md), [`tasks/README.md`](tasks/README.md) (**AGENT-21+** for platform/economy/docs). Steam-oriented drift guardrails: [`STEAM_READY_GAP_ANALYSIS.md`](STEAM_READY_GAP_ANALYSIS.md). **Live path (2026):** `LoadingScene` → `MainMenuScene` (or `EditorScene` when `location.hash === "#/editor"` after load) — see [`app/index.js`](app/index.js).

Complete analysis of the app: structure, gameplay, assets, systems, and how everything connects. Built from multi-agent exploration.

---

## 1. ENTRY POINTS & BOOT FLOW

### Entry points

| Entry | Path | Role |
|-------|------|------|
| **HTML** | `index.html` (repo root) | Single page: `#phaser-example` game container, mobile controls overlay, loads `/main.js` as ES module. |
| **JS bundle** | `main.js` (repo root) | Imports `style.css` and `app/index.js`; sets `--app-height` from viewport; resize/orientation listeners. |
| **App/Phaser** | `app/index.js` | Creates `new Phaser.Game(config)`, registers scenes and juice plugin, calls `initMobileControls()`. |
| **Dev server** | Vite | `vite.config.js` → `npm run dev` (port 5173); `npm run build` / `npm run preview`. |

### Boot chain (current)

1. **index.html** → `<script type="module" src="/main.js">`
2. **main.js** → `import "./app/index.js"` (and `style.css`)
3. **app/index.js** → `new Phaser.Game(config)` with:
   - `scene: [LoadingScene, MainMenuScene, OptionsScene, AchievementsScene, TutorialScene, CreditsScene, DodgeGame, MetaScene, EditorScene]` (class list order = Phaser boot order)
   - Juice plugin (`phaser3-juice-plugin`)
   - Arcade physics, scale FIT, CENTER_BOTH
4. **First scene:** `LoadingScene` → key `"loadingScene"` ([`app/scenes/loadingScene.js`](app/scenes/loadingScene.js)); after its timed progress completes it starts **`MainMenuScene`** (`"mainMenuScene"`), or **`EditorScene`** if the hash is `#/editor`.
5. **initMobileControls()** runs after game creation (joystick on mobile); desktop builds add a `desktop-build` body class when not mobile.

### Legacy / portfolio flow (not the live boot path)

The **diagram in §3** describes an older **BeginningScene → ChoiceScene → …** hub. Those files may still exist under `app/scenes/` but are **not** registered in [`app/index.js`](app/index.js) for the current product. Cleanup: [`tasks/AGENT-11-remove-orphan-scenes.md`](tasks/AGENT-11-remove-orphan-scenes.md).

---

## 2. DIRECTORY MAP

### app/

| Directory | Files | Role |
|-----------|--------|------|
| **config/** | `gameConfig.js`, `sceneKeys.js`, `sceneStyles.js`, `dodgeHudStyles.js`, `websites.js` | Dimensions, scene keys, text styles, HUD/audio for dodge, external links. |
| **scenes/** | `baseScene.js`, `beginningScene.js`, `introductionScene.js`, `choiceScene.js`, `websitesScene.js`, `navigationScene.js`, `dodgeGame.js` | Phaser scenes; BaseScene/NavigationScene base classes; dodgeGame = main game. |
| **game/** | `StickmanPlayer.js`, `stickmanSkeleton.js`, `ensureProceduralPlayerSheets.js`, `proceduralBaseAssets.js`, `proceduralSprites.js`, `proceduralUiAssets.js`, `runnerContent.js`, `runnerSpawnDirector.js`, `challengeDirector.js`, `objectiveDirector.js`, `perkSystem.js`, `juiceHelper.js`, `floatingText.js` | Player, procedural art, spawn/content, challenges, objectives, perks, juice, floating text. |
| **input/** | `mobileControls.js` | `virtualKeys`, `isMobile()`, `initMobileControls()`; joystick → virtual keys. |
| **help-scripts/** | `playerMovement.js` | Player movement logic; used by baseScene. |
| **shared/** | `browser.js` | `openExternalLink(url)` for portfolio links (websitesScene). |
| **assets/** | `runningMan.json`, `backMusic(2).mp3`, `gameOver.mp3`, `oo.mp3` | Spritesheet metadata (unused); audio for dodge game. |

### Root (outside app/)

- **main.js** — bundle entry, viewport sync
- **index.html** — HTML entry
- **style.css** — global styles
- **vite.config.js** — Vite (base, server port)
- **package.json** — Phaser, phaser3-juice-plugin, Vite, Playwright

---

## 3. SCENES LIST & NAVIGATION

> **§3 table and diagram are a legacy snapshot** (Beginning / Choice hub). For keys actually used in the current game object, see [`app/config/sceneKeys.js`](app/config/sceneKeys.js) and [`app/index.js`](app/index.js). **Boot:** Loading → MainMenu (see §1).

| Scene | File | Phaser key | Extends | How started / switched |
|-------|------|------------|---------|-------------------------|
| **BaseScene** | `baseScene.js` | (base) | Phaser.Scene | Not in config; provides shell, player, cursors. |
| **BeginningScene** | `beginningScene.js` | `"beginningScene"` | BaseScene | **Default first scene.** Start action → `scene.start(SCENE_KEYS.game)`. |
| **DodgeGame** | `dodgeGame.js` | `"gameScene"` | BaseScene | From BeginningScene (start), ChoiceScene (down), or replay. Exit → `scene.start(SCENE_KEYS.choice)`. |
| **IntroductionScene** | `introductionScene.js` | `"introScene"` | BaseScene | From ChoiceScene (left). Right edge → `scene.start(SCENE_KEYS.choice)`. |
| **ChoiceScene** | `choiceScene.js` | `"choiceScene"` | NavigationScene | From Intro (right), DodgeGame (exit), Websites (left). Left→intro, Right→websites, Down→game. |
| **WebsitesScene** | `websitesScene.js` | `"websitesScene"` | NavigationScene | From ChoiceScene (right). Left→Choice; right/down open external links. |
| **NavigationScene** | `navigationScene.js` | (base) | BaseScene | Not in config; base for Choice + Websites; arrows, fadeIn, controlsEnabled. |

**Scene keys** (`app/config/sceneKeys.js`):  
`beginning` → `"beginningScene"`, `game` → `"gameScene"`, `intro` → `"introScene"`, `choice` → `"choiceScene"`, `websites` → `"websitesScene"`.

**Navigation flow:**

```
BeginningScene ──(start)──► gameScene (DodgeGame)
                                │
                                └──(exit @ score≥120, right edge)──► choiceScene
ChoiceScene ◄─────────────────────────────────────────────────────────┘
    │
    ├── left  ──► introScene ──(right edge)──► choiceScene
    ├── right ──► websitesScene ──(left)──► choiceScene
    └── down  ──► gameScene
```

---

## 4. CONFIG FILES

| File | Path | Contents |
|------|------|----------|
| **gameConfig** | `app/config/gameConfig.js` | `GAME_WIDTH` 1280, `GAME_HEIGHT` 720, `GAME_CENTER_X/Y`, `PLAYER_START_Y` 540, `PLAYER_HEIGHT_FRACTION` 0.11, `INTRO_PLAYER_X`, `MENU_PLAYER_X`, `START_PLAYER_X`, `WORLD_BOUNDS` (groundX 1280, groundY 768). |
| **sceneKeys** | `app/config/sceneKeys.js` | `SCENE_KEYS`: beginning, game, intro, choice, websites. |
| **sceneStyles** | `app/config/sceneStyles.js` | `TITLE_STYLE`, `BODY_STYLE`, `HINT_STYLE`, `PANEL_TITLE_STYLE`, `INFO_HEADING_STYLE`, `INFO_BODY_STYLE`. |
| **dodgeHudStyles** | `app/config/dodgeHudStyles.js` | `DODGE_HUD_STYLES` (scoreText, highestScore, phaseText, shieldText, statusText, objectiveText, bossTimerText), `HUD_STROKE`, `DODGE_AUDIO` (music/SFX volumes). |
| **websites** | `app/config/websites.js` | `WEBSITE_LINKS`: angularPortfolio, reactPortfolio URLs. |

---

## 5. GAMEPLAY — FILES & ROLES

### app/game/ (gameplay & presentation)

| File | Purpose |
|------|--------|
| **StickmanPlayer.js** | Player: Arcade physics sprite, procedural stickman via skeleton, hitbox from skeleton bounds, animations (flex, walk, crouch, jump). |
| **stickmanSkeleton.js** | Skeleton data + drawing: joint positions per anim/phase, `getSkeleton()`, `getSkeletonBounds()`, `drawStickman()`. |
| **runnerSpawnDirector.js** | Spawn pacing: phase timer, pattern delay, boss cooldown; returns spawn events (hazard/pickup/boss) + context (phase, fall speed, intensity). |
| **runnerContent.js** | Content: `RUNNER_PHASES`, `OBSTACLE_LIBRARY`, `PATTERN_LIBRARY`, `PICKUP_TYPES`, boss archetypes, `buildRunnerContext()`, `buildProceduralBoss()`, `createHazard()`/`createPickup()`, spawn edges, lanes. |
| **perkSystem.js** | Run modifiers: `createBaseModifiers()`, `PERK_LIBRARY`, `buildPerkChoices()`, `applyPerk()`. |
| **challengeDirector.js** | Pop-up challenges: `maybeCreateChallenge(score, intensity)` (math, Simon, logic, sequence), timer, `evaluate()`; rewards score, shields, perk point. |
| **objectiveDirector.js** | Run objectives: 2 random (Pickup Hunter, Survivor, Boss Breaker); `recordPickup()`, `recordSurvival()`, `recordBossClear()`; `consumeCompletedRewards()`. |
| **juiceHelper.js** | Feedback: `impactSquash()`, `cameraShake()`, `cameraZoomPulse()`, `emitPhaseChangeBurst()`, `emitObjectiveCompleteBurst()`. |
| **floatingText.js** | `showFloatingText(scene, x, y, text, colorHex)` — float up and fade. |
| **proceduralSprites.js** | Procedural hazard/boss textures: families (orb, wedge, beam, polygon, boss, hazardGlow, bolt, ring, star, cross, hex); `ensureProceduralTexture()`, hitbox helpers. |
| **proceduralBaseAssets.js** | Base scene art: ground, background, arrow (Graphics). |
| **proceduralUiAssets.js** | Dodge UI: replay, powerUp, stagePowerup, stageIntensityHeat, pickupPowerups (4 frames), perkIcons (8 frames). |
| **ensureProceduralPlayerSheets.js** | Dummy sprite sheets for Phaser anims (mummy, flex, crouch, jump); visuals drawn by StickmanPlayer. |

### app/scenes/ (gameplay usage)

| Scene | Gameplay role |
|-------|----------------|
| **baseScene.js** | `createSceneShell()` (background, platforms, cursors + virtualKeys), `createPlayer()` → StickmanPlayer, ground collider. |
| **dodgeGame.js** | Main dodge run: HUD, groups (hazards, pickups, projectiles, bossGroup), collisions, run state (score, shields, phases, challenges, perks, objectives), spawn from director, game over / exit. |
| **beginningScene.js** | Menu; starts gameScene on start. |
| **choiceScene.js** | Hub; can start gameScene or other scenes. |

---

## 6. ENTITIES

### Player

- **Class:** `StickmanPlayer` (extends `Phaser.Physics.Arcade.Sprite`)
- **Properties:** `_displaySize`, `_skeletonScale`, `_graphics`, `_skeleton`, `_bounds`; `setCollideWorldBounds(true)`; height from `GAME_HEIGHT * PLAYER_HEIGHT_FRACTION`
- **Methods:** `preUpdate()` (skeleton + hitbox), `getLimbPosition(limbId)`, `getSkeleton()`, `getBounds()`

### Hazards (obstacles)

From `OBSTACLE_LIBRARY` in runnerContent; added to `this.hazards`. Each: texture/tint, scale/speedFactor, hitbox (circle or box), optional motion (sway), rotationSpeed.

| Id | Family | Tint | Hitbox | Notes |
|----|--------|------|--------|-------|
| meteor | orb | orange | circle | |
| shard | wedge | red | box | |
| crusher | beam | green | box | |
| zigzag | polygon | blue | circle | sway |
| sentinel | polygon | purple | circle | sway |
| pulse | hazardGlow | orange | circle | |
| streak | bolt | cyan | circle | |
| spinner | gate | purple | circle | sway |
| ring | ring | yellow | circle | |
| star | star | purple | circle | |
| cross | cross | green | box | |
| drone | ring | orange | circle | sway |
| slicer | cross | teal | box | |
| hex | hex | purple | circle | |

### Pickups

- **Types:** shield, speed, invuln, scoreMult (`PICKUP_TYPES`); group `this.pickups`
- **Descriptor:** kind `"pickup"`, pickupType, texture/frame, position, velocity, scale, hitbox radius 96, sway, delayMs

### Boss (miniboss)

- **Single active:** `this.activeBoss` in `this.bossGroup`
- **Descriptor:** kind `"boss"`, name, proceduralParams (family `"boss"`), holdX/holdY, entry/exit speed, drift, durationMs, attackCadenceMs, projectile count/spread/speed, rewardPickup
- **States:** enter → fight (hold, drift, shoot) → exit (move up, destroy)
- **Archetypes:** Storm Core, Void Spire, Ember Nexus, Frost Shard, Chaos Rift

### Boss projectiles

- Procedural bolt texture; group `this.projectiles`; velocity toward player; circle radius 12; rotated each frame

---

## 7. GAME LOOP (Dodge run)

- **Start:** Enter dodge scene → `create()`: scene shell, HUD, groups, `createCollisions()`, `resetRun()`, `showGetReadyOverlay()` (2.2s). `resetRun()` clears groups, sets run state (runTimeMs 0, bonusScore 0, fallSpeed 260, shieldCharges from modifiers, gameOverState false, exitUnlocked false), resets phases/challenges/perks/objectives, plays music.
- **Scoring:** `score = floor(runTimeMs/1000) + bonusScore`; high score in localStorage `skyfall_highscore`; milestones 25, 50, 100, 250 → float text + particles.
- **Lives:** Shield-based. Start from `runModifiers.maxShields` (default 3). Hit with shields → consume one + brief invuln; no shields → end run.
- **Lose:** `handleHazardHit()` with no shields and not invuln → `endRun()`: stop audio, game over music, camera shake/flash, physics pause, save high score, game over panel + replay button; replay → `resetRun()`.
- **Win/exit:** Score ≥ `EXIT_UNLOCK_SCORE` (120) → `exitUnlocked = true`. When `exitUnlocked && player.body.blocked.right` → camera fade → `scene.start(SCENE_KEYS.choice)`.

---

## 8. COLLISIONS & END GAME

- **Setup** (`createCollisions()` in dodgeGame.js):
  - `physics.add.overlap(player, hazards, handleHazardHit)`
  - `physics.add.overlap(player, projectiles, handleHazardHit)`
  - `physics.add.overlap(player, bossGroup, handleHazardHit)`
  - `physics.add.overlap(player, pickups, handlePickupCollision)`
- **Hit:** Arcade overlap; hitbox from descriptor (`applyHitbox()` — circle or box). Hazard/projectile/boss → `handleHazardHit(source)`; pickup → `handlePickupCollision(pickup)`.
- **Hazard hit:** If gameOverState or damageRecoveryMs or tempInvulnMs → return. Else if shieldCharges > 0 → `consumeShield(source)`; else → `endRun()`.
- **Game over:** Only in `endRun()`: `gameOverState = "ended"`, physics paused, panel + replay.

---

## 9. INPUT BINDINGS

- **Keyboard (dodge):** `movementKeys = keyboard.addKeys("W,A,S,D")`; `cursors` from baseScene (arrows + virtual keys). Movement: arrows + WASD (OR'd).
- **Challenges/perks:** `challengeInputKeys = addKeys("ONE,TWO,THREE")` → keys **1**, **2**, **3**.
- **Mobile:** `app/input/mobileControls.js` → virtualKeys from joystick; baseScene builds cursors as `realCursors.*.isDown || virtualKeys.*`; dead zone 0.28.
- **Replay:** Replay button sprite `pointerup` → `resetRun()`.

---

## 10. DIFFICULTY & PROGRESSION

- **Phases** (`RUNNER_PHASES`): recovery (22s, pressure 0.26), push (18s, 0.52), heat (22s, 0.9), reset (15s, 0.38). Drives phase bar, HUD, phase-change juice.
- **Intensity:** `clamp(phase.pressure + scorePressure + cyclePressure, 0.2, 1.2)` → fallSpeed (260→700), backgroundSpeed (14→40), allowedSpawnEdges.
- **Spawn director:** Phase timer; `nextPatternDelay()` 750–2000 ms (reduced by intensity); `pickPattern(context)` from `PATTERN_LIBRARY` by phase/intensity; pendingSpawns with delayMs.
- **Boss:** Only when no active boss, score ≥ BOSS_TRIGGER_SCORE (28), phase = heat; chance 0.28–0.44; cooldown 22s–16s.
- **Challenges:** Next at score ≥ nextTriggerScore (start 12, +14–20); duration 6500 − intensity×1800 ms; success: score, shield, perk point; failure: optional shield penalty.
- **Objectives:** Two random per run; completion → score, shields, perk points; shown in HUD.
- **Exit unlock:** Score ≥ 120 → can finish by moving to right edge.

---

## 11. ASSETS — FILES & ROLES

| File | Role |
|------|------|
| **proceduralBaseAssets.js** | ground (tiled), background (gradient), arrow (triangle) — Graphics + generateTexture. |
| **proceduralSprites.js** | Hazard/boss families: orb, wedge, beam, polygon, boss, hazardGlow, pickupShine, bolt, ring, star, cross, hex. `ensureProceduralTexture`, getHitboxFromProceduralParams, drawProceduralShape. |
| **proceduralUiAssets.js** | replay, powerUp, stagePowerup, stageIntensityHeat; pickupPowerups (4 frames), perkIcons (8 frames). Graphics/RenderTexture. |
| **ensureProceduralPlayerSheets.js** | Dummy sheets: mummy, mummy2, flex, crouch-flex, crouch-walk-left/right, jump. Phaser anims only; drawing by StickmanPlayer. |
| **stickmanSkeleton.js** | getSkeleton(animKey, phase), getSkeletonBounds(), drawStickman(graphics, skeleton, glowColor). |
| **runnerContent.js** | Content only (OBSTACLE_LIBRARY, etc.); no asset creation. |
| **dodgeHudStyles.js** | HUD text styles, stroke, audio. |
| **gameConfig.js** | Layout/dimensions. |
| **app/assets/runningMan.json** | Atlas metadata; not referenced (procedural player used). |

### Asset loading/creation

- **No image files** for visuals. All via Phaser Graphics → `generateTexture()` or RenderTexture for multi-frame sheets.
- **Where:** BaseScene `createSceneShell`: ensureProceduralPlayerSheets, ensureProceduralBaseAssets. DodgeGame `create()`: createRuntimeTextures (DEFAULT_PROCEDURAL_PARAMS families), ensureProceduralUiAssets; createChallengeUi → challengePanelBg if missing. Hazards/bosses: `ensureProceduralTexture(scene, descriptor.proceduralParams)` on spawn.
- **Audio:** dodgeGame preload: `musicBack`, `gameOver`, `ooGnome` (.mp3 from app/assets/).

### Caches

- **proceduralSprites.js:** LRU cache, max 100 keys (`proc-{family}-{seed}`); oldest removed when over limit.
- All other textures in Phaser texture manager (base, procedural, UI, player sheets, challengePanelBg).

---

## 12. RENDERING

- **Tech:** Phaser 3 (`Phaser.AUTO`), WebGL with Canvas 2D fallback. No PixiJS.
- **Init:** `app/index.js` → `new Phaser.Game(config)` with scale FIT, CENTER_BOTH, Arcade physics, juice plugin.
- **Loop:** Phaser's built-in loop → `Scene.update(time, delta)`. No custom render loop.
- **Custom per-frame draw:** StickmanPlayer `preUpdate()` → `_updateSkeletonAndDraw()` → getSkeleton → drawStickman on `this._graphics`.

---

## 13. DEPENDENCY GRAPH (who requires who)

### app/index.js

- phaser, phaser3-juice-plugin
- ./scenes/dodgeGame, beginningScene, introductionScene, choiceScene, websitesScene
- ./input/mobileControls (initMobileControls)
- ./config/gameConfig (GAME_HEIGHT, GAME_WIDTH)

### app/scenes/baseScene.js

- phaser, ../input/mobileControls (virtualKeys), ../help-scripts/playerMovement
- ../game/ensureProceduralPlayerSheets, proceduralBaseAssets, StickmanPlayer
- ../config/gameConfig

### app/scenes/beginningScene.js

- ../config/gameConfig, sceneKeys, sceneStyles, ./baseScene

### app/scenes/dodgeGame.js

- ../assets/*.mp3 (audio)
- ../config/gameConfig, sceneKeys, ./baseScene
- ../game/runnerSpawnDirector, runnerContent (EXIT_UNLOCK_SCORE), challengeDirector, perkSystem, objectiveDirector
- ../game/proceduralSprites, proceduralUiAssets, juiceHelper, floatingText
- ../config/dodgeHudStyles

### app/scenes/choiceScene.js

- ../config/gameConfig, sceneKeys, sceneStyles, ./navigationScene

### app/scenes/introductionScene.js

- ../config/gameConfig, sceneKeys, sceneStyles, ./baseScene

### app/scenes/navigationScene.js

- ./baseScene

### app/scenes/websitesScene.js

- ../config/gameConfig, sceneKeys, sceneStyles, websites, ../shared/browser, ./navigationScene

### app/game/

| File | Requires |
|------|----------|
| runnerSpawnDirector.js | runnerContent (BOSS_TRIGGER_SCORE, PATTERN_LIBRARY, RUNNER_PHASES, buildProceduralBoss, buildRunnerContext) |
| runnerContent.js | ../config/gameConfig, proceduralSprites (getTintModifierFromSeed, getHitboxFromProceduralParams) |
| StickmanPlayer.js | phaser, gameConfig, stickmanSkeleton |
| proceduralBaseAssets.js | ../config/gameConfig |
| perkSystem, floatingText, juiceHelper, challengeDirector, objectiveDirector, proceduralSprites, proceduralUiAssets, ensureProceduralPlayerSheets, stickmanSkeleton | (none or internal only) |

---

## 14. SYSTEMS MAP (blocks & connections)

| System | Main file(s) | Exports | Importers |
|--------|--------------|---------|-----------|
| **Perk system** | perkSystem.js | PERK_LIBRARY, createBaseModifiers, buildPerkChoices, applyPerk | dodgeGame.js |
| **Spawn director** | runnerSpawnDirector.js | RunnerSpawnDirector | dodgeGame.js |
| **Runner content** | runnerContent.js | SPAWN_EDGES, EXIT_UNLOCK_SCORE, BOSS_TRIGGER_SCORE, RUNNER_PHASES, OBSTACLE_LIBRARY, PICKUP_TYPES, PATTERN_LIBRARY, buildRunnerContext, buildProceduralBoss, etc. | runnerSpawnDirector.js, dodgeGame.js (EXIT_UNLOCK_SCORE) |
| **Player** | StickmanPlayer.js, playerMovement.js | StickmanPlayer, PlayerMovement | baseScene.js |
| **Stickman skeleton** | stickmanSkeleton.js | getSkeleton, getSkeletonBounds, drawStickman, HEAD_R | StickmanPlayer.js |
| **HUD** | dodgeHudStyles.js | DODGE_HUD_STYLES, HUD_STROKE, DODGE_AUDIO | dodgeGame.js |
| **Floating text** | floatingText.js | showFloatingText | dodgeGame.js |
| **Juice helper** | juiceHelper.js | impactSquash, cameraShake, cameraZoomPulse, emitPhaseChangeBurst, emitObjectiveCompleteBurst | dodgeGame.js |
| **Challenge director** | challengeDirector.js | ChallengeDirector | dodgeGame.js |
| **Objective director** | objectiveDirector.js | ObjectiveDirector | dodgeGame.js |
| **Procedural sprites** | proceduralSprites.js | getTintModifierFromSeed, getProceduralTextureKey, getProceduralTextureSize, getHitboxFromProceduralParams, DEFAULT_PROCEDURAL_PARAMS, drawProceduralShape, ensureProceduralTexture | runnerContent.js, dodgeGame.js |
| **Procedural UI** | proceduralUiAssets.js | ensureProceduralUiAssets | dodgeGame.js |
| **Procedural base** | proceduralBaseAssets.js | ensureProceduralBaseAssets | baseScene.js |
| **Player sheets** | ensureProceduralPlayerSheets.js | ensureProceduralPlayerSheets | baseScene.js |

---

## 15. SHARED STATE

| Name | Type | Read | Written |
|------|------|-----|--------|
| **virtualKeys** | Object (mobileControls.js) | baseScene (cursors) | mobileControls (setKey, updateDirectionalKeys, resetKeys) |
| **gameConfig** | Module exports | index, baseScene, beginningScene, introductionScene, choiceScene, websitesScene, dodgeGame, runnerContent, proceduralBaseAssets, StickmanPlayer | Read-only |
| **sceneKeys** | Module exports | beginningScene, introductionScene, choiceScene, websitesScene, dodgeGame | Read-only |
| **runModifiers** | DodgeGame instance | dodgeGame (pickup, shield, resetRun, update, HUD, challenge/objective reward, perk apply) | dodgeGame (createBaseModifiers, applyPerk) |
| **spawnDirector** | DodgeGame instance | dodgeGame (update, resetRun) | dodgeGame (new, reset) |
| **challengeDirector** | DodgeGame instance | dodgeGame (maybeStartChallenge, UI, evaluate) | dodgeGame (new, reset) |
| **objectiveDirector** | DodgeGame instance | dodgeGame (record*, consumeCompletedRewards, getObjectives, processObjectiveRewards) | dodgeGame (new, reset) |
| **localStorage 'skyfall_highscore'** | Browser | dodgeGame (create) | dodgeGame (endRun when new record) |

---

## 16. EVENT & CALLBACK FLOW

- **Scene transitions:** beginningScene → game (start); introductionScene → choice (right edge); choiceScene ↔ intro/websites/game; dodgeGame → choice (exit + camera fade).
- **Phaser overlap:** player vs hazards/projectiles/bossGroup → handleHazardHit; player vs pickups → handlePickupCollision.
- **Logical events (no custom emitter):** hazard hit → consumeShield or endRun; pickup → effects + objectiveDirector.recordPickup + float text + juice; phase change → emitPhaseChangeBurst + HUD/audio; objective complete → processObjectiveRewards + emitObjectiveCompleteBurst; challenge complete → reward + applyPerk; exit unlock → cameraZoomPulse + exit text.
- **UI:** beginningScene startPrompt pointer/keyboard; dodgeGame replayButton pointerup → resetRun; choice/websites navigation in update() via body.blocked/cursors.
- **Camera:** dodgeGame `cameras.main.once("camerafadeoutcomplete", () => scene.start(SCENE_KEYS.choice))`.

---

## 17. DATA FLOW

- **Runner content / spawn:** runnerContent.js (RUNNER_PHASES, PATTERN_LIBRARY, OBSTACLE_LIBRARY, buildRunnerContext, buildProceduralBoss, createHazard/createPickup) → RunnerSpawnDirector (update(deltaMs, score, bossActive) → buildRunnerContext, pick pattern, emit descriptors) → dodgeGame (context → fallSpeed/backgroundSpeed; spawnFromDescriptor(event) → physics sprites into groups).
- **Perks/challenges/objectives:** PERK_LIBRARY + buildPerkChoices (perkSystem) → dodgeGame (ownedPerks, pendingPerkChoices, runModifiers, applyPerk). ChallengeDirector.maybeCreateChallenge → dodgeGame UI → evaluate → rewards. ObjectiveDirector (record*, consumeCompletedRewards) → dodgeGame (processObjectiveRewards).

---

## 18. EXPORTS & CONSUMERS (summary)

**app/game/*.js**

| File | Consumers |
|------|-----------|
| runnerSpawnDirector.js | dodgeGame.js |
| runnerContent.js | runnerSpawnDirector.js, dodgeGame.js |
| perkSystem.js | dodgeGame.js |
| floatingText.js | dodgeGame.js |
| juiceHelper.js | dodgeGame.js |
| challengeDirector.js | dodgeGame.js |
| objectiveDirector.js | dodgeGame.js |
| proceduralSprites.js | runnerContent.js, dodgeGame.js |
| proceduralUiAssets.js | dodgeGame.js |
| proceduralBaseAssets.js | baseScene.js |
| ensureProceduralPlayerSheets.js | baseScene.js |
| StickmanPlayer.js | baseScene.js |
| stickmanSkeleton.js | StickmanPlayer.js |

**app/scenes/*.js**

| File | Consumers |
|------|-----------|
| baseScene.js | beginningScene, introductionScene, dodgeGame, navigationScene |
| beginningScene.js | index.js |
| introductionScene.js | index.js |
| choiceScene.js | index.js |
| websitesScene.js | index.js |
| navigationScene.js | choiceScene, websitesScene |
| dodgeGame.js | index.js |

---

*End of full app analysis.*
