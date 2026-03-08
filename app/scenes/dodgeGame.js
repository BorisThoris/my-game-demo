import replay from "../assets/replayBtn.png";
import powerUp from "../assets/powerUp.png";
import musicBack from "../assets/backMusic(2).mp3";
import gameOver from "../assets/gameOver.mp3";
import ooGnome from "../assets/oo.mp3";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import BaseScene from "./baseScene";
import RunnerSpawnDirector from "../game/runnerSpawnDirector";
import { EXIT_UNLOCK_SCORE } from "../game/runnerContent";
import ChallengeDirector from "../game/challengeDirector";
import {
  applyPerk,
  buildPerkChoices,
  createBaseModifiers
} from "../game/perkSystem";
import ObjectiveDirector from "../game/objectiveDirector";

const SCORE_TICK_MS = 1000;
const PLAYER_SPEED = 430;
const PLAYER_START_X = GAME_WIDTH / 2;
const PLAYER_START_Y = GAME_HEIGHT - 130;

const STATUS_TEXT_STYLE = {
  font: "700 24px Arial",
  fill: "#d7f9ff",
  align: "center"
};

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
  }

  preload() {
    super.preload();
    this.load.image("replay", replay);
    this.load.image("powerUp", powerUp);
    this.load.audio("musicBack", musicBack);
    this.load.audio("gameOver", gameOver);
    this.load.audio("ooGnome", ooGnome);
  }

  create() {
    super.createSceneShell(PLAYER_START_X, "mummy");
    this.input.keyboard.resetKeys();
    this.platforms.clear(true, true);
    this.player.body.setAllowGravity(false);
    this.player.setPosition(PLAYER_START_X, PLAYER_START_Y);
    this.player.setDepth(4);

    this.movementKeys = this.input.keyboard.addKeys("W,A,S,D");
    this.createRuntimeTextures();
    this.createHud();
    this.createChallengeUi();
    this.createAudio();
    this.createGroups();
    this.createCollisions();
    this.resetRun();

    this.events.once("shutdown", () => this.stopAudio());
  }

  createRuntimeTextures() {
    if (this.textures.exists("runner-orb")) {
      return;
    }

    const drawTexture = (key, width, height, drawFn) => {
      const graphics = this.make.graphics({ x: 0, y: 0, add: false });
      drawFn(graphics, width, height);
      graphics.generateTexture(key, width, height);
      graphics.destroy();
    };

    drawTexture("runner-orb", 96, 96, graphics => {
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(48, 48, 40);
      graphics.fillStyle(0x99a7c2, 0.75);
      graphics.fillCircle(48, 48, 22);
      graphics.lineStyle(6, 0xffffff, 0.55);
      graphics.strokeCircle(48, 48, 33);
    });

    drawTexture("runner-wedge", 132, 96, graphics => {
      graphics.fillStyle(0xffffff, 1);
      graphics.fillTriangle(8, 92, 66, 10, 124, 92);
      graphics.fillStyle(0xffffff, 0.38);
      graphics.fillTriangle(30, 88, 66, 28, 100, 88);
    });

    drawTexture("runner-beam", 188, 40, graphics => {
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRoundedRect(0, 4, 188, 32, 14);
      graphics.fillStyle(0xffffff, 0.35);
      graphics.fillRoundedRect(18, 10, 152, 8, 6);
    });

    drawTexture("runner-diamond", 96, 96, graphics => {
      const points = [
        { x: 48, y: 4 },
        { x: 92, y: 48 },
        { x: 48, y: 92 },
        { x: 4, y: 48 }
      ];

      graphics.fillStyle(0xffffff, 1);
      graphics.fillPoints(points, true);
      graphics.fillStyle(0xffffff, 0.4);
      graphics.fillPoints(
        [
          { x: 48, y: 18 },
          { x: 78, y: 48 },
          { x: 48, y: 78 },
          { x: 18, y: 48 }
        ],
        true
      );
    });

    drawTexture("runner-gate", 112, 112, graphics => {
      const points = [
        { x: 56, y: 0 },
        { x: 98, y: 18 },
        { x: 112, y: 56 },
        { x: 98, y: 94 },
        { x: 56, y: 112 },
        { x: 14, y: 94 },
        { x: 0, y: 56 },
        { x: 14, y: 18 }
      ];

      graphics.fillStyle(0xffffff, 0.95);
      graphics.fillPoints(points, true);
      graphics.fillStyle(0x080f18, 1);
      graphics.fillCircle(56, 56, 18);
    });

    drawTexture("runner-boss", 180, 180, graphics => {
      const points = [
        { x: 90, y: 6 },
        { x: 152, y: 28 },
        { x: 174, y: 90 },
        { x: 152, y: 152 },
        { x: 90, y: 174 },
        { x: 28, y: 152 },
        { x: 6, y: 90 },
        { x: 28, y: 28 }
      ];

      graphics.fillStyle(0xffffff, 1);
      graphics.fillPoints(points, true);
      graphics.fillStyle(0xfff2f2, 0.3);
      graphics.fillCircle(90, 90, 44);
      graphics.fillStyle(0x080f18, 1);
      graphics.fillCircle(90, 90, 18);
    });

    drawTexture("runner-bolt", 38, 38, graphics => {
      const points = [
        { x: 19, y: 0 },
        { x: 38, y: 19 },
        { x: 19, y: 38 },
        { x: 0, y: 19 }
      ];

      graphics.fillStyle(0xffffff, 1);
      graphics.fillPoints(points, true);
    });
  }

  createAudio() {
    this.music = this.sound.add("musicBack");
    this.music.setLoop(true);
    this.gameOverMusic = this.sound.add("gameOver");
    this.ooGnome = this.sound.add("ooGnome");
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
    this.scoreText = this.add.text(24, 18, "Score: 0", {
      fontSize: "44px",
      fill: "#fff2b5"
    });
    this.highestScore = this.add.text(24, 72, "Best: 0", {
      fontSize: "24px",
      fill: "#d7f9ff"
    });
    this.phaseText = this.add.text(912, 24, "Phase: Recovery", {
      fontSize: "32px",
      fill: "#55d6ff"
    });
    this.shieldText = this.add.text(912, 66, "Shields: 0/3", {
      fontSize: "24px",
      fill: "#ffffff"
    });
    this.statusText = this.add.text(
      GAME_WIDTH / 2,
      88,
      "Recovery phases widen the rain. Heat phases compress the fall lanes.",
      STATUS_TEXT_STYLE
    );
    this.statusText.setOrigin(0.5, 0.5);

    this.phaseBarTrack = this.add
      .rectangle(912, 116, 320, 18, 0x0d1823, 0.95)
      .setOrigin(0, 0.5);
    this.phaseBarFill = this.add
      .rectangle(912, 116, 6, 12, 0x55d6ff, 1)
      .setOrigin(0, 0.5);

    this.exitText = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 38,
      "",
      STATUS_TEXT_STYLE
    );
    this.exitText.setOrigin(0.5, 0.5);

    this.objectiveText = this.add.text(24, 108, "Objectives", {
      fontSize: "20px",
      fill: "#a6d9ff",
      align: "left"
    });
  }

  resetRun() {
    this.stopAudio();
    this.physics.resume();
    this.input.keyboard.resetKeys();
    this.spawnDirector.reset();
    this.clearGameOverUi();
    this.clearGroups();

    this.runTimeMs = 0;
    this.bonusScore = 0;
    this.currentFallSpeed = 260;
    this.backgroundSpeed = 14;
    this.shieldCharges = 1;
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
    this.renderObjectives();

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
    this.setStatusText(
      "Recovery phases widen the rain. Heat phases compress the fall lanes.",
      0xd7f9ff
    );
    this.exitText.setText("");

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

    if (this.gameOverText) {
      this.gameOverText.destroy();
      this.gameOverText = null;
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

  handlePickupCollision(pickup) {
    if (this.gameOverState) {
      return;
    }

    pickup.destroy();
    this.ooGnome.play();

    if (this.shieldCharges < this.runModifiers.maxShields) {
      this.shieldCharges += 1;
    } else {
      this.bonusScore += 3;
      this.setStatusText("Shield bank full. Pickup converted into bonus score.", 0xfff2b5);
    }

    this.objectiveDirector.recordPickup();
    this.processObjectiveRewards();

    this.tweens.add({
      targets: this.player,
      scaleX: this.player.scaleX * 1.04,
      scaleY: this.player.scaleY * 1.04,
      duration: 80,
      yoyo: true
    });
  }

  handleHazardHit(source) {
    if (this.gameOverState || this.damageRecoveryMs > 0) {
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

    this.cameras.main.shake(150, 0.004);
    this.setStatusText("Shield popped. Short invulnerability window active.", 0xffd166);

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
    this.physics.pause();

    const score = this.getScore();
    if (score > this.highestScoreValue) {
      this.highestScoreValue = score;
    }

    this.highestScore.setText(`Best: ${this.highestScoreValue}`);
    this.gameOverState = "ended";
    this.player.setVelocity(0, 0);
    this.player.anims.play("flex", true);

    this.showGameOver();
  }

  showGameOver() {
    this.gameOverText = this.add.text(
      GAME_WIDTH / 2,
      170,
      `Skyfall Ended\nScore: ${this.getScore()}\nBest: ${this.highestScoreValue}`,
      {
        fontSize: "80px",
        fill: "#ff8072",
        align: "center"
      }
    );
    this.gameOverText.setOrigin(0.5, 0);
    this.showReplayButton();
  }

  showReplayButton() {
    this.replayButton = this.add.sprite(GAME_WIDTH / 2, 540, "replay");
    this.replayButton.setScale(0.2);
    this.replayButton.setInteractive();

    this.replayTween = this.tweens.add({
      targets: this.replayButton,
      ease: "Sine.easeInOut",
      duration: 2000,
      alpha: 0.18,
      repeat: -1,
      yoyo: true
    });

    this.replayButton.on("pointerup", () => this.resetRun());
  }

  update(_, delta) {
    if (this.gameOverState === false) {
      if (this.activeChallenge || this.pendingPerkChoices) {
        this.updateChallengeState(delta);
        this.updateHud(this.spawnDirector.getContext(this.getScore()));
        return;
      }

      this.runTimeMs += delta;
      this.damageRecoveryMs = Math.max(0, this.damageRecoveryMs - delta);
      this.objectiveDirector.recordSurvival(delta);

      const score = this.getScore();
      const { events, context } = this.spawnDirector.update(
        delta,
        score,
        Boolean(this.activeBoss)
      );

      this.currentFallSpeed = context.fallSpeed;
      this.backgroundSpeed = context.backgroundSpeed;
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

      if (this.exitUnlocked && this.player.body.blocked.right) {
        this.stopAudio();
        this.scene.start(SCENE_KEYS.choice);
        return;
      }
    } else if (this.gameOverState === "ended") {
      this.player.setVelocity(0, 0);
      this.player.anims.play("flex", true);
    }

    this.clearOffscreenObjects();
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
      const liveSpeed = PLAYER_SPEED * this.runModifiers.moveSpeedMultiplier;
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
  }

  setStatusText(message, color = 0xd7f9ff) {
    this.statusText.setText(message);
    this.statusText.setColor(`#${color.toString(16).padStart(6, "0")}`);
  }

  updateHud(context) {
    const score = this.getScore();
    this.scoreText.setText(`Score: ${score}`);
    this.highestScore.setText(`Best: ${this.highestScoreValue}`);
    this.phaseText.setText(`Phase: ${context.phaseLabel}`);
    this.phaseText.setColor(`#${context.phaseColor.toString(16).padStart(6, "0")}`);
    this.shieldText.setText(`Shields: ${this.shieldCharges}/${this.runModifiers.maxShields}`);
    this.phaseBarFill.width = Math.max(6, 320 * context.phaseProgress);
    this.phaseBarFill.fillColor = context.phaseColor;
  }

  createChallengeUi() {
    this.challengeInputKeys = this.input.keyboard.addKeys("ONE,TWO,THREE");
    const panelBg = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 740, 330, 0x08131d, 0.95)
      .setStrokeStyle(3, 0x55d6ff, 0.9);
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
      return optionText;
    });

    this.challengePanel = this.add.container(0, 0, [
      panelBg,
      this.challengeText,
      this.challengeTimerText,
      ...this.challengeOptionTexts
    ]);
    this.challengePanel.setDepth(15);
    this.challengePanel.setVisible(false);
  }

  maybeStartChallenge(score, intensity) {
    const challenge = this.challengeDirector.maybeCreateChallenge(score, intensity);
    if (!challenge) {
      return;
    }

    this.activeChallenge = challenge;
    this.challengeRemainingMs = challenge.durationMs;
    this.challengePanel.setVisible(true);
    this.challengeText.setText(`${challenge.title}\n${challenge.prompt}`);
    this.challengeOptionTexts.forEach((entry, index) => {
      entry.setText(`${index + 1}. ${challenge.options[index]}`);
    });
    this.physics.pause();
    this.setStatusText("Challenge break: answer before the timer expires.", 0x55d6ff);
  }

  updateChallengeState(delta) {
    if (this.pendingPerkChoices) {
      this.captureOptionInput(this.pendingPerkChoices, chosenPerk => {
        this.runModifiers = applyPerk(this.runModifiers, chosenPerk.id);
        this.ownedPerks.push(chosenPerk.id);
        this.pendingPerkChoices = null;
        this.challengePanel.setVisible(false);
        this.physics.resume();
        this.setStatusText(`Perk online: ${chosenPerk.title}.`, 0x8be9b1);
      });
      return;
    }

    if (!this.activeChallenge) {
      return;
    }

    this.challengeRemainingMs = Math.max(0, this.challengeRemainingMs - delta);
    const secondsLeft = (this.challengeRemainingMs / 1000).toFixed(1);
    this.challengeTimerText.setText(`Timer: ${secondsLeft}s (press 1 / 2 / 3)`);

    if (this.challengeRemainingMs <= 0) {
      this.resolveChallenge(-1);
      return;
    }

    this.captureOptionInput(this.activeChallenge.options, (_, index) => {
      this.resolveChallenge(index);
    });
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
    const result = this.challengeDirector.evaluate(
      this.activeChallenge,
      selectedIndex,
      this.challengeRemainingMs
    );

    this.challengePanel.setVisible(false);
    this.activeChallenge = null;

    if (!result.success) {
      this.shieldCharges = Math.max(0, this.shieldCharges - (result.reward.shieldPenalty ?? 0));
      this.physics.resume();
      this.setStatusText(result.message, 0xff8072);
      return;
    }

    const challengeScore = Math.round(
      result.reward.scoreBonus * this.runModifiers.challengeScoreMultiplier
    );
    this.bonusScore += challengeScore;
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
        this.challengePanel.setVisible(true);
        this.challengeText.setText("Pick a perk");
        this.challengeTimerText.setText("Press 1 / 2 / 3");
        this.challengeOptionTexts.forEach((entry, index) => {
          const perk = perkChoices[index];
          entry.setText(perk ? `${index + 1}. ${perk.title} — ${perk.description}` : "");
        });
        return;
      }
    }

    this.physics.resume();
  }


  processObjectiveRewards() {
    const completed = this.objectiveDirector.consumeCompletedRewards();
    if (completed.length === 0) {
      this.renderObjectives();
      return;
    }

    completed.forEach(objective => {
      this.bonusScore += objective.reward.scoreBonus;
      this.shieldCharges = Math.min(
        this.runModifiers.maxShields,
        this.shieldCharges + objective.reward.shieldBonus
      );
      this.perkPoints += objective.reward.perkPoint;
      this.setStatusText(`Objective complete: ${objective.title}`, 0x8be9b1);
    });

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
    const hazard = this.physics.add.image(descriptor.x, descriptor.y, descriptor.texture);
    hazard.setScale(descriptor.scaleX ?? 1, descriptor.scaleY ?? 1);
    hazard.setDepth(4);
    hazard.setTint(descriptor.tint ?? 0xffffff);
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
  }

  spawnPickup(descriptor) {
    const pickup = this.physics.add.image(descriptor.x, descriptor.y, descriptor.texture);
    pickup.setScale(descriptor.scaleX ?? 1, descriptor.scaleY ?? 1);
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
    this.pickups.add(pickup);
  }

  spawnMiniBoss(descriptor) {
    if (this.activeBoss) {
      return;
    }

    const boss = this.physics.add.image(descriptor.x, descriptor.y, descriptor.texture);
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

    this.setStatusText(`${descriptor.name} inbound. Dodge the storm pattern.`, 0xff8072);
    this.cameras.main.flash(180, 255, 110, 110, false);
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
      return;
    }

    const boss = this.activeBoss;
    const config = boss.getData("config");
    const state = boss.getData("state");
    const rotationSpeed = boss.getData("rotationSpeed");

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
      boss.setVelocity(0, -config.exitSpeed);
      this.setStatusText("Boss wave cleared. One reward pocket before the next cycle.", 0x8be9b1);
      this.spawnPickup(config.rewardPickup);
      this.objectiveDirector.recordBossClear();
      this.processObjectiveRewards();
      return;
    }

    if (boss.getData("state") === "exit" && boss.y < -220) {
      boss.destroy();
      this.activeBoss = null;
    }
  }

  spawnBossVolley(boss, config) {
    const count = config.projectileCount;

    for (let index = 0; index < count; index += 1) {
      const normalized = count === 1 ? 0 : index / (count - 1) - 0.5;
      const projectile = this.physics.add.image(
        boss.x + normalized * config.projectileSpread,
        boss.y + 66,
        "runner-bolt"
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
