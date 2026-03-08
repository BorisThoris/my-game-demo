import spikeBall from "../assets/spikeball.png";
import replay from "../assets/replayBtn.png";
import powerUp from "../assets/powerUp.png";
import musicBack from "../assets/backMusic(2).mp3";
import gameOver from "../assets/gameOver.mp3";
import ooGnome from "../assets/oo.mp3";
import {
  GAME_WIDTH,
  MENU_PLAYER_X,
  PLAYER_START_Y
} from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import BaseScene from "./baseScene";

const SCORE_TICK_RATE = 50;
const EARLY_GAME_THRESHOLD = 10;
const EARLY_SPAWN_INTERVAL = 20;
const LATE_SPAWN_INTERVAL = 10;
const SPIKE_SPAWN_CHANCE = {
  earlyMin: 1,
  earlyMax: 4,
  standardMax: 6
};
const POWER_UP_SPEEDS = [-500, 500, 700, -700, 1000];

export default class DodgeGame extends BaseScene {
  constructor() {
    super(SCENE_KEYS.game);
    this.scoreText = null;
    this.highestScore = null;
    this.spikes = null;
    this.powerUps = null;
    this.gameOverText = null;
    this.replayButton = null;
    this.music = null;
    this.gameOverMusic = null;
    this.ooGnome = null;
    this.replayTween = null;
    this.highestScoreValue = 0;
    this.timer = 0;
    this.gameOverState = false;
    this.spikeMax = 0.4;
  }

  preload() {
    super.preload();
    this.load.image("spike", spikeBall);
    this.load.image("replay", replay);
    this.load.image("powerUp", powerUp);
    this.load.audio("musicBack", musicBack);
    this.load.audio("gameOver", gameOver);
    this.load.audio("ooGnome", ooGnome);
  }

  create() {
    super.createSceneShell(MENU_PLAYER_X, "mummy");

    this.music = this.sound.add("musicBack");
    this.music.setLoop(true);
    this.gameOverMusic = this.sound.add("gameOver");
    this.ooGnome = this.sound.add("ooGnome");
    this.music.play();
    this.events.once("shutdown", () => this.stopAudio());
    this.clearGameOverUi();

    this.createHud();

    this.spikes = this.physics.add.group();
    this.powerUps = this.physics.add.group();

    this.physics.add.collider(this.spikes, this.player, () =>
      this.handleSpikeCollision()
    );
    this.physics.add.collider(this.spikes, this.powerUps);
    this.physics.add.collider(this.powerUps, this.powerUps);
    this.physics.add.collider(this.powerUps, this.player, (_, tempPowerUp) =>
      this.handlePowerUpCollision(tempPowerUp)
    );
  }

  handleSpikeCollision() {
    if (this.gameOverState || !this.player.body.touching.up) {
      return;
    }

    this.stopAudio();
    this.gameOverMusic.play();

    const score = this.getScore();
    if (this.highestScoreValue < score) {
      this.highestScoreValue = score;
      this.highestScore.setText(`Highest score: ${this.highestScoreValue}`);
    }

    this.showGameOver();
  }

  handlePowerUpCollision(tempPowerUp) {
    tempPowerUp.destroy();

    this.ooGnome.play();
    const powerUpIndex = Math.floor(Math.random() * POWER_UP_SPEEDS.length);
    this.playerMovement.updateSpeed(POWER_UP_SPEEDS[powerUpIndex]);
  }

  addSpike() {
    this.spikes
      .create(Math.random() * GAME_WIDTH, -100, "spike")
      .setScale(Math.random() * (1 - 0.4) + this.spikeMax);
  }

  addPowerUp() {
    this.powerUps.create(Math.random() * GAME_WIDTH, -100, "powerUp").setScale(0.15);
  }

  createHud() {
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "62px",
      fill: "#f6ff00"
    });

    this.highestScore = this.add.text(
      900,
      16,
      `Highest score: ${this.highestScoreValue}`,
      {
        fontSize: "32px",
        fill: "#f6ff00"
      }
    );
  }

  getScore() {
    return Math.floor(this.timer / SCORE_TICK_RATE);
  }

  showGameOver() {
    this.gameOverText = this.add.text(
      260,
      90,
      `Game Over\nYou scored:\n${this.getScore()} points`,
      { fontSize: "100px", fill: "#ff0000", align: "center" }
    );
    this.gameOverState = "ended";
    this.showReplayButton();
  }

  clearOffscreenObjects() {
    if (this.gameOverState === "ended") {
      return;
    }

    this.spikes.children.each(spike => {
      if (spike.y > 1000) {
        spike.destroy();
      }
    });

    this.powerUps.children.each(powerUp => {
      if (powerUp.y > 1000) {
        powerUp.destroy();
      }
    });
  }

  resetRun() {
    this.timer = 0;
    this.spikeMax = 0.4;
    this.gameOverState = false;
    this.stopAudio();
    this.clearGameOverUi();
    this.spikes.clear(true, true);
    this.powerUps.clear(true, true);
    this.player.setPosition(MENU_PLAYER_X, PLAYER_START_Y);
    this.playerMovement.reset();
    this.scoreText.setText("Score: 0");
    this.highestScore.setText(`Highest score: ${this.highestScoreValue}`);
    this.music.play();
  }

  stopAudio() {
    [this.music, this.gameOverMusic, this.ooGnome].forEach(sound => {
      if (sound?.isPlaying) {
        sound.stop();
      }
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

  showReplayButton() {
    this.replayButton = this.add.sprite(640, 540, "replay");
    this.replayButton.setScale(0.2);
    this.replayButton.setInteractive();

    this.replayTween = this.tweens.add({
      targets: this.replayButton,
      ease: "Sine.easeInOut",
      duration: 2000,
      alpha: 0.15,
      repeat: -1,
      yoyo: true
    });

    this.replayButton.on("pointerup", () => this.resetRun());
  }

  update() {
    if (this.gameOverState === false) {
      this.timer += 1;
      const score = this.getScore();
      this.scoreText.setText(`Score: ${score}`);

      this.spawnFallingObject(score);

      this.updatePlayerMovement();
    } else if (this.gameOverState === "ended") {
      this.player.setVelocityX(0);
      this.player.anims.play("flex", true);
    }

    if (this.player.body.blocked.right) {
      this.stopAudio();
      this.scene.start(SCENE_KEYS.choice);
      return;
    }

    this.clearOffscreenObjects();
  }

  spawnFallingObject(score) {
    const randomNum = Math.floor(Math.random() * 10);
    const isEarlyGame = score < EARLY_GAME_THRESHOLD;
    const spawnInterval = isEarlyGame ? EARLY_SPAWN_INTERVAL : LATE_SPAWN_INTERVAL;
    const shouldSpawn = this.timer % spawnInterval === 0 || this.timer === 1;

    if (!shouldSpawn) {
      return;
    }

    const shouldAddSpike = isEarlyGame
      ? randomNum >= SPIKE_SPAWN_CHANCE.earlyMin &&
        randomNum <= SPIKE_SPAWN_CHANCE.earlyMax
      : randomNum <= SPIKE_SPAWN_CHANCE.standardMax;

    if (shouldAddSpike) {
      this.addSpike();
      return;
    }

    this.addPowerUp();
  }
}
