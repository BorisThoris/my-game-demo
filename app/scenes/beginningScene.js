import runningMan from "../assets/runningMan.png";
import runningMan2 from "../assets/runningMan2.png";
import flexingMan from "../assets/flexingMan.png";
import crouchingflex from "../assets/croutching-flex.png";
import crouchingWalkLeft from "../assets/croutching-walk-left.png";
import crouchingWalkRight from "../assets/croutching-walk-right.png";
import jumpingMan from "../assets/jumpingMan.png";
import floor from "../assets/floor.png";
import background from "../assets/background.png";
import musicBack from "../assets/backMusic(2).mp3";
import gameOver from "../assets/gameOver.mp3";
import ooGnome from "../assets/oo.mp3";
import playerMover from "../help-scripts/playerMovement";
import arrowRight from "../assets/arrowRight.png";
import background2 from "../assets/background2.png";

export default class BegginingScene extends Phaser.Scene {
  constructor() {
    super({ key: "begginingScene" });
    //Variables
    this.player = null;
    this.platforms = null;
    this.cursors = null;
    this.music = null;
    this.playerMovementHelper = null;

    //Variables with default values
    this.isStarted = false;
    this.score = 0;
    this.counter = 0;
    this.timer = 0;
    this.gameOver2 = false;
    this.jumped = false;
    this.crouched = false;

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
    this.load.image("arrow", arrowRight);

    //Audio
    this.load.audio("musicBack", musicBack);
  }

  create() {
    this.music = this.sound.add("musicBack");
    this.music.play();

    //background
    let backgroundImg = this.add.tileSprite(
      1280 / 2,
      720 / 2,
      1280,
      720,
      "background"
    );

    //  Frame debug view
    this.frameView = this.add.graphics();

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.physics.add.staticGroup();

    //floor
    this.platforms
      .create(1280, 768, "ground")
      .setScale(2)
      .refreshBody();

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

    var style = {
      font: "bold 32px Arial",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };

    var style2 = {
      font: "bold 40px Arial",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };

    this.helloText = this.add.text(200, 200, "Hello", style2);
    this.andText = this.add.text(200, 240, "And Welcome", style2);
    this.scoreText = this.add.text(200, 280, "To", style2);
    this.myCv = this.add.text(200, 320, "My Cv", style2);

    this.controlsText = this.add.text(
      150,
      100,
      "You Can Now Use Your Arrow Keys To Move Around",
      style2
    );

    this.arrow = this.add.image(1100, 380, "arrow").setScale(0.25);

    this.helloText.alpha = 0;
    this.scoreText.alpha = 0;
    this.andText.alpha = 0;
    this.myCv.alpha = 0;
    this.controlsText.alpha = 0;

    this.helloText.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);
    this.scoreText.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);
    this.andText.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);
    this.myCv.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);
    this.controlsText.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);

    this.arrow.alpha = 0;

    var timeline = this.tweens.timeline({
      ease: "Power2",
      duration: 2000,

      tweens: [
        {
          targets: this.helloText,
          ease: "Sine.easeInOut",
          duration: 1000,
          delay: 0,
          alpha: 1,
          repeat: 0
        },
        {
          targets: this.andText,
          ease: "Sine.easeInOut",
          duration: 1000,
          delay: 0,
          alpha: 1,
          repeat: 0
        },
        {
          targets: this.scoreText,
          ease: "Sine.easeInOut",
          duration: 1000,
          alpha: 1,
          repeat: 0
        },
        {
          targets: this.myCv,
          ease: "Sine.easeInOut",
          duration: 1000,
          alpha: 1,
          repeat: 0
        },
        {
          targets: [this.helloText, this.andText, this.scoreText, this.myCv],
          ease: "Sine.easeInOut",
          delay: 1000,
          duration: 1000,
          alpha: 0,
          repeat: 0,
          onComplete: () => {
            this.isStarted = true;
          }
        },
        {
          targets: this.controlsText,
          ease: "Sine.easeInOut",
          duration: 1650,
          alpha: 1,

          onComplete: () => {
            this.add.tween({
              targets: [this.arrow],
              ease: "Sine.easeInOut",
              duration: 1650,
              alpha: 1,
              yoyo: true
            });
          }
        },
        {
          targets: [this.arrow],
          ease: "Sine.easeInOut",
          duration: 1650,
          alpha: 1,
          repeat: -1,
          yoyo: true
        }
      ]
    });

    //this.scoreText.setShadow(3, 3, "rgba(0,0,0,0.5)", 2);

    //creating this.player
    this.player = this.physics.add.sprite(600, +540, this.playerHeight, "flex");
    this.playerMovementHelper = new playerMover(this.player);

    //  this.player physics properties
    this.player.setBounce(0.0);
    this.player.setCollideWorldBounds(true);

    //Collisions And Player Setup
    this.physics.add.collider(this.player, this.platforms);

    this.player.setSize(100, this.playerHeight, true);
    this.playerMovementHelper.playerMovment(this.cursors);
    this.player.anims.play("flex", true);
  }

  updateFrameView() {}

  //Movement
  update() {
    if (this.counter === 0) {
      this.player.anims.play("flex", true);
      this.player.setSize(100, this.playerHeight, true);
      this.counter++;
    }

    if (this.player.body.blocked.right) {
      this.scene.start("introScene");
    }

    //Checking if game is over
    if (this.gameOver2 === false && this.isStarted === true) {
      this.timer++;
      this.crouched = false;

      this.playerMovementHelper.playerMovment(this.cursors);
    }
  }
}
