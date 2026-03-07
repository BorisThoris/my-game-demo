import Phaser from "phaser";
import DodgeGame from "./scenes/dodgeGame";
import BeginningScene from "./scenes/beginningScene";
import IntroductionScene from "./scenes/introductionScene";
import ChoiceScene from "./scenes/choiceScene";
import WebsitesScene from "./scenes/websitesScene";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1280,
  height: 720,
  backgroundColor: "#08131d",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 700 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    BeginningScene,
    DodgeGame,
    IntroductionScene,
    ChoiceScene,
    WebsitesScene
  ]
};

export default new Phaser.Game(config);
