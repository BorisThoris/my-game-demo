import runningMan from "../assets/runningMan.png";
import runningMan2 from "../assets/runningMan2.png";
import flexingMan from "../assets/flexingMan.png";
import crouchingFlex from "../assets/croutching-flex.png";
import crouchingWalkLeft from "../assets/croutching-walk-left.png";
import crouchingWalkRight from "../assets/croutching-walk-right.png";
import jumpingMan from "../assets/jumpingMan.png";
import floor from "../assets/floor.png";
import background from "../assets/background.png";
import arrowRight from "../assets/arrowRight.png";
import PlayerMovement from "../help-scripts/playerMovement";

const SHARED_SPRITESHEETS = [
  { key: "mummy", asset: runningMan },
  { key: "mummy2", asset: runningMan2 },
  { key: "flex", asset: flexingMan },
  { key: "crouch-flex", asset: crouchingFlex },
  { key: "crouch-walk-left", asset: crouchingWalkLeft },
  { key: "crouch-walk-right", asset: crouchingWalkRight },
  { key: "jump", asset: jumpingMan }
];

const SHARED_ANIMATIONS = [
  { key: "walkRight", sheet: "mummy", frameRate: 10 },
  { key: "walkLeft", sheet: "mummy2", frameRate: 10 },
  { key: "flex", sheet: "flex", frameRate: 4 },
  { key: "jump", sheet: "jump", frameRate: 6 },
  { key: "crouch-flex", sheet: "crouch-flex", frameRate: 6 },
  { key: "crouch-walk-left", sheet: "crouch-walk-left", frameRate: 6 },
  { key: "crouch-walk-right", sheet: "crouch-walk-right", frameRate: 6 }
];

export default class BaseScene extends Phaser.Scene {
  constructor(key) {
    super({ key });
    this.player = null;
    this.platforms = null;
    this.cursors = null;
    this.playerMovement = null;
    this.playerHeight = 225;
  }

  preload() {
    SHARED_SPRITESHEETS.forEach(({ key, asset }) => {
      this.load.spritesheet(key, asset, {
        frameWidth: 256,
        frameHeight: 256
      });
    });

    this.load.image("ground", floor);
    this.load.image("background", background);
    this.load.image("arrow", arrowRight);
  }

  createSceneShell(playerX = 100, playerTexture = "flex") {
    this.add.tileSprite(640, 360, 1280, 720, "background");

    this.registerSharedAnimations();
    this.createPlatforms();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = this.createPlayer(playerX, playerTexture);

    return this.player;
  }

  registerSharedAnimations() {
    SHARED_ANIMATIONS.forEach(({ key, sheet, frameRate }) => {
      if (!this.anims.exists(key)) {
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers(sheet),
          frameRate,
          repeat: -1
        });
      }
    });
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    this.platforms
      .create(1280, 768, "ground")
      .setScale(2)
      .refreshBody();
  }

  createPlayer(x, texture) {
    const player = this.physics.add.sprite(x, 540, texture);
    player.setBounce(0);
    player.setCollideWorldBounds(true);
    player.setSize(100, this.playerHeight, true);

    this.physics.add.collider(player, this.platforms);

    this.playerMovement = new PlayerMovement(player);
    player.anims.play("flex", true);

    return player;
  }

  createText(x, y, text, style, originX = 0, originY = 0) {
    const label = this.add.text(x, y, text, style);
    label.setOrigin(originX, originY);
    label.setShadow(10, 10, "rgba(0,0,0,0.5)", 2);
    return label;
  }
}
