// const DodgeGame = require("/scenes/dodgeGame");
import Phaser from "./scripts/phaser.js";
import DodgeGame from "./scenes/dodgeGame";
import BegginingScene from "./scenes/beginningScene";
import introductionScene from "./scenes/introductionScene";

class MyGame extends Phaser.Scene {
  constructor() {
    super({ key: "lol" });
  }

  preload() {
    this.load.image("face", "assets/pics/bw-face.png");
  }

  create(data) {
    this.face = this.add.image(data.x, data.y, "face");
  }
}

var config = {
  type: Phaser.CANVAS,
  parent: "phaser-example",
  width: 1280,
  height: 720,
  backgroundColor: "#7d7d7d",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 700 },
      debug: true
    }
  },
  scene: [BegginingScene, DodgeGame, MyGame, introductionScene]
};

//Creating game
var game = new Phaser.Game(config);
