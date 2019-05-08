import runningMan from "../assets/runningMan.png";
import runningMan2 from "../assets/runningMan2.png";
import flexingMan from "../assets/flexingMan.png";
import crouchingflex from "../assets/croutching-flex.png";
import crouchingWalkLeft from "../assets/croutching-walk-left.png";
import crouchingWalkRight from "../assets/croutching-walk-right.png";
import jumpingMan from "../assets/jumpingMan.png";
import floor from "../assets/floor.png";
import background from "../assets/background.png";
import spikeBall from "../assets/spikeball.png";
import replay from "../assets/replayBtn.png";
import powerUp from "../assets/powerUp.png";
import musicBack from "../assets/backMusic(2).mp3";
import gameOver from "../assets/gameOver.mp3";
import ooGnome from "../assets/oo.mp3";
import playerMover from "../help-scripts/playerMovement";

export default class DodgeGame extends Phaser.Scene {
  constructor() {
    super({ key: "sceneb" });
    //Variables
    this.player = null;
    this.platforms = null;
    this.cursors = null;
    this.scoreText = null;
    this.spikes = null;
    this.powerUps = null;
    this.scoreText = null;
    this.highestScore = null;
    this.gameOverText = null;
    this.replayButton = null;
    this.music = null;
    this.gameOverMusic = null;
    this.ooGnome = null;
    this.playerMovementHelper = null;

    //Variables with default values
    this.highestScoreValue = 0;
    this.score = 0;
    this.timer = 0;
    this.gameOver = false;
    this.jumped = false;
    this.crouched = false;
    this.spikeMax = 0.4;

    //this.player vars
    this.playerHeight = 225;

    //Change walking speed
    this.walkSpeed = 500;
    this.croutchSpeed = this.walkSpeed - 100;
  }

