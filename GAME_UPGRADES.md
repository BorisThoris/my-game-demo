# Game upgrades – free libraries (Phaser 3)

Researched **free, open-source** libraries that work with this project (Phaser 3.90 + Vite). Use these for future upgrades.

---

## Already integrated

- **phaser3-juice-plugin** (RetroVX) – `npm install github:RetroVX/phaser3-juice-plugin`  
  Juicy effects: bounce, shake, wobble, flash, pulse. Registered in `app/index.js`; use `this.juice.bounce(sprite)` / `this.juice.shake(sprite)` / `this.juice.pulse(sprite)` in scenes.

- **Built-in particles** – `this.add.particles()` + `emitter.explode(count)` for one-shot bursts. Used for: pickup collect, shield break, boss spawn, boss exit, death, objective complete. See `emitParticleBurst()` in `dodgeGame.js`.

- **juiceHelper.js** – Fallback `impactSquash(scene, target, { flash })` using Phaser tweens when no plugin.

- **floatingText.js** – `showFloatingText(scene, x, y, text, colorHex)`: popup text that floats up and fades. Used for: pickup type ("+1 Shield", "Speed!", etc.), challenge "+N", objective "+N".

- **Playwright E2E** – `npm run test:e2e` runs 11 browser tests: boot/menu (title, canvas, header, no console errors, start via Space/click), game scene (canvas after start, arrow key gameplay, no console errors on start), panels/game-over (game over after hazards, challenge panel run, game over and replay click). Config: `playwright.config.js` (Vite webServer port 25999, Chromium). Tests in `e2e/*.spec.js`.

- **Round 2 (4 agents):**
  - **Floating text** – Pickup type labels at (px, py); objective/challenge score "+N" at fixed positions.
  - **Boss & death VFX** – Particle burst on boss spawn, boss exit, and player death; red camera flash on death.
  - **PostFX & HUD juice** – Player glow (postFX.addGlow or alpha pulse fallback); score/phase bar micro-tweens when value changes; game over text/replay button entrance tweens.
  - **Audio & feedback** – Pickup sound rate variation (0.9–1.15); objective complete: camera flash + particle burst; perk online: `this.juice.pulse(this.player)`.
  - **Constructor** – `_lastHudScore` / `_lastHudPhaseProgress` for HUD change detection.

- **Round 3 (4 agents):**
  - **Phase change & exit unlock** – On phase change: camera flash (phase color, half intensity) + center particle burst. On exit unlock: greenish flash + particle burst near right side.
  - **Challenge timer urgency** – Timer text turns red when ≤3s; repeating scale pulse (1→1.08→1) when ≤5s; `stopChallengeUrgencyTween()` cleans up and resets on resolve/resetRun.
  - **Particle tint** – `emitParticleBurst(..., tint)` optional 6th param; pickup bursts use type-specific colors (shield/speed/invuln/scoreMult); shield-pop uses 0xffd166.
  - **Replay button feedback** – pointerdown scale 0.22, pointerup/pointerout back to 0.2, pointerover 0.21; `_replayScaleTween` so hover/press don’t conflict with pulse tween.

- **Round 4 (4 agents):**
  - **Boss volley muzzle** – One-shot particle burst at (boss.x, boss.y + 66) when boss fires, tint 0xff9f43.
  - **Boss spawn/exit tints** – Boss-arrival 0xff6644; boss-cleared 0x8be9b1.
  - **Exit text pulse** – exitText alpha pulse when unlocked; _exitTextPulseTween cleared in resetRun.
  - **Hazard spawn-in** – Scale 0 then tween to full over 100ms Power2.Out.

