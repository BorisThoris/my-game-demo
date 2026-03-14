import Phaser from "phaser";
import phaserJuicePlugin from "phaser3-juice-plugin";
import LoadingScene from "./scenes/loadingScene";
import MainMenuScene from "./scenes/mainMenuScene";
import OptionsScene from "./scenes/optionsScene";
import CreditsScene from "./scenes/creditsScene";
import DodgeGame from "./scenes/dodgeGame";
import { initMobileControls } from "./input/mobileControls";
import {
  GAME_HEIGHT,
  GAME_WIDTH
} from "./config/gameConfig";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#08131d",
  fps: {
    limit: 60,
    min: 30
  },
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
  plugins: {
    scene: [
      { key: "phaserJuice", plugin: phaserJuicePlugin, mapping: "juice" }
    ]
  },
  scene: [
    LoadingScene,
    MainMenuScene,
    OptionsScene,
    CreditsScene,
    DodgeGame
  ]
};

const game = new Phaser.Game(config);
initMobileControls();