  preload() {
    this.load.spritesheet("mummy", runningMan, {
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.spritesheet("mummy2", runningMan2, {
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.spritesheet("flex", flexingMan, {
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.spritesheet("crouch-flex", crouchingflex, {
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.spritesheet("crouch-walk-left", crouchingWalkLeft, {
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.spritesheet("crouch-walk-right", crouchingWalkRight, {
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.spritesheet("jump", jumpingMan, {
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.image("ground", floor);
    this.load.image("background", background);
    this.load.image("spike", spikeBall);
    this.load.image("replay", replay);
    this.load.image("powerUp", powerUp);

    //Audio
    this.load.audio("musicBack", musicBack);
    this.load.audio("gameOver", gameOver);
    this.load.audio("ooGnome", ooGnome);
  }

  spikeCollision() {
    //On Collision with enemy
    if (this.player.body.touching.up) {
      //Stop BG this.music and play game over this.music
      this.music.pause();
      this.gameOverMusic.play();

      let score = Math.floor(this.timer / 50);
      if (
        this.highestScoreValue < score ||
        this.highestScoreValue === undefined
      ) {
        this.highestScoreValue = score;
        this.highestScore.setText(`highest score: ${this.highestScoreValue}`);
      }
      this.gameOverFunc();
    }
  }

  // Power up collision
  powerUpsCollision(player, tempPowerUp, powerUps) {
    tempPowerUp.active = false;
    tempPowerUp.destroy();

    let powerUp = Math.floor(Math.random() * 6);
    this.ooGnome.play();

    this.scene.start("lol");

    if (powerUp === 1) {
      this.walkSpeed = -500;
    } else if (powerUp === 2) {
      this.walkSpeed = 500;
    } else if (powerUp === 3) {
      this.walkSpeed = 700;
    } else if (powerUp === 4) {
      this.walkSpeed = -700;
    } else if (powerUp === 5) {
      this.walkSpeed = 1000;
    } else if (powerUp === 6) {
      this.walkSpeed = -1000;
    }

    if (this.croutchSpeed > 0) {
      this.croutchSpeed = this.walkSpeed - 200;
    } else {
      this.croutchSpeed = this.walkSpeed + 200;
    }
  }

  create() {
    this.music = this.sound.add("musicBack");
    this.gameOverMusic = this.sound.add("gameOver");
    this.ooGnome = this.sound.add("ooGnome");
    this.music.play();

    //background
    let backgroundImg = this.add.tileSprite(
      1280 / 2,
      720 / 2,
      1280,
      720,
      "background"
    );
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "62px",
      fill: "#f6ff00"
    });
    this.highestScore = this.add.text(
      900,
      16,
      `highest score: ${this.highestScoreValue}`,
      {
        fontSize: "32px",
        fill: "#f6ff00"
      }
    );

    this.spikes = this.physics.add.group({});

    this.powerUps = this.physics.add.group({});

    this.spikes.children.iterate(function(child) {
      child.body.friction.x = 5;
    });

    //  Frame debug view
    this.frameView = this.add.graphics();

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.physics.add.staticGroup();

    //floor
    this.platforms
      .create(1280, 768, "ground")
      .setScale(2)
      .refreshBody();

    //creating this.player
    this.player = this.physics.add.sprite(
      100,
      +540,
      this.playerHeight,
      "mummy"
    );

    this.playerMovementHelper = new playerMover(this.player);

    //  this.player physics properties
    this.player.setBounce(0.0);
    this.player.setCollideWorldBounds(true);

    //Collisions
    this.physics.add.collider(this.spikes, this.player, () =>
      this.spikeCollision()
    );
    this.physics.add.collider(this.spikes, this.powerUps);
    this.physics.add.collider(this.powerUps, this.powerUps);
    this.physics.add.collider(
      this.powerUps,
      this.player,
      (player, tempPowerUp) =>
        this.powerUpsCollision(player, tempPowerUp, this.powerUps)
    );
    this.physics.add.collider(this.player, this.platforms);

    this.player.setSize(100, this.playerHeight, true);

    //Creating Animations
    this.anims.create({
      key: "walkRight",
      frames: this.anims.generateFrameNumbers("mummy"),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "walkLeft",
      frames: this.anims.generateFrameNumbers("mummy2"),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "flex",
      frames: this.anims.generateFrameNumbers("flex"),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("jump"),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: "crouch-flex",
      frames: this.anims.generateFrameNumbers("crouch-flex"),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: "crouch-walk-left",
      frames: this.anims.generateFrameNumbers("crouch-walk-left"),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: "crouch-walk-right",
      frames: this.anims.generateFrameNumbers("crouch-walk-right"),
      frameRate: 6,
      repeat: -1
    });

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on(
      "gameobjectup",
      function(pointer, gameObject) {
        gameObject.emit("clicked", gameObject);
      },
      this
    );
  }

  updateFrameView() {}

  addSpike() {
    this.spikes
      .create(Math.random() * 1280, -100, "spike")
      .setScale(Math.random() * (1 - 0.4) + this.spikeMax);
  }

  addPowerUp() {
    this.powerUps.create(Math.random() * 1280, -100, "powerUp").setScale(0.15);
  }

  gameOverFunc() {
    this.gameOverText = this.add.text(
      260,
      360 / 4,
      `\n Game Over \n You scored: \n ${Math.floor(this.timer / 50)} points`,
      { fontSize: "100px", fill: "#FF0000" }
    );
    this.gameOver = "Ended";

    this.replayButtonFunc();
  }

  clearMemo() {
    if (this.gameOver !== "Ended") {
      let spikes = this.spikes.children.entries;
      let spikesLength = this.spikes.children.entries.length - 1;
      let powerUps = this.powerUps.children.entries;
      let powerUpsLength = this.powerUps.children.entries.length - 1;

      if (spikes[0] !== undefined && spikes[0].y > 1000) {
        spikes[0].destroy();
      }

      if (powerUps[0] !== undefined && powerUps[0].y > 1000) {
        powerUps[0].destroy();
      }
    }
  }

  resetVars() {
    this.timer = 0;
    this.walkSpeed = 500;
    this.croutchSpeed = this.walkSpeed - 100;
    this.spikeMax = 0.4;
    this.gameOver = false;
    this.replayButton.destroy();
    this.music.play();
  }

  replayButtonFunc() {
    this.replayButton = this.add.sprite(1280 / 2, 540, "replay");
    this.add.tween({
      targets: this.replayButton,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 0,
      alpha: 0,
      repeat: -1
    });

    this.replayButton.opacity = 0;
    this.replayButton.setScale(0.2);
    this.replayButton.setInteractive();
    this.spikes.children.entries = [];
    this.replayButton.on("clicked", () => {
      this.gameOverText.destroy(), this.resetVars();
    });
  }

  //Movement
  update() {
    //Checking if game is over
    if (this.gameOver === false) {
      this.timer++;
      this.crouched = false;
      this.scoreText.setText("Score: " + Math.floor(this.timer / 50));

      let score = Math.floor(this.timer / 50);

      //Checking phase
      let randomNum = Math.floor(Math.random() * 10);
      if (score < 10) {
        if (this.timer % 20 === 0 || this.timer === 1) {
          if (randomNum >= 1 && randomNum <= 4) {
            this.addSpike();
          } else {
            this.addPowerUp();
          }
        }
      }

      //Checking phase
      else if (score >= 10) {
        if (this.timer % 10 === 0 || this.timer === 1) {
          if (randomNum >= 1 && randomNum <= 6) {
            this.addSpike();
          } else {
            this.addPowerUp();
          }
        }
      }

      //Preventing memory leaks

      this.crouched = false;

      this.playerMovementHelper.playerMovment(this.cursors);
    } else if (this.gameOver == "Ended") {
      this.player.setVelocityX(0);
      this.player.anims.play("flex", true);
    }

    this.clearMemo();
  }
}