- **Round 5 (4 agents):**
  - **Pickup spawn-in** – Same as hazards: pickups pop in from scale 0 to full over 100ms Power2.Out in spawnPickup.
  - **Phase bar pulse** – When phaseProgress >= 0.85, repeating scaleY pulse (1 → 1.04) on phaseBarFill; stopPhaseBarPulse() when &lt; 0.85 and in resetRun.
  - **New record celebration** – endRun sets _justSetNewRecord when score &gt; highestScoreValue; showGameOver shows gold flash + floating "New record!" then clears flag.
  - **Low shield warning** – When shieldCharges <= 1: shieldText color #ff4444 (0) or #ffaa44 (1), plus repeating scale pulse (1 → 1.06); reset in updateHud when &gt; 1 and in resetRun.

- **Round 6 (4 agents):**
  - **Status text pop-in** – setStatusText runs a quick scale tween (0.96 → 1, 80ms Power2.Out); _statusTextTween stored and stopped on next update; reset in resetRun.
  - **Score milestones** – MILESTONES [25, 50, 100, 250]; when score crosses one, one-time particle burst + floating "25!" etc.; _lastMilestoneCelebrated reset in resetRun.
  - **Boss timer HUD** – bossTimerText in createHud ("Boss: incoming" / "Boss: Xs"); shown in updateBoss during enter/fight, hidden on exit and in resetRun.
  - **Boss entrance sound** – ooGnome played at setRate(0.5) in spawnMiniBoss after VFX for a deeper "incoming" cue.

- **Round 7 (4 agents):**
  - **Pickup spawn particle** – Small arrival burst at (descriptor.x, descriptor.y) in spawnPickup (5 particles, 200ms, type tint); then scale-in tween.
  - **Objective complete pulse** – When completed.length &gt; 0, objectiveText scale 1.02 → 1 over 120ms; _objectivePulseTween cleared in resetRun.
  - **Phase bar width tween** – phaseBarFill width tweens to target (320 * phaseProgress) over 90ms when target changes; _lastPhaseBarWidthTarget / _phaseBarWidthTween.
  - **Challenge correct feedback** – On result.success: showFloatingText "Correct!" + green particle burst before reward logic.

- **Round 8 (4 agents):**
  - **Music duck on challenge/perk** – maybeStartChallenge sets music.setVolume(0.25); restore setVolume(1) when panel closes (resolveChallenge fail/success, perk callback, resetRun before play).
  - **Score tick** – Every second (runTimeMs/1000) play ooGnome at volume 0.12, rate 1.6; _lastScoreTickSecond in constructor and resetRun.
  - **Camera fade on exit** – On exit (right wall), cameras.main.fade(400,0,0,0) then once('camerafadeoutcomplete') stopAudio and scene.start(choice).
  - **High score persistence** – localStorage 'skyfall_highscore' saved in endRun when updated; loaded in create() so Best survives refresh.

- **Round 10 - Visual juice:**
  - **Screen shake** – Player hit (shield consume): `cameraShake` 150ms; death: 220ms stronger shake in endRun; boss spawn: 250ms in spawnMiniBoss; boss defeat: 200ms when boss state → exit. All via `juiceHelper.cameraShake` / `this.cameras.main.shake`.
  - **Camera zoom pulse** – Subtle zoom (1 → 1.03 → 1) on boss spawn and exit unlock via `juiceHelper.cameraZoomPulse` (200–220ms) for major events without hurting performance.
  - **Particle variety** – New burst presets in juiceHelper: `emitPhaseChangeBurst` (phase change, cyan) and `emitObjectiveCompleteBurst` (objective complete, green); used in addition to existing `emitParticleBurst` in dodgeGame for phase change and objective complete.

- **Round 10 - Procedural/assets:**
  - **Procedural textures** – `proceduralSprites.js`: hazardGlow, pickupShine, bolt families (ensureProceduralTexture + Graphics + generateTexture). Hazards (meteor, shard, crusher, zigzag, sentinel) use procedural params; boss projectiles use procedural bolt; fallback to runner-orb/runner-bolt when needed.
  - **Runner content** – Meteor tint variant (tintVariant/tintVariantChance) for visual variety; all obstacle types reference procedural textures via proceduralParams.
  - **Visual config** – dodgeGame: HAZARD_VISUAL_DEFAULTS and PICKUP_VISUAL_DEFAULTS for consistent tint/scale fallbacks; hazards and pickups read from descriptor with config defaults.

