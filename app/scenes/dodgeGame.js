import spikeBall from "../assets/spikeball.png";
import replay from "../assets/replayBtn.png";
import powerUp from "../assets/powerUp.png";
import musicBack from "../assets/backMusic(2).mp3";
import gameOver from "../assets/gameOver.mp3";
import ooGnome from "../assets/oo.mp3";
import BaseScene from "./baseScene";

export default class DodgeGame extends BaseScene {
  constructor() {
    super("gameScene");
    this.scoreText = null;
    this.highestScore = null;
    this.spikes = null;
    this.powerUps = null;
    this.gameOverText = null;
    this.replayButton = null;
    this.music = null;
    this.gameOverMusic = null;
    this.ooGnome = null;
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
    super.createSceneShell(600, "mummy");

    this.music = this.sound.add("musicBack");
    this.music.setLoop(true);
    this.gameOverMusic = this.sound.add("gameOver");
    this.ooGnome = this.sound.add("ooGnome");
    this.music.play();
    this.events.once("shutdown", () => this.stopAudio());

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

    const score = Math.floor(this.timer / 50);
    if (this.highestScoreValue < score) {
      this.highestScoreValue = score;
      this.highestScore.setText(`Highest score: ${this.highestScoreValue}`);
    }

    this.showGameOver();
  }

  handlePowerUpCollision(tempPowerUp) {
    tempPowerUp.destroy();

    const powerUp = Math.floor(Math.random() * 6);
    this.ooGnome.play();

    if (powerUp === 1) {
      this.playerMovement.updateSpeed(-500);
    } else if (powerUp === 2) {
      this.playerMovement.updateSpeed(500);
    } else if (powerUp === 3) {
      this.playerMovement.updateSpeed(700);
    } else if (powerUp === 4) {
      this.playerMovement.updateSpeed(-700);
    } else {
      this.playerMovement.updateSpeed(1000);
    }
  }

  addSpike() {
    this.spikes
      .create(Math.random() * 1280, -100, "spike")
      .setScale(Math.random() * (1 - 0.4) + this.spikeMax);
  }

  addPowerUp() {
    this.powerUps.create(Math.random() * 1280, -100, "powerUp").setScale(0.15);
  }

  showGameOver() {
    this.gameOverText = this.add.text(
      260,
      90,
      `Game Over\nYou scored:\n${Math.floor(this.timer / 50)} points`,
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
    this.gameOverText.destroy();
    this.replayButton.destroy();
    this.spikes.clear(true, true);
    this.powerUps.clear(true, true);
    this.player.setPosition(600, 540);
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

  showReplayButton() {
    this.replayButton = this.add.sprite(640, 540, "replay");
    this.replayButton.setScale(0.2);
    this.replayButton.setInteractive();

    this.tweens.add({
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
      this.scoreText.setText(`Score: ${Math.floor(this.timer / 50)}`);

      const score = Math.floor(this.timer / 50);
      const randomNum = Math.floor(Math.random() * 10);
      const shouldSpawn =
        (score < 10 && (this.timer % 20 === 0 || this.timer === 1)) ||
        (score >= 10 && (this.timer % 10 === 0 || this.timer === 1));

      if (shouldSpawn) {
        if ((score < 10 && randomNum >= 1 && randomNum <= 4) || randomNum <= 6) {
          this.addSpike();
        } else {
          this.addPowerUp();
        }
      }

      this.playerMovement.update(this.cursors);
    } else if (this.gameOverState === "ended") {
      this.player.setVelocityX(0);
      this.player.anims.play("flex", true);
    }

    if (this.player.body.blocked.right) {
      this.stopAudio();
      this.scene.start("choiceScene");
    }

    this.clearOffscreenObjects();
  }
}
