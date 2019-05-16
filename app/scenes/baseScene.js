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

export default class baseScene extends Phaser.Scene {
  constructor() {
    super({ key: "baseScene" });
    //Variables
    this.player = null;
    this.platforms = null;
    this.cursors = null;
    this.music = null;

    this.playerMovementHelper = null;
    //Variables with default values
    this.isStarted = false;
    this.score = 0;
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
  }

  create() {
    //background
    let backgroundImg = this.add.tileSprite(
      1280 / 2,
      720 / 2,
      1280,
      720,
      "background"
    );

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

    //  Frame debug view
    this.frameView = this.add.graphics();

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.physics.add.staticGroup();

    //floor
    this.platforms
      .create(1280, 768, "ground")
      .setScale(2)
      .refreshBody();

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on(
      "gameobjectup",
      function(pointer, gameObject) {
        gameObject.emit("clicked", gameObject);
      },
      this
    );

    //creating this.player
    this.player = this.physics.add.sprite(100, +540, this.playerHeight, "flex");
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
    if (this.player.body.blocked.right) {
      this.scene.start("choiceScene");
    }

    //Checking if game is over
    if (this.gameOver2 === false) {
      this.timer++;
      this.crouched = false;

      this.playerMovementHelper.playerMovment(this.cursors);
    }
  }
}