- **Round 10 - Audio:**
  - **Event SFX** – Phase change, exit unlock, objective complete, and challenge complete play ooGnome with different rate/volume via DODGE_AUDIO (sfxPhaseChange, sfxExitUnlock, sfxObjectiveComplete, sfxChallengeComplete); playEventSfx() in dodgeGame.js.
  - **Consistent music ducking** – Challenge, perk, and game over panels all duck music to DODGE_AUDIO.musicDuckVolume (0.25); restore to musicNormalVolume (1) when panel closes or on replay. Game over no longer stops music; it ducks and plays gameOver sound.
  - **Boss music duck** – When boss appears (and not in challenge/perk), music tweens to musicBossVolume (0.65); when boss exits, music tweens back to 1 if no panel is open. Config in app/config/dodgeHudStyles.js (DODGE_AUDIO).

- **Round 10 - UI/UX:**
  - **Main menu (BeginningScene)** – Clearer layout with defined Y positions; "Press to start" prompt with alpha pulse (0.4↔1) and hover scale (1.08); prompt is interactive and starts the game on click.
  - **Get Ready overlay** – When dodge game starts, "Get Ready!" text fades in, holds ~1.8s, then fades out; score tick delayed until overlay ends.
  - **Challenge/perk panel transitions** – Open: alpha 0→1, scale 0.94→1 (220ms Power2.Out); close: alpha→0, scale→0.94 (180ms), then hide; panelGlow included in container so it tweens with the panel.
  - **Game-over flow** – Panel and score text tween in (alpha + scale); replay block has "Play again" label, panel and button scale in with Back.easeOut and clearer depth hierarchy; replay button 0.22 base scale with hover/press feedback.

---

## UI: floating text, toasts, HUD

| Library | Link | Use case |
|--------|------|----------|
| Phaser-FloatingText | [GitHub](https://github.com/netgfx/Phaser-FloatingText) | "+1 shield", "Speed boost!" popups |
| Phaser-FloatingNumbersPlugin | [GitHub](https://github.com/netgfx/Phaser-FloatingNumbersPlugin) | Score/damage/XP numbers |
| phaser3-rex-plugins | [npm](https://www.npmjs.com/package/phaser3-rex-plugins) | Toast, buttons, sliders, virtual joystick |

---

## Tweens / juice

| Library | Link | Use case |
|--------|------|----------|
| phaser3-juice-plugin | (already installed) | bounce, shake, wobble, flash |
| screen-shake | [npm](https://www.npmjs.com/package/screen-shake) | GDC-style trauma-based camera shake |
| GSAP | [npm](https://www.npmjs.com/package/gsap) | Generic tweens (camera, custom values) |

---

## Post-processing (glow, bloom)

- **Phaser 3 built-in** – `sprite.postFX.addGlow()` / `addBloom()` (no extra lib).
- **phaser3-rex-plugins** – Kawase blur, custom PostFX pipelines.

---

## Audio

- **Phaser 3** – Built-in spatial audio (3.60+).
- **ZzFX** – [npm](https://www.npmjs.com/package/zzfx) – Procedural SFX, no files, MIT.
- **ZzFXM** – Procedural music (tracker-style).
- **OpenGameArt / itch.io** – CC0 SFX and music packs.

---

## Particles (advanced)

- **Phaser built-in** – `this.add.particles()` (already used).
- **phaser3-rex-plugins** – Particles along bounds, more emitters.
- **koreezgames/phaser-particle-editor-plugin** – JSON-driven particles.

---

*Last updated from agent research (4 parallel agents): structure map, library search, integration notes, implementation.*
