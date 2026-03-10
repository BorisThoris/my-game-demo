import musicBack from "../assets/backMusic(2).mp3";
import gameOver from "../assets/gameOver.mp3";
import ooGnome from "../assets/oo.mp3";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import BaseScene from "./baseScene";
import RunnerSpawnDirector from "../game/runnerSpawnDirector";
import { EXIT_UNLOCK_SCORE, getCurrentLevelFromScore } from "../game/runnerContent";
import ChallengeDirector from "../game/challengeDirector";
import {
  applyPerk,
  buildPerkChoices,
  createBaseModifiers,
  getPerkIconFrame,
  PERK_LIBRARY
} from "../game/perkSystem";
import ObjectiveDirector from "../game/objectiveDirector";
import { ensureProceduralTexture, DEFAULT_PROCEDURAL_PARAMS } from "../game/proceduralSprites";
import { ensureProceduralUiAssets } from "../game/proceduralUiAssets";
import { impactSquash, cameraShake, cameraZoomPulse, emitPhaseChangeBurst, emitObjectiveCompleteBurst } from "../game/juiceHelper";
import { showFloatingText } from "../game/floatingText";
import { DODGE_HUD_STYLES, HUD_STROKE, DODGE_AUDIO } from "../config/dodgeHudStyles";
import { applyRunEventToContracts } from "../game/contractDirector.js";
import {
  getHighScore,
  setHighScore,
  getSettings,
  getLastCompletedLevel,
  setLastCompletedLevel,
  getActiveContracts,
  updateContracts,
  claimCompletedContract
} from "../save/saveManager";
import { unlockAchievement, submitLeaderboardScore, setRichPresence } from "../services/onlineService";

const SCORE_TICK_MS = 1000;
const MILESTONES = [25, 50, 100, 250];
const PLAYER_SPEED = 430;
const PLAYER_START_X = GAME_WIDTH / 2;
const PLAYER_START_Y = GAME_HEIGHT - 130;

/** Default tint/scale when descriptor omits them; keeps hazards and pickups readable and consistent. */
const HAZARD_VISUAL_DEFAULTS = { tint: 0xffffff, scale: 1 };
const PICKUP_VISUAL_DEFAULTS = { tint: 0xd7f9ff, scale: 0.18 };

export default class DodgeGame extends BaseScene {
  constructor() {
    super(SCENE_KEYS.game);
    this.scoreText = null;
    this.highestScore = null;
    this.phaseText = null;
    this.shieldText = null;
    this.statusText = null;
    this.exitText = null;
    this.phaseBarTrack = null;
    this.phaseBarFill = null;
    this.hazards = null;
    this.pickups = null;
    this.projectiles = null;
    this.bossGroup = null;
    this.activeBoss = null;
    this.movementKeys = null;
    this.gameOverText = null;
    this.replayButton = null;
    this.music = null;
    this.gameOverMusic = null;
    this.ooGnome = null;
    this.replayTween = null;
    this.highestScoreValue = 0;
    this.runTimeMs = 0;
    this.bonusScore = 0;
    this.gameOverState = false;
    this.currentFallSpeed = 260;
    this.backgroundSpeed = 14;
    this.shieldCharges = 0;
    this.damageRecoveryMs = 0;
    this.exitUnlocked = false;
    this.phaseKey = "";
    this.lastFacing = "right";
    this.spawnDirector = new RunnerSpawnDirector();
    this.challengeDirector = new ChallengeDirector();
    this.challengePanel = null;
    this.challengeText = null;
    this.challengeTimerText = null;
    this.challengeOptionTexts = [];
    this.challengeInputKeys = null;
    this.activeChallenge = null;
    this.challengeRemainingMs = 0;
    this.pendingPerkChoices = null;
    this.perkPoints = 0;
    this.ownedPerks = [];
    this.runModifiers = createBaseModifiers();
    this.objectiveDirector = new ObjectiveDirector();
    this.objectiveText = null;
    this.tempSpeedBoostMs = 0;
    this.tempInvulnMs = 0;
    this.tempScoreMultMs = 0;
    this.tempScoreMultMultiplier = 1;
    this._lastHudScore = null;
    this._lastHudPhaseProgress = null;
    this._challengeUrgencyTween = null;
    this._challengeUrgencyTweenActive = false;
    this._exitTextPulseTween = null;
    this._phaseBarPulseTween = null;
    this._shieldPulseTween = null;
    this._statusTextTween = null;
    this._objectivePulseTween = null;
    this._lastPhaseBarWidthTarget = null;
    this._phaseBarWidthTween = null;
    this._justSetNewRecord = false;
    this._lastMilestoneCelebrated = 0;
    this._lastScoreTickSecond = -1;
    this._getReadyRemainingMs = 0;
    this._getReadyOverlay = null;
    this._challengePanelTween = null;
    this._phasePowerupSprite = null;
    this.heatIndicator = null;
    this.perkOptionIcons = null;
    this.paused = false;
    this.pausePanel = null;
    this._initialHighScore = 0;
    this._richPresenceThrottle = 0;
    this.contracts = [];
    this.runArchetypes = new Set();
    this.lastContractClaims = [];
    this.contractSummaryText = null;
  }

  init(data) {
    this._returnData = data || {};
  }

  preload() {
    super.preload();
    this._loadError = false;
    this.load.on("loaderror", () => {
      this._loadError = true;
    });
    this.load.audio("musicBack", musicBack);
    this.load.audio("gameOver", gameOver);
    this.load.audio("ooGnome", ooGnome);
  }

