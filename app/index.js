// const DodgeGame = require("/scenes/dodgeGame");
import Phaser from "./scripts/phaser.js";
import dodgeGame from "./scenes/dodgeGame";

class MyGame extends Phaser.Scene {
  constructor() {
    super({ key: "sceneC" });
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
  scene: [dodgeGame, MyGame]
};

//Creating game
var game = new Phaser.Game(config);
