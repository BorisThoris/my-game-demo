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

export default class BegginingScene extends Phaser.Scene {
  constructor() {
    super({ key: "introScene" });
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

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on(
      "gameobjectup",
      function(pointer, gameObject) {
        gameObject.emit("clicked", gameObject);
      },
      this
    );

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

    let tween1 = { y: 60, x: 100 };
    let tween2 = { y: 60, x: 140 };
    let tween3 = { y: 60, x: 180 };
    let tween4 = { y: 60, x: 220 };
    let tween5 = { y: 40, x: 100 };
    let tween6 = { y: 600, x: 50 };

    this.helloText = this.add.text(
      tween1.y,
      tween1.x,
      "My name is Boris.",
      style2
    );
    this.andText = this.add.text(
      tween2.y,
      tween2.x,
      "I'm a 21 y.o. Junior Software Engineer",
      style2
    );
    this.scoreText = this.add.text(
      tween3.y,
      tween3.x,
      "who grew up in the center of the capital of Bulgaria,",
      style2
    );
    this.myCv = this.add.text(
      tween4.y,
      tween4.x,
      'and was part of a "natural-mathematical class" \n in Sofia\'s 127th School, " Ivan N. Denkoglu" ',
      style2
    );
    this.Info = this.add.text(
      tween5.y,
      tween5.x,
      "While In school, I took extensive lessons in Advanced Mathematics, \n Scored 109/120 on the TOEFL, which correlates to a C2 level in English, \n and 1280/1600 on the American RSAT, \n which put me in the top 10% of students in America, \n and got me a scholarship proposal in Minnesota. \n I also got accepted in TU Sofia, and Sofia University \n but ultimately I decided that I want to study in SoftUni.....",
      style3
    );

    this.info2 = this.add.text(
      tween5.y,
      tween5.x,
      "I am currently working as a Full-Stack Junior Web Developer \n for A1 Bulgaria. \n I am skilled at JavaScript and have experience working \n with Angular 2, React.js, C# Asp.net, and MySql\n I am also good at writing HTML and CSS,\n and I have knowledge of Hibernate, GSAP, PIXI,\n Node.js and Phaser 3",
      style3
    );

    this.arrow = this.add.image(1100, 380, "arrow").setScale(0.25);

    this.helloText.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);
    this.andText.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);
    this.scoreText.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);
    this.myCv.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);
    this.Info.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);
    this.info2.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);

    this.arrow.alpha = 0;
    this.helloText.alpha = 0;
    this.andText.alpha = 0;
    this.scoreText.alpha = 0;
    this.myCv.alpha = 0;
    this.Info.alpha = 0;
    this.info2.alpha = 0;

    var timeline = this.tweens.timeline({
      ease: "Power2",
      duration: 2000,

      tweens: [
        {
          targets: this.helloText,
          ease: "Sine.easeInOut",
          duration: 1500,
          delay: 0,
          alpha: 1,
          repeat: 0
        },
        {
          targets: this.andText,
          ease: "Sine.easeInOut",
          duration: 1500,
          delay: 0,
          alpha: 1,
          repeat: 0
        },
        {
          targets: this.scoreText,
          ease: "Sine.easeInOut",
          duration: 3000,
          alpha: 1,
          repeat: 0
        },
        {
          targets: this.myCv,
          ease: "Sine.easeInOut",
          duration: 3000,
          alpha: 1,
          repeat: 0
        },
        {
          targets: [this.helloText, this.andText, this.scoreText, this.myCv],
          ease: "Sine.easeInOut",
          delay: 4000,
          duration: 3000,
          alpha: 0,
          repeat: 0,
          onComplete: () => {
            this.isStarted = true;
          }
        },
        {
          targets: this.Info,
          ease: "Sine.easeInOut",
          duration: 13000,
          alpha: 1,
          yoyo: true
        },
        {
          targets: this.info2,
          ease: "Sine.easeInOut",
          duration: 8000,
          alpha: 1,
          onComplete: () => {
            this.add.tween({
              targets: [this.arrow],
              ease: "Sine.easeInOut",
              duration: 1650,
              alpha: 1,
              yoyo: true,
              repeat: -1
            });
          }
        }
      ]
    });

    //this.scoreText.setShadow(3, 3, "rgba(0,0,0,0.5)", 2);

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