  create() {
    if (this._loadError) {
      const msg = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "Something went wrong loading the game.", {
        font: "700 28px Arial",
        fill: "#ff8072",
        align: "center"
      });
      msg.setOrigin(0.5, 0.5);
      const retry = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, "Retry", {
        font: "700 24px Arial",
        fill: "#9ae6ff"
      });
      retry.setOrigin(0.5, 0.5);
      retry.setInteractive({ useHandCursor: true });
      retry.on("pointerdown", () => this.scene.restart());
      return;
    }
    super.createSceneShell(PLAYER_START_X, "mummy");
    this.input.keyboard.resetKeys();
    this.platforms.clear(true, true);
    this.player.body.setAllowGravity(false);
    this.player.setPosition(PLAYER_START_X, PLAYER_START_Y);
    this.player.setDepth(4);

    // Atmosphere overlay: vertical gradient (transparent top → dark bottom) for depth
    this.atmosphereOverlay = this.add.graphics();
    this.atmosphereOverlay.fillGradientStyle(
      0x000000,
      0x000000,
      0x08131d,
      0x08131d,
      0,
      0,
      0.5,
      0.5
    );
    this.atmosphereOverlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.atmosphereOverlay.setDepth(1);
    this.atmosphereOverlay.setScrollFactor(0);

    if (this.player.postFX) {
      try {
        this.player.postFX.addGlow(0x55d6ff, 2, 0, false, 0.1, 12);
      } catch (_) {
        this.tweens.add({
          targets: this.player,
          alpha: 0.92,
          duration: 600,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });
      }
    } else {
      this.tweens.add({
        targets: this.player,
        alpha: 0.92,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
    }

    this.movementKeys = this.input.keyboard.addKeys("W,A,S,D");
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.createRuntimeTextures();
    ensureProceduralUiAssets(this);
    this.createHud();
    this._initialHighScore = getHighScore();
    this.highestScoreValue = this._initialHighScore;
    this.createChallengeUi();
    this.createAudio();
    this.createGroups();
    this.createCollisions();
    this.resetRun();
    this.showGetReadyOverlay();

    if (this._returnData && this._returnData.paused) {
      this.paused = true;
      this.physics.pause();
      if (this.music) this.music.pause();
      this.showPausePanel();
    } else {
      setRichPresence("In game");
    }

    this.events.once("shutdown", () => this.stopAudio());
  }

  showGetReadyOverlay() {
    if (this._getReadyOverlay) {
      this._getReadyOverlay.destroy();
      this._getReadyOverlay = null;
    }
    this._getReadyRemainingMs = 2200;
    const getReadyText = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      "Get Ready!",
      { fontSize: "52px", fill: "#d7f9ff", fontStyle: "bold" }
    );
    getReadyText.setOrigin(0.5, 0.5);
    getReadyText.setDepth(20);
    getReadyText.setAlpha(0);
    this._getReadyOverlay = getReadyText;

    this.tweens.add({
      targets: getReadyText,
      alpha: 1,
      duration: 400,
      ease: "Power2.Out"
    });
    this.time.delayedCall(1800, () => {
      this.tweens.add({
        targets: getReadyText,
        alpha: 0,
        duration: 400,
        ease: "Power2.In",
        onComplete: () => {
          if (getReadyText.scene) {
            getReadyText.destroy();
          }
          this._getReadyOverlay = null;
        }
      });
    });
  }

  createRuntimeTextures() {
    if (this.textures.exists("proc-orb-0")) {
      return;
    }
    const families = Object.keys(DEFAULT_PROCEDURAL_PARAMS);
    for (let i = 0; i < families.length; i += 1) {
      const params = DEFAULT_PROCEDURAL_PARAMS[families[i]];
      ensureProceduralTexture(this, params);
    }
  }

  createAudio() {
    const settings = getSettings();
    this.music = this.sound.add("musicBack");
    this.music.setLoop(true);
    this.music.setVolume(settings.musicVolume != null ? settings.musicVolume : 1);
    this.gameOverMusic = this.sound.add("gameOver");
    this.ooGnome = this.sound.add("ooGnome");
    this._sfxVolume = settings.sfxVolume != null ? settings.sfxVolume : 1;
  }

  /**
   * Play ooGnome with given rate/volume (from DODGE_AUDIO). Use for phase change, exit unlock, objective/challenge complete.
   */
  playEventSfx(sfxKey) {
    const cfg = DODGE_AUDIO[sfxKey];
    if (!cfg) return;
    const vol = (this._sfxVolume != null ? this._sfxVolume : 1) * (cfg.volume || 0.2);
    this.ooGnome.setRate(cfg.rate);
    this.ooGnome.setVolume(vol);
    this.ooGnome.play();
  }

  createGroups() {
    this.hazards = this.physics.add.group();
    this.pickups = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.bossGroup = this.physics.add.group();
  }

  createCollisions() {
    this.physics.add.overlap(this.player, this.hazards, (_, hazard) =>
      this.handleHazardHit(hazard)
    );
    this.physics.add.overlap(this.player, this.projectiles, (_, projectile) =>
      this.handleHazardHit(projectile)
    );
    this.physics.add.overlap(this.player, this.bossGroup, (_, boss) =>
      this.handleHazardHit(boss)
    );
    this.physics.add.overlap(this.player, this.pickups, (_, pickup) =>
      this.handlePickupCollision(pickup)
    );
  }

  createHud() {
    this.scoreText = this.add.text(24, 18, "Score: 0", DODGE_HUD_STYLES.scoreText);
    this.scoreText.setStroke(HUD_STROKE.color, HUD_STROKE.width);

    this.highestScore = this.add.text(24, 72, "Best: 0", DODGE_HUD_STYLES.highestScore);

    this.phaseText = this.add.text(912, 24, "Phase: Recovery", DODGE_HUD_STYLES.phaseText);
    this.phaseText.setStroke(HUD_STROKE.color, HUD_STROKE.width);

    this.shieldText = this.add.text(912, 66, "Shields: 0/3", DODGE_HUD_STYLES.shieldText);

    this.statusText = this.add.text(
      GAME_WIDTH / 2,
      88,
      "Recovery phases widen the rain. Heat phases compress the fall lanes.",
      DODGE_HUD_STYLES.statusText
    );
    this.statusText.setOrigin(0.5, 0.5);
    this.statusText.setStroke(HUD_STROKE.color, HUD_STROKE.width);

    // Phase bar track: rounded rect, left edge at 912, vertical center at 116 (Graphics has no setOrigin)
    const phaseBarWidth = 320;
    const phaseBarHeight = 18;
    const phaseBarX = 912;
    const phaseBarY = 116;
    this.phaseBarTrack = this.add.graphics();
    this.phaseBarTrack.setPosition(phaseBarX + phaseBarWidth / 2, phaseBarY);
    this.phaseBarTrack.fillStyle(0x0d1823, 0.95);
    this.phaseBarTrack.fillRoundedRect(-phaseBarWidth / 2, -phaseBarHeight / 2, phaseBarWidth, phaseBarHeight, 9);
    this.phaseBarTrack.lineStyle(1, 0x55d6ff, 0.5);
    this.phaseBarTrack.strokeRoundedRect(-phaseBarWidth / 2, -phaseBarHeight / 2, phaseBarWidth, phaseBarHeight, 9);

    this.phaseBarFill = this.add
      .rectangle(912, 116, 6, 12, 0x55d6ff, 1)
      .setOrigin(0, 0.5);

    this.exitText = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 38,
      "",
      DODGE_HUD_STYLES.statusText
    );
    this.exitText.setOrigin(0.5, 0.5);

    this.objectiveText = this.add.text(24, 108, "Objectives", DODGE_HUD_STYLES.objectiveText);

    this.bossTimerText = this.add.text(912, 200, "", DODGE_HUD_STYLES.bossTimerText);
    this.bossTimerText.setVisible(false);

    // Heat / intensity indicator (visible during Heat phase or when boss active)
    this.heatIndicator = this.add.image(1040, 140, "stageIntensityHeat");
    this.heatIndicator.setScale(0.2);
    this.heatIndicator.setVisible(false);
    this.heatIndicator.setDepth(2);

    // Pause button: click/touch or Escape to open pause menu
    this.pauseButton = this.add.text(GAME_WIDTH - 24, 36, "Pause", {
      font: "700 24px Arial",
      fill: "#9ae6ff"
    });
    this.pauseButton.setOrigin(1, 0.5);
    this.pauseButton.setDepth(8);
    this.pauseButton.setPadding(12, 8);
    this.pauseButton.setInteractive({ useHandCursor: true });
    this.pauseButton.on("pointerdown", () => {
      if (!this.gameOverState && !this.paused && this._getReadyRemainingMs <= 0 && !this.activeChallenge && !this.pendingPerkChoices) {
        this.pause();
      }
    });
    this.pauseButton.on("pointerover", () => this.pauseButton.setScale(1.05));
    this.pauseButton.on("pointerout", () => this.pauseButton.setScale(1));
  }

  resetRun() {
    this.stopAudio();
    this.stopPhaseBarPulse();
    this.physics.resume();
    this.input.keyboard.resetKeys();
    this.spawnDirector.reset();
    this.clearGameOverUi();
    this.clearGroups();
    this.pauseButton?.setVisible(true);

    this.runTimeMs = 0;
    this.bonusScore = 0;
    this.currentFallSpeed = 260;
    this.backgroundSpeed = 14;
    this.shieldCharges = this.runModifiers.maxShields;
    this.damageRecoveryMs = 0;
    this.gameOverState = false;
    this.exitUnlocked = false;
    this.phaseKey = "";
    this.lastFacing = "right";
    this.activeBoss = null;
    this.challengeDirector.reset();
    this.activeChallenge = null;
    this.challengeRemainingMs = 0;
    this.pendingPerkChoices = null;
    this.perkPoints = 0;
    this.ownedPerks = [];
    this.runModifiers = createBaseModifiers();
    this.objectiveDirector.reset();
    this.challengePanel?.setVisible(false);
    this.stopChallengeUrgencyTween();
    this.bossTimerText?.setVisible(false);
    this.tempSpeedBoostMs = 0;
    this.tempInvulnMs = 0;
    this.tempScoreMultMs = 0;
    this.tempScoreMultMultiplier = 1;
    this._lastMilestoneCelebrated = 0;
    this._lastScoreTickSecond = -1;
    this._getReadyRemainingMs = 0;
    this.renderObjectives();
    this.contracts = getActiveContracts().map(contract => ({ ...contract }));
    this.runArchetypes = new Set();
    this.lastContractClaims = [];

    this.player.clearTint();
    this.player.setAlpha(1);
    this.player.setPosition(PLAYER_START_X, PLAYER_START_Y);
    this.player.setVelocity(0, 0);
    this.player.anims.play("flex", true);
    this.updateHud({
      phaseLabel: "Recovery",
      phaseColor: 0x55d6ff,
      phaseProgress: 0
    });
    this._lastHudScore = this.getScore();
    this._lastHudPhaseProgress = 0;
    this.setStatusText(
      "Recovery phases widen the rain. Heat phases compress the fall lanes.",
      0xd7f9ff
    );
    if (this._exitTextPulseTween) {
      this._exitTextPulseTween.stop();
      this._exitTextPulseTween = null;
    }
    if (this._shieldPulseTween) {
      this._shieldPulseTween.stop();
      this._shieldPulseTween = null;
    }
    if (this._statusTextTween) {
      this._statusTextTween.stop();
      this._statusTextTween = null;
    }
    if (this.statusText) {
      this.statusText.setScale(1);
    }
    if (this.shieldText) {
      this.shieldText.setScale(1);
    }
    if (this._objectivePulseTween) {
      this._objectivePulseTween.stop();
      this._objectivePulseTween = null;
    }
    if (this.objectiveText) {
      this.objectiveText.setScale(1);
    }
    this.exitText.setAlpha(1);
    this.exitText.setText("");

    const settings = getSettings();
    this.music.setVolume(settings.musicVolume != null ? settings.musicVolume : 1);
    this._sfxVolume = settings.sfxVolume != null ? settings.sfxVolume : 1;
    this.music.play();
  }

  clearGroups() {
    [this.hazards, this.pickups, this.projectiles, this.bossGroup].forEach(group => {
      group?.clear(true, true);
    });
  }

  clearGameOverUi() {
    if (this.replayTween) {
      this.replayTween.stop();
      this.replayTween = null;
    }

    if (this.replayButton) {
      this.replayButton.removeAllListeners();
      this.replayButton.destroy();
      this.replayButton = null;
    }
    if (this.replayButtonPanel) {
      this.replayButtonPanel.destroy();
      this.replayButtonPanel = null;
    }
    if (this.playAgainText) {
      this.playAgainText.destroy();
      this.playAgainText = null;
    }

    if (this.gameOverText) {
      this.gameOverText.destroy();
      this.gameOverText = null;
    }
    if (this.gameOverPanel) {
      this.gameOverPanel.destroy();
      this.gameOverPanel = null;
    }
    if (this.contractSummaryText) {
      this.contractSummaryText.destroy();
      this.contractSummaryText = null;
    }
  }

  stopAudio() {
    [this.music, this.gameOverMusic, this.ooGnome].forEach(sound => {
      if (sound?.isPlaying) {
        sound.stop();
      }
    });
  }

  getScore() {
    return Math.floor(this.runTimeMs / SCORE_TICK_MS) + this.bonusScore;
  }

  /**
   * One-shot particle burst using procedural bolt/orb texture.
   * @param {number} [tint] - Optional hex tint for particles (e.g. 0x55d6ff). Omit for default (no tint).
   */
  emitParticleBurst(x, y, quantity = 10, lifespan = 350, scaleStart = 0.35, tint) {
    const textureKey = this.textures.exists("proc-bolt-0") ? "proc-bolt-0" : "proc-orb-0";
    const config = {
      emitting: false,
      lifespan,
      speed: { min: 80, max: 180 },
      scale: { start: scaleStart, end: 0 },
      blendMode: "ADD"
    };
    if (tint != null) {
      config.tint = { start: tint, end: tint };
    }
    const emitter = this.add.particles(x, y, textureKey, config);
    emitter.explode(quantity);
    this.time.delayedCall(lifespan + 50, () => emitter.destroy());
  }

  handlePickupCollision(pickup) {
    if (this.gameOverState) {
      return;
    }

    const pickupType = pickup.getData("pickupType") ?? "shield";
    const px = pickup.x;
    const py = pickup.y;
    const PICKUP_TINTS = {
      shield: 0x55d6ff,
      speed: 0x4ecdc4,
      invuln: 0xffe66d,
      scoreMult: 0x95e1d3
    };
    this.emitParticleBurst(px, py, 12, 350, 0.35, PICKUP_TINTS[pickupType] ?? PICKUP_TINTS.shield);
    pickup.destroy();
    this.ooGnome.setRate(0.9 + Math.random() * 0.25);
    this.ooGnome.play();

    if (pickupType === "shield") {
      if (this.shieldCharges < this.runModifiers.maxShields) {
        this.shieldCharges += 1;
        showFloatingText(this, px, py, "+1 Shield", "#55d6ff");
      } else {
        this.bonusScore += 3;
        this.setStatusText("Shield bank full. Pickup converted into bonus score.", 0xfff2b5);
        showFloatingText(this, px, py, "+3 score", "#fff2b5");
      }
    } else if (pickupType === "speed") {
      this.tempSpeedBoostMs = 5000;
      this.setStatusText("Speed boost active! +25% move speed for 5s.", 0x4ecdc4);
      showFloatingText(this, px, py, "Speed!", "#4ecdc4");
    } else if (pickupType === "invuln") {
      this.tempInvulnMs = 3000;
      this.setStatusText("Invulnerability! No damage for 3s.", 0xffe66d);
      showFloatingText(this, px, py, "Invuln!", "#ffe66d");
    } else if (pickupType === "scoreMult") {
      this.tempScoreMultMs = 10000;
      this.tempScoreMultMultiplier = 1.5;
      this.setStatusText("Score multiplier! 1.5x score for 10s.", 0x95e1d3);
      showFloatingText(this, px, py, "1.5x Score!", "#95e1d3");
    }

    this.bonusScore += this.runModifiers.extraScorePerPickup ?? 0;
    this.objectiveDirector.recordPickup();
    this.recordContractEvent({ type: "pickup" });
    this.processObjectiveRewards();

    impactSquash(this, this.player, { flash: true });
    if (this.juice) this.juice.bounce(this.player);
  }

  handleHazardHit(source) {
    if (this.gameOverState || this.damageRecoveryMs > 0) {
      return;
    }

    if (this.tempInvulnMs > 0) {
      return;
    }

    if (this.shieldCharges > 0) {
      this.consumeShield(source);
      return;
    }

    this.endRun();
  }

  consumeShield(source) {
    this.shieldCharges -= 1;
    this.damageRecoveryMs = this.runModifiers.invulnerabilityMs;

    if (!source?.getData?.("persistent")) {
      source?.destroy();
    }

    cameraShake(this, 150, 0.005);
    this.setStatusText("Shield popped. Short invulnerability window active.", 0xffd166);

    this.emitParticleBurst(this.player.x, this.player.y, 6, 280, 0.25, 0xffd166);
    impactSquash(this, this.player, { flash: true });
    if (this.juice) this.juice.shake(this.player);

    this.tweens.add({
      targets: this.player,
      alpha: 0.2,
      duration: 90,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        if (!this.gameOverState) {
          this.player.setAlpha(1);
        }
      }
    });
  }

  endRun() {
    this.stopAudio();
    this.gameOverMusic.play();
    cameraShake(this, 220, 0.008);
    this.emitParticleBurst(this.player.x, this.player.y, 14, 400, 0.35);
    this.cameras.main.flash(200, 255, 80, 80, false);
    this.physics.pause();

    const score = this.getScore();
    if (score > this.highestScoreValue) {
      this.highestScoreValue = score;
      setHighScore(score);
      this._justSetNewRecord = true;
      if (this._initialHighScore === 0) {
        unlockAchievement("first_run");
      }
    } else {
      this._justSetNewRecord = false;
    }
    submitLeaderboardScore("best_score", this.highestScoreValue);
    submitLeaderboardScore("longest_survival_sec", Math.floor(this.runTimeMs / 1000));

    this.highestScore.setText(`Best: ${this.highestScoreValue}`);
    this.gameOverState = "ended";
    this.player.setVelocity(0, 0);
    this.player.anims.play("flex", true);

    this.claimCompletedContracts();
    this.showGameOver();
  }

  showGameOver() {
    this.pauseButton?.setVisible(false);
    this.gameOverPanel = this.add
      .rectangle(GAME_WIDTH / 2, 170, 600, 280, 0x0d1823, 0.92)
      .setStrokeStyle(2, 0xff8072, 0.8)
      .setDepth(10);
    this.gameOverPanel.setAlpha(0);
    this.gameOverPanel.setScale(0.96);
    this.tweens.add({
      targets: this.gameOverPanel,
      alpha: 1,
      scale: 1,
      duration: 280,
      ease: "Power2.Out"
    });

    this.gameOverText = this.add.text(
      GAME_WIDTH / 2,
      150,
      `Skyfall Ended\nScore: ${this.getScore()}\nBest: ${this.highestScoreValue}`,
      {
        fontSize: "72px",
        fill: "#ff8072",
        align: "center"
      }
    );
    this.gameOverText.setOrigin(0.5, 0);
    this.gameOverText.setDepth(11);
    this.gameOverText.setAlpha(0);
    this.tweens.add({
      targets: this.gameOverText,
      alpha: 1,
      duration: 240,
      delay: 60,
      ease: "Power2.Out"
    });
    const survivedSec = Math.floor(this.runTimeMs / 1000);
    const objectives = this.objectiveDirector ? this.objectiveDirector.getObjectives() : [];
    const completedCount = objectives.filter(o => o.completed).length;
    const summaryLine = `Time: ${survivedSec}s${objectives.length ? ` · Objectives: ${completedCount}/${objectives.length}` : ""}`;
    const summaryText = this.add.text(GAME_WIDTH / 2, 235, summaryLine, {
      fontSize: "22px",
      fill: "#d7f9ff",
      align: "center"
    });
    summaryText.setOrigin(0.5, 0);
    summaryText.setDepth(11);
    summaryText.setAlpha(0);
    this.tweens.add({ targets: summaryText, alpha: 1, duration: 240, delay: 120, ease: "Power2.Out" });
    const claimLines = this.lastContractClaims.map(claim => `• ${claim.title}: +${claim.reward.currency}c, +${claim.reward.fragments}f`);
    const completionCount = this.contracts.filter(contract => contract.completed).length;
    const summaryLines = [
      `Contracts: ${completionCount}/${this.contracts.length} completed${this.lastContractClaims.length ? ` · Claims: ${this.lastContractClaims.length}` : ""}`,
      ...claimLines
    ];
    this.contractSummaryText = this.add.text(GAME_WIDTH / 2, 268, summaryLines.join("\n"), {
      fontSize: "18px",
      fill: "#9ae6ff",
      align: "center"
    });
    this.contractSummaryText.setOrigin(0.5, 0);
    this.contractSummaryText.setDepth(11);
    this.contractSummaryText.setAlpha(0);
    this.tweens.add({ targets: this.contractSummaryText, alpha: 1, duration: 260, delay: 140, ease: "Power2.Out" });
    if (this._justSetNewRecord) {
      this.cameras.main.flash(100, 200, 200, 100, false);
      showFloatingText(this, GAME_WIDTH / 2, 220, "New record!", "#fff2b5");
      this._justSetNewRecord = false;
    }
    this.showReplayButton();
  }

  showReplayButton() {
    this.replayButtonPanel = this.add
      .rectangle(GAME_WIDTH / 2, 540, 160, 100, 0x0d1823, 0.92)
      .setStrokeStyle(2, 0xff8072, 0.75)
      .setDepth(12);
    this.replayButtonPanel.setScale(0.88);
    this.tweens.add({
      targets: this.replayButtonPanel,
      scale: 1,
      duration: 320,
      ease: "Back.easeOut"
    });

    this.replayButton = this.add.sprite(GAME_WIDTH / 2, 518, "replay");
    this.replayButton.setScale(0);
    this.replayButton.setDepth(13);
    this.replayButton.setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: this.replayButton,
      scale: 0.22,
      duration: 350,
      delay: 80,
      ease: "Back.easeOut"
    });

    const playAgainText = this.add.text(GAME_WIDTH / 2, 562, "Play again", {
      fontSize: "28px",
      fill: "#ffb380",
      fontStyle: "bold",
      align: "center"
    });
    playAgainText.setOrigin(0.5, 0.5);
    playAgainText.setDepth(13);
    playAgainText.setScale(0);
    this.tweens.add({
      targets: playAgainText,
      scale: 1,
      duration: 280,
      delay: 120,
      ease: "Back.easeOut"
    });
    this.playAgainText = playAgainText;

    this.replayTween = this.tweens.add({
      targets: this.replayButton,
      ease: "Sine.easeInOut",
      duration: 2000,
      alpha: 0.18,
      repeat: -1,
      yoyo: true
    });

    // Pointer feedback: press and hover scale tweens (pulse tween only affects alpha)
    const REST_SCALE = 0.22;
    const HOVER_SCALE = 0.24;
    const PRESS_SCALE = 0.25;

    const stopReplayScaleTween = () => {
      if (this._replayScaleTween) {
        this._replayScaleTween.stop();
        this._replayScaleTween = null;
      }
    };

    this.replayButton.on("pointerdown", () => {
      stopReplayScaleTween();
      this._replayScaleTween = this.tweens.add({
        targets: this.replayButton,
        scale: PRESS_SCALE,
        duration: 50,
        ease: "Power2.easeOut"
      });
    });

    this.replayButton.on("pointerup", () => {
      stopReplayScaleTween();
      this._replayScaleTween = this.tweens.add({
        targets: this.replayButton,
        scale: REST_SCALE,
        duration: 80
      });
    });

    this.replayButton.on("pointerout", () => {
      stopReplayScaleTween();
      this._replayScaleTween = this.tweens.add({
        targets: this.replayButton,
        scale: REST_SCALE,
        duration: 80
      });
    });

    this.replayButton.on("pointerover", () => {
      stopReplayScaleTween();
      this._replayScaleTween = this.tweens.add({
        targets: this.replayButton,
        scale: HOVER_SCALE,
        duration: 60
      });
    });

    this.replayButton.on("pointerup", () => this.resetRun());

    const quitToMenuText = this.add.text(GAME_WIDTH / 2, 600, "Quit to menu", {
      fontSize: "24px",
      fill: "#ffb380",
      fontStyle: "bold",
      align: "center"
    });
    quitToMenuText.setOrigin(0.5, 0.5);
    quitToMenuText.setDepth(13);
    quitToMenuText.setScale(0);
    quitToMenuText.setInteractive({ useHandCursor: true });
    this.tweens.add({
      targets: quitToMenuText,
      scale: 1,
      duration: 280,
      delay: 160,
      ease: "Back.easeOut"
    });
    quitToMenuText.on("pointerover", () => quitToMenuText.setScale(1.08));
    quitToMenuText.on("pointerout", () => quitToMenuText.setScale(1));
    quitToMenuText.on("pointerdown", () => this.exitAndSaveRun());
  }

  showPausePanel() {
    if (this.pausePanel) return;
    this.pauseButton?.setVisible(false);
    this.pausePanel = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 500, 400, 0x0d1823, 0.95).setStrokeStyle(2, 0x55d6ff, 0.8).setDepth(15);
    const pausedText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 120, "Paused", { fontSize: "48px", fill: "#55d6ff", fontStyle: "bold" }).setOrigin(0.5, 0.5).setDepth(16);
    const resumeBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 55, "Resume", { fontSize: "28px", fill: "#9ae6ff" }).setOrigin(0.5, 0.5).setDepth(16).setPadding(20, 12);
    const optionsBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 5, "Options", { fontSize: "28px", fill: "#9ae6ff" }).setOrigin(0.5, 0.5).setDepth(16).setPadding(20, 12);
    const exitAndSaveBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 65, "Exit and save", { fontSize: "28px", fill: "#ffb380" }).setOrigin(0.5, 0.5).setDepth(16).setPadding(20, 12);
    const quitNoSaveBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 125, "Quit without saving", { fontSize: "24px", fill: "#8a9aa8" }).setOrigin(0.5, 0.5).setDepth(16).setPadding(20, 12);

    [resumeBtn, optionsBtn, exitAndSaveBtn, quitNoSaveBtn].forEach(btn => btn.setInteractive({ useHandCursor: true }));

    resumeBtn.on("pointerover", () => resumeBtn.setScale(1.1));
    resumeBtn.on("pointerout", () => resumeBtn.setScale(1));
    resumeBtn.on("pointerdown", () => this.resume());

    optionsBtn.on("pointerover", () => optionsBtn.setScale(1.1));
    optionsBtn.on("pointerout", () => optionsBtn.setScale(1));
    optionsBtn.on("pointerdown", () => {
      this.scene.start(SCENE_KEYS.options, { returnTo: SCENE_KEYS.game, returnData: { paused: true } });
    });

    exitAndSaveBtn.on("pointerover", () => exitAndSaveBtn.setScale(1.1));
    exitAndSaveBtn.on("pointerout", () => exitAndSaveBtn.setScale(1));
    exitAndSaveBtn.on("pointerdown", () => this.exitAndSaveRun());

    quitNoSaveBtn.on("pointerover", () => quitNoSaveBtn.setScale(1.1));
    quitNoSaveBtn.on("pointerout", () => quitNoSaveBtn.setScale(1));
    quitNoSaveBtn.on("pointerdown", () => this.scene.start(SCENE_KEYS.mainMenu));

    this._pausePanelChildren = [this.pausePanel, pausedText, resumeBtn, optionsBtn, exitAndSaveBtn, quitNoSaveBtn];
  }

  /** Save run as last completed level = current level - 1 (do not save ongoing level), then go to main menu. */
  exitAndSaveRun() {
    const score = this.getScore();
    const currentLevel = getCurrentLevelFromScore(score);
    const levelToSave = Math.max(0, currentLevel - 1);
    if (levelToSave > 0) {
      setLastCompletedLevel(Math.max(getLastCompletedLevel(), levelToSave));
    }
    this.claimCompletedContracts();
    this.stopAudio();
    this.scene.start(SCENE_KEYS.mainMenu);
  }

  hidePausePanel() {
    if (this._pausePanelChildren) {
      this._pausePanelChildren.forEach(c => c.destroy());
      this._pausePanelChildren = null;
    }
    this.pausePanel = null;
    if (this.pauseButton && !this.gameOverState) {
      this.pauseButton.setVisible(true);
    }
  }

  pause() {
    this.paused = true;
    this.physics.pause();
    if (this.music) this.music.pause();
    setRichPresence("Paused");
    this.showPausePanel();
  }

  resume() {
    this.paused = false;
    this.hidePausePanel();
    this.physics.resume();
    if (this.music) this.music.resume();
    setRichPresence("In game");
  }

  update(_, delta) {
    if (this.escKey && Phaser.Input.Keyboard.JustDown(this.escKey) && this.gameOverState === false && !this.activeChallenge && !this.pendingPerkChoices && this._getReadyRemainingMs <= 0) {
      if (this.paused) {
        this.resume();
      } else {
        this.pause();
      }
      return;
    }
    if (this.paused) {
      return;
    }
    if (this.gameOverState === false) {
      if (this.activeChallenge || this.pendingPerkChoices) {
        this.updateChallengeState(delta);
        this.updateHud(this.spawnDirector.getContext(this.getScore()));
        return;
      }

      if (this._getReadyRemainingMs > 0) {
        this._getReadyRemainingMs = Math.max(0, this._getReadyRemainingMs - delta);
        this.updateHud(this.spawnDirector.getContext(this.getScore()));
        this.updateParallax(delta);
        this.updatePlayerMovement();
        this.clearOffscreenObjects();
        return;
      }

      this.runTimeMs += delta;
      const currentSecond = Math.floor(this.runTimeMs / 1000);
      if (currentSecond > this._lastScoreTickSecond) {
        const skipFirstTick = this._lastScoreTickSecond === -1 && currentSecond === 0;
        if (!skipFirstTick) {
          this.ooGnome.setVolume(0.12);
          this.ooGnome.setRate(1.6);
          this.ooGnome.play();
        }
        this._lastScoreTickSecond = currentSecond;
      }
      this.damageRecoveryMs = Math.max(0, this.damageRecoveryMs - delta);
      this.objectiveDirector.recordSurvival(delta);
      this.recordContractEvent({ type: "survival", deltaMs: delta });

      this.tempSpeedBoostMs = Math.max(0, this.tempSpeedBoostMs - delta);
      this.tempInvulnMs = Math.max(0, this.tempInvulnMs - delta);
      if (this.tempScoreMultMs > 0) {
        this.tempScoreMultMs = Math.max(0, this.tempScoreMultMs - delta);
        this.bonusScore += (delta / 1000) * (this.tempScoreMultMultiplier - 1);
      }

      const score = this.getScore();
      const { events, context } = this.spawnDirector.update(
        delta,
        score,
        Boolean(this.activeBoss)
      );

      this.currentFallSpeed = context.fallSpeed;
      this.backgroundSpeed = context.backgroundSpeed;
      const toCelebrate = MILESTONES.find(
        m => score >= m && m > this._lastMilestoneCelebrated
      );
      if (toCelebrate != null) {
        this._lastMilestoneCelebrated = toCelebrate;
        this.emitParticleBurst(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 8, 300, 0.3);
        showFloatingText(
          this,
          GAME_WIDTH / 2,
          GAME_HEIGHT / 2 - 80,
          toCelebrate + "!",
          "#fff2b5"
        );
        if (toCelebrate >= 50) unlockAchievement("score_50");
        if (toCelebrate >= 100) unlockAchievement("score_100");
        if (toCelebrate >= 120) unlockAchievement("score_120");
      }
      this.handlePhaseChange(context);
      this.updateHud(context);
      this.updateParallax(delta);

      events.forEach(event => this.spawnFromDescriptor(event));

      this.updateMovingGroup(this.hazards, delta);
      this.updateMovingGroup(this.pickups, delta);
      this.updateProjectiles(delta);
      this.updateBoss(delta);
      this.updatePlayerMovement();
      this.unlockExitIfNeeded(score);
      this.maybeStartChallenge(score, context.intensity);
      this.processObjectiveRewards();

      this._richPresenceThrottle = (this._richPresenceThrottle || 0) + delta;
      if (this._richPresenceThrottle > 3000) {
        this._richPresenceThrottle = 0;
        setRichPresence(`Score: ${score}`);
      }

      if (this.exitUnlocked && this.player?.body?.blocked?.right) {
        this.cameras.main.fade(400, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.stopAudio();
          submitLeaderboardScore("best_score", this.highestScoreValue);
          submitLeaderboardScore("longest_survival_sec", Math.floor(this.runTimeMs / 1000));
          this.scene.start(SCENE_KEYS.mainMenu);
        });
        return;
      }
    } else if (this.gameOverState === "ended") {
      this.player.setVelocity(0, 0);
      this.player.anims.play("flex", true);
    }

    this.clearOffscreenObjects();
  }

  recordContractEvent(event) {
    this.contracts = applyRunEventToContracts(this.contracts, event);
  }

  claimCompletedContracts() {
    const active = this.contracts || [];
    updateContracts(() => active);
    this.lastContractClaims = [];
    active.forEach((contract) => {
      const reward = claimCompletedContract(contract.id);
      if (reward) {
        this.lastContractClaims.push({ title: contract.title, reward });
      }
    });
  }

  updatePlayerMovement() {
    const movingLeft = this.cursors.left.isDown || this.movementKeys.A.isDown;
    const movingRight = this.cursors.right.isDown || this.movementKeys.D.isDown;
    const movingUp = this.cursors.up.isDown || this.movementKeys.W.isDown;
    const movingDown = this.cursors.down.isDown || this.movementKeys.S.isDown;

    let velocityX = 0;
    let velocityY = 0;

    if (movingLeft) {
      velocityX -= 1;
    }
    if (movingRight) {
      velocityX += 1;
    }
    if (movingUp) {
      velocityY -= 1;
    }
    if (movingDown) {
      velocityY += 1;
    }

    if (velocityX !== 0 || velocityY !== 0) {
      const magnitude = Math.hypot(velocityX, velocityY) || 1;
      let liveSpeed = PLAYER_SPEED * this.runModifiers.moveSpeedMultiplier;
      if (this.tempSpeedBoostMs > 0) {
        liveSpeed *= 1.25;
      }
      velocityX = (velocityX / magnitude) * liveSpeed;
      velocityY = (velocityY / magnitude) * liveSpeed;
      this.player.setVelocity(velocityX, velocityY);

      if (velocityX < 0) {
        this.lastFacing = "left";
        this.player.anims.play("walkLeft", true);
      } else if (velocityX > 0) {
        this.lastFacing = "right";
        this.player.anims.play("walkRight", true);
      } else {
        this.player.anims.play(
          this.lastFacing === "left" ? "walkLeft" : "walkRight",
          true
        );
      }

      return;
    }

    this.player.setVelocity(0, 0);
    this.player.anims.play("flex", true);
  }

  handlePhaseChange(context) {
    if (this.phaseKey === context.phaseKey) {
      return;
    }

    this.phaseKey = context.phaseKey;

    const phaseMessages = {
      recovery: "Recovery phase. Wider gaps and more pickup windows.",
      push: "Push phase. The sky starts layering staggered drops.",
      heat: "Heat phase. Faster rain and miniboss chances unlock.",
      reset: "Reset phase. Pressure backs off before the next build."
    };

    this.setStatusText(phaseMessages[context.phaseKey], context.phaseColor);

    this.playEventSfx("sfxPhaseChange");
    const phaseColor = context.phaseColor ?? 0x55d6ff;
    const r = (phaseColor >> 16) & 0xff;
    const g = (phaseColor >> 8) & 0xff;
    const b = phaseColor & 0xff;
    this.cameras.main.flash(120, r >> 1, g >> 1, b >> 1, false);
    this.emitParticleBurst(GAME_WIDTH / 2, GAME_HEIGHT / 2, 7, 250, 0.35);
    emitPhaseChangeBurst(this, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30);

    if (this._phasePowerupSprite) {
      this._phasePowerupSprite.destroy();
      this._phasePowerupSprite = null;
    }
    if (this.textures.exists("stagePowerup")) {
      this._phasePowerupSprite = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, "stagePowerup");
      this._phasePowerupSprite.setScale(0);
      this._phasePowerupSprite.setDepth(14);
      this.tweens.add({
        targets: this._phasePowerupSprite,
        scale: 0.35,
        alpha: 0,
        duration: 600,
        ease: "Power2.Out",
        onComplete: () => {
          if (this._phasePowerupSprite?.scene) {
            this._phasePowerupSprite.destroy();
            this._phasePowerupSprite = null;
          }
        }
      });
    }
  }

  setStatusText(message, color = 0xd7f9ff) {
    this.statusText.setText(message);
    this.statusText.setColor(`#${color.toString(16).padStart(6, "0")}`);
    if (this._statusTextTween) this._statusTextTween.stop();
    this.statusText.setScale(0.96);
    this._statusTextTween = this.tweens.add({
      targets: this.statusText,
      scale: 1,
      duration: 80,
      ease: "Power2.Out",
      onComplete: () => {
        this._statusTextTween = null;
      }
    });
  }

  updateHud(context) {
    const score = this.getScore();
    const phaseProgress = context.phaseProgress;

    if (phaseProgress < 0.85) {
      this.stopPhaseBarPulse();
    }

    if (this._lastHudScore != null && score !== this._lastHudScore) {
      this.tweens.add({
        targets: this.scoreText,
        scale: 1.08,
        duration: 40,
        yoyo: true,
        hold: 0,
        onComplete: () => {
          this.scoreText.setScale(1);
        }
      });
    }
    this._lastHudScore = score;

    if (this._lastHudPhaseProgress != null && phaseProgress !== this._lastHudPhaseProgress) {
      this.tweens.add({
        targets: this.phaseBarFill,
        scaleY: 1.05,
        duration: 40,
        yoyo: true,
        hold: 0,
        onComplete: () => {
          this.phaseBarFill.setScale(1, 1);
        }
      });
    }
    this._lastHudPhaseProgress = phaseProgress;

    if (phaseProgress >= 0.85 && !this._phaseBarPulseTween) {
      this.phaseBarFill.setScale(1, 1);
      this._phaseBarPulseTween = this.tweens.add({
        targets: this.phaseBarFill,
        scaleY: 1.04,
        duration: 300,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
    }

    this.scoreText.setText(`Score: ${score}`);
    this.highestScore.setText(`Best: ${this.highestScoreValue}`);
    this.phaseText.setText(`Phase: ${context.phaseLabel}`);
    this.phaseText.setColor(`#${context.phaseColor.toString(16).padStart(6, "0")}`);
    this.shieldText.setText(`Shields: ${this.shieldCharges}/${this.runModifiers.maxShields}`);
    if (!this.gameOverState && this.shieldCharges <= 1) {
      this.shieldText.setColor(this.shieldCharges === 0 ? "#ff4444" : "#ffaa44");
      if (!this._shieldPulseTween) {
        this.shieldText.setScale(1);
        this._shieldPulseTween = this.tweens.add({
          targets: this.shieldText,
          scale: 1.06,
          duration: 400,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });
      }
    } else {
      this.shieldText.setColor("#ffffff");
      if (this._shieldPulseTween) {
        this._shieldPulseTween.stop();
        this._shieldPulseTween = null;
      }
      this.shieldText.setScale(1);
    }
    this.phaseBarFill.fillColor = context.phaseColor;

    if (this.heatIndicator) {
      const showHeat = context.phaseKey === "heat" || Boolean(this.activeBoss);
      this.heatIndicator.setVisible(showHeat);
    }

    const phaseBarWidthTarget = Math.max(6, 320 * context.phaseProgress);
    if (phaseBarWidthTarget !== this._lastPhaseBarWidthTarget) {
      if (this._phaseBarWidthTween) {
        this._phaseBarWidthTween.stop();
        this._phaseBarWidthTween = null;
      }
      this._lastPhaseBarWidthTarget = phaseBarWidthTarget;
      this._phaseBarWidthTween = this.tweens.add({
        targets: this.phaseBarFill,
        width: phaseBarWidthTarget,
        duration: 90,
        ease: "Power2.Out",
        onComplete: () => {
          this._phaseBarWidthTween = null;
          this._lastPhaseBarWidthTarget = phaseBarWidthTarget;
        }
      });
    }
  }

  createChallengeUi() {
    if (!this.textures.exists("challengePanelBg")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x08131d, 0.95);
      g.fillRoundedRect(0, 0, 740, 330, 16);
      g.lineStyle(3, 0x55d6ff, 0.9);
      g.strokeRoundedRect(0, 0, 740, 330, 16);
      g.generateTexture("challengePanelBg", 740, 330);
      g.destroy();
    }
    const panelGlow = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 740 * 1.02, 330 * 1.02, 0x55d6ff, 0.15);
    const panelBg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "challengePanelBg");
    this.challengeInputKeys = this.input.keyboard.addKeys("ONE,TWO,THREE");
    this.challengeText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 104, "", {
      font: "700 34px Arial",
      fill: "#d7f9ff",
      align: "center"
    });
    this.challengeText.setOrigin(0.5, 0.5);

    this.challengeTimerText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 34, "", {
      font: "700 24px Arial",
      fill: "#ffd166",
      align: "center"
    });
    this.challengeTimerText.setOrigin(0.5, 0.5);

    this.challengeOptionTexts = [0, 1, 2].map(index => {
      const optionText = this.add.text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 30 + index * 54,
        "",
        { font: "700 28px Arial", fill: "#ffffff", align: "center" }
      );
      optionText.setOrigin(0.5, 0.5);
      optionText.setPadding(24, 12);
      optionText.setInteractive({ useHandCursor: true });
      optionText.on("pointerdown", () => this._onChallengeOrPerkOptionSelected(index));
      return optionText;
    });

    this.perkOptionIcons = [0, 1, 2].map(index => {
      const icon = this.add.sprite(
        GAME_WIDTH / 2 - 280,
        GAME_HEIGHT / 2 + 30 + index * 54,
        "perkIcons",
        0
      );
      icon.setScale(1.2);
      icon.setVisible(false);
      icon.setInteractive({ useHandCursor: true });
      icon.on("pointerdown", () => this._onChallengeOrPerkOptionSelected(index));
      return icon;
    });

    this.challengePanel = this.add.container(0, 0, [
      panelGlow,
      panelBg,
      this.challengeText,
      this.challengeTimerText,
      ...this.challengeOptionTexts,
      ...this.perkOptionIcons
    ]);
    this.challengePanel.setDepth(15);
    this.challengePanel.setVisible(false);
  }

  showChallengePanelTransitionIn() {
    if (this._challengePanelTween) {
      this._challengePanelTween.stop();
      this._challengePanelTween = null;
    }
    this.challengePanel.setAlpha(0);
    this.challengePanel.setScale(0.94);
    this.challengePanel.setVisible(true);
    this._challengePanelTween = this.tweens.add({
      targets: this.challengePanel,
      alpha: 1,
      scale: 1,
      duration: 220,
      ease: "Power2.Out",
      onComplete: () => {
        this._challengePanelTween = null;
      }
    });
  }

  hideChallengePanelTransitionOut(onComplete) {
    if (this._challengePanelTween) {
      this._challengePanelTween.stop();
      this._challengePanelTween = null;
    }
    this._challengePanelTween = this.tweens.add({
      targets: this.challengePanel,
      alpha: 0,
      scale: 0.94,
      duration: 180,
      ease: "Power2.In",
      onComplete: () => {
        this.challengePanel.setVisible(false);
        this.challengePanel.setAlpha(1);
        this.challengePanel.setScale(1);
        this._challengePanelTween = null;
        if (onComplete) onComplete();
      }
    });
  }

  maybeStartChallenge(score, intensity) {
    const challenge = this.challengeDirector.maybeCreateChallenge(score, intensity);
    if (!challenge) {
      return;
    }

    this.activeChallenge = challenge;
    this.challengeRemainingMs = challenge.durationMs;
    this.showChallengePanelTransitionIn();
    this.challengeText.setText(`${challenge.title}\n${challenge.prompt}`);
    this.challengeOptionTexts.forEach((entry, index) => {
      entry.setText(`${index + 1}. ${challenge.options[index]}`);
    });
    this.perkOptionIcons.forEach(icon => icon.setVisible(false));
    this.physics.pause();
    this.music.setVolume(0.25);
    this.setStatusText("Challenge break: answer before the timer expires.", 0x55d6ff);
  }

  updateChallengeState(delta) {
    if (this.pendingPerkChoices) {
      this.captureOptionInput(this.pendingPerkChoices, chosenPerk => {
        this.runModifiers = applyPerk(this.runModifiers, chosenPerk.id);
        this.ownedPerks.push(chosenPerk.id);
        this.pendingPerkChoices = null;
        this.hideChallengePanelTransitionOut(() => {
          this.music.setVolume(DODGE_AUDIO.musicNormalVolume);
          this.physics.resume();
          this.setStatusText(`Perk online: ${chosenPerk.title}.`, 0x8be9b1);
          if (this.juice) this.juice.pulse(this.player);
        });
      });
      return;
    }

    if (!this.activeChallenge) {
      return;
    }

    this.challengeRemainingMs = Math.max(0, this.challengeRemainingMs - delta);
    const secondsLeft = (this.challengeRemainingMs / 1000).toFixed(1);
    this.challengeTimerText.setText(`Timer: ${secondsLeft}s (press 1 / 2 / 3)`);

    if (this.challengeRemainingMs <= 3000) {
      this.challengeTimerText.setColor("#ff4444");
    } else {
      this.challengeTimerText.setColor("#ffd166");
    }

    if (this.challengeRemainingMs <= 5000 && !this._challengeUrgencyTweenActive) {
      this._challengeUrgencyTweenActive = true;
      this._challengeUrgencyTween = this.tweens.add({
        targets: this.challengeTimerText,
        scale: 1.08,
        duration: 200,
        yoyo: true,
        repeat: -1
      });
    }

    if (this.challengeRemainingMs <= 0) {
      this.resolveChallenge(-1);
      return;
    }

    this.captureOptionInput(this.activeChallenge.options, (_, index) => {
      this.resolveChallenge(index);
    });
  }

  stopChallengeUrgencyTween() {
    if (this._challengeUrgencyTween) {
      this._challengeUrgencyTween.stop();
      this._challengeUrgencyTween = null;
    }
    this._challengeUrgencyTweenActive = false;
    if (this.challengeTimerText) {
      this.challengeTimerText.setScale(1);
      this.challengeTimerText.setColor("#ffd166");
    }
  }

  stopPhaseBarPulse() {
    if (this._phaseBarPulseTween) {
      this._phaseBarPulseTween.stop();
      this._phaseBarPulseTween = null;
    }
    if (this.phaseBarFill) {
      this.phaseBarFill.setScale(1, 1);
    }
  }

  _onChallengeOrPerkOptionSelected(index) {
    if (this.pendingPerkChoices && index < this.pendingPerkChoices.length) {
      const chosenPerk = this.pendingPerkChoices[index];
      this.runModifiers = applyPerk(this.runModifiers, chosenPerk.id);
      this.ownedPerks.push(chosenPerk.id);
      this.pendingPerkChoices = null;
      this.hideChallengePanelTransitionOut(() => {
        this.music.setVolume(DODGE_AUDIO.musicNormalVolume);
        this.physics.resume();
        this.setStatusText(`Perk online: ${chosenPerk.title}.`, 0x8be9b1);
        if (this.juice) this.juice.pulse(this.player);
      });
      return;
    }
    if (this.activeChallenge && index < this.activeChallenge.options.length) {
      this.resolveChallenge(index);
    }
  }

  captureOptionInput(options, onChoice) {
    const keyMap = [this.challengeInputKeys.ONE, this.challengeInputKeys.TWO, this.challengeInputKeys.THREE];
    for (let index = 0; index < options.length; index += 1) {
      if (Phaser.Input.Keyboard.JustDown(keyMap[index])) {
        onChoice(options[index], index);
        break;
      }
    }
  }

  resolveChallenge(selectedIndex) {
    this.stopChallengeUrgencyTween();

    const result = this.challengeDirector.evaluate(
      this.activeChallenge,
      selectedIndex,
      this.challengeRemainingMs
    );

    this.activeChallenge = null;
    this.hideChallengePanelTransitionOut(() => {});

    if (!result.success) {
      this.shieldCharges = Math.max(0, this.shieldCharges - (result.reward.shieldPenalty ?? 0));
      this.music.setVolume(DODGE_AUDIO.musicNormalVolume);
      this.physics.resume();
      this.setStatusText(result.message, 0xff8072);
      return;
    }

    this.playEventSfx("sfxChallengeComplete");
    showFloatingText(this, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 140, "Correct!", "#8be9b1");
    this.emitParticleBurst(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, 6, 280, 0.3, 0x8be9b1);

    const challengeScore = Math.round(
      result.reward.scoreBonus * this.runModifiers.challengeScoreMultiplier
    );
    this.bonusScore += challengeScore;
    if (challengeScore > 0) {
      showFloatingText(this, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100, `+${challengeScore}`, "#8be9b1");
    }
    this.shieldCharges = Math.min(
      this.runModifiers.maxShields,
      this.shieldCharges + result.reward.shieldBonus
    );
    this.perkPoints += result.reward.perkPoint;
    this.setStatusText(result.message, 0x8be9b1);

    if (this.perkPoints > 0) {
      this.perkPoints -= 1;
      const perkChoices = buildPerkChoices(this.ownedPerks);
      if (perkChoices.length > 0) {
        this.pendingPerkChoices = perkChoices;
        this.showChallengePanelTransitionIn();
        this.challengeText.setText("Pick a perk");
        this.challengeTimerText.setText("Press 1 / 2 / 3");
        this.challengeOptionTexts.forEach((entry, index) => {
          const perk = perkChoices[index];
          entry.setText(perk ? `${index + 1}. ${perk.title} — ${perk.description}` : "");
        });
        this.perkOptionIcons.forEach((icon, index) => {
          const perk = perkChoices[index];
          if (perk && this.textures.exists("perkIcons")) {
            const frameIndex = getPerkIconFrame(perk.id);
            icon.setFrame(frameIndex);
            icon.setVisible(true);
          } else {
            icon.setVisible(false);
          }
        });
        return;
      }
    }

    this.music.setVolume(DODGE_AUDIO.musicNormalVolume);
    this.physics.resume();
  }


  processObjectiveRewards() {
    const completed = this.objectiveDirector.consumeCompletedRewards();
    if (completed.length === 0) {
      this.renderObjectives();
      return;
    }

    this.playEventSfx("sfxObjectiveComplete");
    completed.forEach(objective => {
      this.bonusScore += objective.reward.scoreBonus;
      if (objective.reward.scoreBonus > 0) {
        showFloatingText(this, GAME_WIDTH / 2, 160, `+${objective.reward.scoreBonus}`, "#8be9b1");
      }
      this.shieldCharges = Math.min(
        this.runModifiers.maxShields,
        this.shieldCharges + objective.reward.shieldBonus
      );
      this.perkPoints += objective.reward.perkPoint;
      this.setStatusText(`Objective complete: ${objective.title}`, 0x8be9b1);
    });

    this.cameras.main.flash(120, 100, 200, 255, false);
    this.emitParticleBurst(this.player.x, this.player.y, 8, 300, 0.3);
    if (this._objectivePulseTween) {
      this._objectivePulseTween.stop();
      this._objectivePulseTween = null;
    }
    if (this.objectiveText) {
      this.objectiveText.setScale(1.02);
      this._objectivePulseTween = this.tweens.add({
        targets: this.objectiveText,
        scale: 1,
        duration: 120,
        ease: "Power2.easeOut",
        onComplete: () => {
          this._objectivePulseTween = null;
        }
      });
    }
    this.renderObjectives();
  }

  renderObjectives() {
    if (!this.objectiveText) {
      return;
    }

    const lines = this.objectiveDirector.getObjectives().map(objective => {
      const done = objective.claimed ? "✓" : objective.completed ? "★" : "•";
      const progress = objective.id === "survivor"
        ? `${Math.floor(objective.progress / 1000)}s/${Math.floor(objective.target / 1000)}s`
        : `${objective.progress}/${objective.target}`;
      return `${done} ${objective.title}: ${progress}`;
    });

    this.objectiveText.setText(["Objectives", ...lines].join("\n"));
  }

  updateParallax(delta) {
    if (!this.backgroundLayer) {
      return;
    }

    this.backgroundLayer.tilePositionY +=
      (this.backgroundSpeed * delta) / 1000;
  }

  unlockExitIfNeeded(score) {
    if (this.exitUnlocked || score < EXIT_UNLOCK_SCORE) {
      return;
    }

    this.exitUnlocked = true;
    this.setStatusText(
      "Exit unlocked. Dash to the right edge whenever you want to leave the dodge loop.",
      0x8be9b1
    );
    this.exitText.setText("Exit unlocked: touch the right wall to continue");

    this.cameras.main.flash(120, 100, 255, 150, false);
    this.emitParticleBurst(GAME_WIDTH - 80, GAME_HEIGHT / 2, 7, 250, 0.35);

    this.exitText.setAlpha(0.85);
    this._exitTextPulseTween = this.tweens.add({
      targets: this.exitText,
      alpha: 1,
      duration: 600,
      repeat: -1,
      yoyo: true,
      ease: "Sine.easeInOut"
    });
  }

  spawnFromDescriptor(descriptor) {
    if (descriptor.kind === "boss") {
      this.spawnMiniBoss(descriptor);
      return;
    }

    if (descriptor.kind === "pickup") {
      this.spawnPickup(descriptor);
      return;
    }

    this.spawnHazard(descriptor);
  }

  spawnHazard(descriptor) {
    const texture =
      descriptor.proceduralParams != null
        ? ensureProceduralTexture(this, descriptor.proceduralParams)
        : descriptor.texture;
    if (!texture) return;
    const hazard = this.physics.add.image(descriptor.x, descriptor.y, texture);
    hazard.setScale(descriptor.scaleX ?? HAZARD_VISUAL_DEFAULTS.scale, descriptor.scaleY ?? HAZARD_VISUAL_DEFAULTS.scale);
    hazard.setDepth(4);
    hazard.setTint(descriptor.tint ?? HAZARD_VISUAL_DEFAULTS.tint);
    hazard.setAlpha(descriptor.alpha ?? 1);
    hazard.body.setAllowGravity(false);
    hazard.setImmovable(true);
    const vx = descriptor.velocityX ?? 0;
    const vy = descriptor.velocityY ?? descriptor.speed;
    hazard.setVelocity(vx, vy);
    hazard.setDataEnabled();
    hazard.setData("speed", descriptor.speed);
    hazard.setData("velocityX", vx);
    hazard.setData("velocityY", vy);
    hazard.setData("baseX", descriptor.x);
    hazard.setData("baseY", descriptor.y);
    hazard.setData("ageMs", 0);
    hazard.setData("rotationSpeed", descriptor.rotationSpeed ?? 0);
    hazard.setData("motion", descriptor.motion ?? { type: "none" });
    this.applyHitbox(hazard, descriptor.hitbox);
    this.hazards.add(hazard);

    const finalScaleX = descriptor.scaleX ?? HAZARD_VISUAL_DEFAULTS.scale;
    const finalScaleY = descriptor.scaleY ?? HAZARD_VISUAL_DEFAULTS.scale;
    hazard.setScale(0);
    this.tweens.add({
      targets: hazard,
      scaleX: finalScaleX,
      scaleY: finalScaleY,
      duration: 100,
      ease: "Power2.Out"
    });
  }

  spawnPickup(descriptor) {
    const frame = descriptor.pickupFrame;
    const useSprite = descriptor.texture === "pickupPowerups" && frame !== undefined;
    const pickup = useSprite
      ? this.physics.add.sprite(descriptor.x, descriptor.y, descriptor.texture, frame)
      : this.physics.add.image(descriptor.x, descriptor.y, descriptor.texture);
    pickup.setScale(descriptor.scaleX ?? 1, descriptor.scaleY ?? 1);
    pickup.setTint(descriptor.tint ?? 0xffffff);
    pickup.setDepth(3);
    pickup.body.setAllowGravity(false);
    pickup.setImmovable(true);
    const vx = descriptor.velocityX ?? 0;
    const vy = descriptor.velocityY ?? descriptor.speed;
    pickup.setVelocity(vx, vy);
    pickup.setDataEnabled();
    pickup.setData("speed", descriptor.speed);
    pickup.setData("velocityX", vx);
    pickup.setData("velocityY", vy);
    pickup.setData("baseX", descriptor.x);
    pickup.setData("baseY", descriptor.y);
    pickup.setData("ageMs", 0);
    pickup.setData("rotationSpeed", descriptor.rotationSpeed ?? 0);
    pickup.setData("motion", descriptor.motion ?? { type: "none" });
    this.applyHitbox(pickup, descriptor.hitbox);
    pickup.setData("pickupType", descriptor.pickupType ?? "shield");
    this.pickups.add(pickup);

    const PICKUP_ARRIVAL_TINTS = { shield: 0x55d6ff, speed: 0x4ecdc4, invuln: 0xffe66d, scoreMult: 0x95e1d3 };
    this.emitParticleBurst(descriptor.x, descriptor.y, 5, 200, 0.25, PICKUP_ARRIVAL_TINTS[descriptor.pickupType ?? "shield"]);

    const finalScaleX = descriptor.scaleX ?? PICKUP_VISUAL_DEFAULTS.scale;
    const finalScaleY = descriptor.scaleY ?? PICKUP_VISUAL_DEFAULTS.scale;
    pickup.setScale(0);
    this.tweens.add({
      targets: pickup,
      scaleX: finalScaleX,
      scaleY: finalScaleY,
      duration: 100,
      ease: "Power2.Out"
    });
  }

  spawnMiniBoss(descriptor) {
    if (this.activeBoss) {
      return;
    }

    const texture =
      descriptor.proceduralParams != null
        ? ensureProceduralTexture(this, descriptor.proceduralParams)
        : descriptor.texture;
    if (!texture) return;

    const boss = this.physics.add.image(descriptor.x, descriptor.y, texture);
    boss.setScale(descriptor.scaleX ?? 1, descriptor.scaleY ?? 1);
    boss.setDepth(5);
    boss.setTint(descriptor.tint ?? 0xffffff);
    boss.body.setAllowGravity(false);
    boss.setImmovable(true);
    boss.setDataEnabled();
    boss.setData("persistent", true);
    boss.setData("config", descriptor);
    boss.setData("state", "enter");
    boss.setData("attackElapsedMs", 0);
    boss.setData("lifeMs", 0);
    boss.setData("rotationSpeed", 36);
    boss.setVelocity(0, descriptor.entrySpeed);
    this.applyHitbox(boss, descriptor.hitbox);
    this.bossGroup.add(boss);
    this.activeBoss = boss;
    const archetype = descriptor.name || "Unknown";
    const isNewArchetype = !this.runArchetypes.has(archetype);
    this.runArchetypes.add(archetype);
    this.recordContractEvent({ type: "archetypeUsed", archetype, isNewArchetype });

    this.setStatusText(`${descriptor.name} inbound. Dodge the storm pattern.`, 0xff8072);
    cameraShake(this, 250, 0.006);
    cameraZoomPulse(this, 1.03, 220);
    this.cameras.main.flash(180, 255, 110, 110, false);
    this.emitParticleBurst(descriptor.x, descriptor.y, 20, 400, 0.3, 0xff6644);
    if (!this.activeChallenge && !this.pendingPerkChoices && this.music?.isPlaying) {
      this.tweens.add({
        targets: this.music,
        volume: DODGE_AUDIO.musicBossVolume,
        duration: 400,
        ease: "Power2.Out"
      });
    }
    this.ooGnome.setRate(0.5);
    this.ooGnome.play();
  }

  applyHitbox(sprite, hitbox = {}) {
    const scaleX = sprite.scaleX;
    const scaleY = sprite.scaleY;

    if (hitbox.shape === "circle") {
      const radius = hitbox.radius * Math.max(scaleX, scaleY);
      sprite.body.setCircle(radius);
      sprite.body.setOffset(
        (sprite.displayWidth - radius * 2) / 2 + (hitbox.offsetX ?? 0) * scaleX,
        (sprite.displayHeight - radius * 2) / 2 + (hitbox.offsetY ?? 0) * scaleY
      );
      sprite.body.updateFromGameObject();
      return;
    }

    const width = (hitbox.width ?? sprite.displayWidth) * scaleX;
    const height = (hitbox.height ?? sprite.displayHeight) * scaleY;
    const offsetX =
      hitbox.offsetX !== undefined
        ? hitbox.offsetX * scaleX
        : (sprite.displayWidth - width) / 2;
    const offsetY =
      hitbox.offsetY !== undefined
        ? hitbox.offsetY * scaleY
        : (sprite.displayHeight - height) / 2;

    sprite.body.setSize(width, height);
    sprite.body.setOffset(offsetX, offsetY);
    sprite.body.updateFromGameObject();
  }

  updateMovingGroup(group, delta) {
    const deltaSeconds = delta / 1000;

    group.children.each(entry => {
      if (!entry?.body) {
        return;
      }

      const ageMs = entry.getData("ageMs") + delta;
      const motion = entry.getData("motion") ?? { type: "none" };
      const rotationSpeed = entry.getData("rotationSpeed") ?? 0;
      const vx = entry.getData("velocityX") ?? 0;
      const vy = entry.getData("velocityY") ?? entry.getData("speed");

      entry.setData("ageMs", ageMs);
      entry.setVelocity(vx, vy);

      if (motion.type === "sway" && vx === 0) {
        const phaseOffset = motion.phaseOffset ?? 0;
        entry.x =
          entry.getData("baseX") +
          Math.sin((ageMs / 1000) * motion.frequency + phaseOffset) *
            motion.amplitude;
        entry.body.updateFromGameObject();
      }

      if (rotationSpeed !== 0) {
        entry.angle += rotationSpeed * deltaSeconds;
      }
    });
  }

  updateProjectiles(delta) {
    const deltaSeconds = delta / 1000;

    this.projectiles.children.each(projectile => {
      if (!projectile?.body) {
        return;
      }

      projectile.angle += (projectile.getData("rotationSpeed") ?? 360) * deltaSeconds;
    });
  }

  updateBoss(delta) {
    if (!this.activeBoss?.body) {
      this.bossTimerText?.setVisible(false);
      return;
    }

    const boss = this.activeBoss;
    const config = boss.getData("config");
    const state = boss.getData("state");
    const durationMs = config?.durationMs ?? 0;
    const rotationSpeed = boss.getData("rotationSpeed");

    if (state === "enter" || state === "fight") {
      this.bossTimerText.setVisible(true);
      this.bossTimerText.setPosition(912, 200);
      if (state === "enter") {
        this.bossTimerText.setText("Boss: incoming");
      }
    } else if (state === "exit") {
      this.bossTimerText?.setVisible(false);
    }

    boss.angle += rotationSpeed * (delta / 1000);

    if (state === "enter") {
      boss.setVelocity(0, config.entrySpeed);

      if (boss.y >= config.holdY) {
        boss.y = config.holdY;
        boss.body.updateFromGameObject();
        boss.setVelocity(0, 0);
        boss.setData("state", "fight");
      }

      return;
    }

    const lifeMs = boss.getData("lifeMs") + delta;
    const attackElapsedMs = boss.getData("attackElapsedMs") + delta;
    boss.setData("lifeMs", lifeMs);
    boss.setData("attackElapsedMs", attackElapsedMs);

    if (state === "fight") {
      const remainingSeconds = Math.ceil((durationMs - lifeMs) / 1000);
      this.bossTimerText.setText("Boss: " + remainingSeconds + "s");
    }

    boss.x =
      config.holdX +
      Math.sin((lifeMs / 1000) * config.driftFrequency) * config.driftAmplitude;
    boss.y = config.holdY + Math.sin((lifeMs / 1000) * 2.2) * 14;
    boss.body.updateFromGameObject();

    if (state === "fight" && attackElapsedMs >= config.attackCadenceMs) {
      boss.setData("attackElapsedMs", 0);
      this.spawnBossVolley(boss, config);
    }

    if (state === "fight" && lifeMs >= config.durationMs) {
      boss.setData("state", "exit");
      this.bossTimerText?.setVisible(false);
      cameraShake(this, 200, 0.005);
      this.emitParticleBurst(boss.x, boss.y, 16, 350, 0.4, 0x8be9b1);
      boss.setVelocity(0, -config.exitSpeed);
      this.setStatusText("Boss wave cleared. One reward pocket before the next cycle.", 0x8be9b1);
      this.spawnPickup(config.rewardPickup);
      this.objectiveDirector.recordBossClear();
      this.recordContractEvent({ type: "bossClear" });
      this.processObjectiveRewards();
      return;
    }

    if (boss.getData("state") === "exit" && boss.y < -220) {
      if (!this.activeChallenge && !this.pendingPerkChoices && this.music?.isPlaying) {
        this.tweens.add({
          targets: this.music,
          volume: DODGE_AUDIO.musicNormalVolume,
          duration: 400,
          ease: "Power2.Out"
        });
      }
      boss.destroy();
      this.activeBoss = null;
    }
  }

  spawnBossVolley(boss, config) {
    const count = config.projectileCount;
    const boltParams = {
      family: "bolt",
      seed: (boss.y + this.runTimeMs) * 1e3,
      size: 38
    };
    const boltTexture = ensureProceduralTexture(this, boltParams) || "proc-bolt-0";

    for (let index = 0; index < count; index += 1) {
      const normalized = count === 1 ? 0 : index / (count - 1) - 0.5;
      const projectile = this.physics.add.image(
        boss.x + normalized * config.projectileSpread,
        boss.y + 66,
        boltTexture
      );
      const speedY = config.projectileSpeed;
      const targetX = this.player.x + normalized * 90;
      const travelTime = Math.max(0.7, (GAME_HEIGHT - projectile.y) / speedY);
      const speedX = (targetX - projectile.x) / travelTime;

      projectile.setTint(0xff9f43);
      projectile.setDepth(4);
      projectile.body.setAllowGravity(false);
      projectile.setImmovable(true);
      projectile.setVelocity(speedX, speedY);
      projectile.setDataEnabled();
      projectile.setData("rotationSpeed", 420);
      this.applyHitbox(projectile, {
        shape: "circle",
        radius: 12
      });
      this.projectiles.add(projectile);
    }
    this.emitParticleBurst(boss.x, boss.y + 66, 6, 240, 0.3, 0xff9f43);
  }

  clearOffscreenObjects() {
    const destroyIfOffscreen = entry => {
      if (
        entry &&
        (entry.x < -220 ||
          entry.x > GAME_WIDTH + 220 ||
          entry.y < -240 ||
          entry.y > GAME_HEIGHT + 220)
      ) {
        if (entry === this.activeBoss) {
          this.activeBoss = null;
        }

        entry.destroy();
      }
    };

    this.hazards.children.each(destroyIfOffscreen);
    this.pickups.children.each(destroyIfOffscreen);
    this.projectiles.children.each(destroyIfOffscreen);
    this.bossGroup.children.each(destroyIfOffscreen);
  }
}
