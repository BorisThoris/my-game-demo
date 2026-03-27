import Phaser from "phaser";
import phaserJuicePlugin from "phaser3-juice-plugin";
import LoadingScene from "./scenes/loadingScene";
import MainMenuScene from "./scenes/mainMenuScene";
import OptionsScene from "./scenes/optionsScene";
import CreditsScene from "./scenes/creditsScene";
import AchievementsScene from "./scenes/achievementsScene";
import DodgeGame from "./scenes/dodgeGame";
import MetaScene from "./scenes/metaScene";
import TutorialScene from "./scenes/tutorialScene";
import EditorScene from "./scenes/editorScene";
import { SCENE_KEYS } from "./config/sceneKeys";
import { initMobileControls, isMobile } from "./input/mobileControls";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  theme
} from "./config/gameConfig";
import { GAME_VERSION } from "./config/version";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: theme.colors.semantic.background.overlay,
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
    AchievementsScene,
    TutorialScene,
    CreditsScene,
    DodgeGame,
    MetaScene,
    EditorScene
  ]
};

const game = new Phaser.Game(config);
if (import.meta.env.DEV) {
  window.__skyfallDev = { game, GAME_VERSION };
}
initMobileControls();
if (!isMobile()) document.body.classList.add("desktop-build");

// Hash routing: #/editor -> editor scene (when hash changes after load)
window.addEventListener("hashchange", () => {
  if (window.location.hash === "#/editor" && game.scene.getScene(SCENE_KEYS.editor)) {
    game.scene.start(SCENE_KEYS.editor);
  }
});
