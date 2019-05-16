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

export default class WebsitesScene extends Phaser.Scene {
  constructor() {
    super({ key: "websitesScene" });
    //Variables
    this.player = null;
    this.platforms = null;
    this.cursors = null;
    this.music = null;
    this.arrow2 = null;
    this.playerMovementHelper = null;

    //Variables with default values
    this.score = 0;
    this.timer = 0;
    this.gameOver2 = false;
    this.jumped = false;
    this.crouched = false;
    this.controls = false;

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

    this.arrow2 = this.add.sprite(100, 380, "arrow");
    this.arrow2.setScale(0.25);
    this.arrow2.scaleX = -0.25;

    this.arrow3 = this.add.sprite(640, 580, "arrow");
    this.arrow3.setScale(0.25);
    this.arrow3.angle -= 270;
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

    var style3 = {
      font: "bold 36px Arial",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };

    let tween1 = { x: 440, y: 60 };
    let tween2 = { x: 20, y: 250 };
    let tween3 = { x: 980, y: 250 };
    let tween4 = { x: 460, y: 450 };
    let tween5 = { x: 100, y: 40 };
    let tween6 = { x: 50, y: 600 };

    this.helloText = this.add.text(
      tween1.x,
      tween1.y,
      "Choose a Website",
      style2
    );
    this.gameText = this.add.text(tween2.x, tween2.y, "Go Back", style2);
    this.webSiteText = this.add.text(
      tween3.x,
      tween3.y,
      "View Cat World",
      style2
    );
    this.BackInfo = this.add.text(
      tween4.x,
      tween4.y,
      "View Gorilla Gainz",
      style2
    );

    this.arrow = this.add.image(1160, 380, "arrow").setScale(0.25);

    this.gameText.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);
    this.webSiteText.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);
    this.helloText.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);

    this.arrow.alpha = 0;
    this.helloText.alpha = 0;
    this.arrow2.alpha = 0;
    this.gameText.alpha = 0;
    this.webSiteText.alpha = 0;
    this.BackInfo.alpha = 0;
    this.arrow3.alpha = 0;

    var timeline = this.tweens.timeline({
      ease: "Power2",
      duration: 2000,

      tweens: [
        {
          targets: [this.helloText],
          ease: "Sine.easeInOut",
          duration: 1500,
          delay: 0,
          alpha: 1,
          repeat: 0
        },
        {
          targets: [
            this.arrow,
            this.arrow2,
            this.gameText,
            this.webSiteText,
            this.BackInfo,
            this.arrow3
          ],
          ease: "Sine.easeInOut",
          duration: 3000,
          delay: 0,
          alpha: 1,
          onRepeat: () => {
            this.controls = true;
          },
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
    if (this.player.body.blocked.left) {
      this.scene.start("gameScene");
    }

    if (this.player.body.blocked.right) {
      window.open(
        "https://boristhoris.github.io/My-website-demo-Angular/viewAll"
      );

      this.cursors.right.isDown = false;
      this.player.x = 500;
    }

    //Checking if game is over
    if (this.gameOver2 === false) {
      this.timer++;
      this.crouched = false;

      if (this.cursors.down.isDown && this.controls !== false) {
        this.scene.start("introScene");
      }

      this.playerMovementHelper.playerMovment(this.cursors);
    }
  }
}
