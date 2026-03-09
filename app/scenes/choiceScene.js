import { MENU_PLAYER_X } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import { PANEL_TITLE_STYLE } from "../config/sceneStyles";
import NavigationScene from "./navigationScene";

export default class ChoiceScene extends NavigationScene {
  constructor() {
    super(SCENE_KEYS.choice);
  }

  create() {
    this.resetNavigationState();
    super.createSceneShell(MENU_PLAYER_X, "flex", false);

    this.arrowLeft = this.createArrow(100, 380, 0, true);
    this.arrowRight = this.createArrow(1160, 380);
    this.arrowDown = this.createArrow(640, 580, -270);

    this.createText(380, 60, "Welcome To The Midpoint", PANEL_TITLE_STYLE);
    this.createText(0, 250, "Go Back To Info", PANEL_TITLE_STYLE);
    this.createText(980, 250, "View Websites", PANEL_TITLE_STYLE);
    this.createText(500, 450, "Play My Game", PANEL_TITLE_STYLE);

    this.fadeInScene();
  }

  update() {
    if (this.player.body.blocked.left) {
      this.scene.start(SCENE_KEYS.intro);
      return;
    }

    if (this.controlsEnabled && this.cursors.down.isDown) {
      this.scene.start(SCENE_KEYS.game);
      return;
    }

    if (this.controlsEnabled && this.player.body.blocked.right) {
      this.scene.start(SCENE_KEYS.websites);
      return;
    }

    this.updatePlayerMovement();
  }
}
