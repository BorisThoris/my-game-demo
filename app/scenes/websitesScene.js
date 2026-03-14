import { GAME_CENTER_X, MENU_PLAYER_X } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import { PANEL_TITLE_STYLE } from "../config/sceneStyles";
import { WEBSITE_LINKS } from "../config/websites";
import { openExternalLink } from "../shared/browser";
import NavigationScene from "./navigationScene";

export default class WebsitesScene extends NavigationScene {
  constructor() {
    super(SCENE_KEYS.websites);
    this.externalLaunchInProgress = false;
  }

  create() {
    this.resetNavigationState();
    this.externalLaunchInProgress = false;
    super.createSceneShell(MENU_PLAYER_X, "flex", false);

    this.arrowLeft = this.createArrow(100, 380, 0, true);
    this.arrowRight = this.createArrow(1160, 380);
    this.arrowDown = this.createArrow(GAME_CENTER_X, 580, -270);

    this.createText(440, 60, "Choose a Website", PANEL_TITLE_STYLE);
    const goBackText = this.createText(20, 250, "Go Back", PANEL_TITLE_STYLE);
    const catWorldText = this.createText(980, 250, "View Cat World", PANEL_TITLE_STYLE);
    const gorillaGainzText = this.createText(460, 450, "View Gorilla Gainz", PANEL_TITLE_STYLE);

    [goBackText, catWorldText, gorillaGainzText].forEach(t => {
      t.setPadding(24, 12);
      t.setInteractive({ useHandCursor: true });
    });
    goBackText.on("pointerdown", () => {
      this.externalLaunchInProgress = false;
      this.scene.start(SCENE_KEYS.choice);
    });
    catWorldText.on("pointerdown", () => {
      if (this.controlsEnabled) {
        this.openExternal(WEBSITE_LINKS.angularPortfolio);
        this.player.x = 500;
      }
    });
    gorillaGainzText.on("pointerdown", () => {
      if (this.controlsEnabled) {
        this.openExternal(WEBSITE_LINKS.reactPortfolio);
      }
    });

    this.fadeInScene();
  }

  openExternal(url) {
    if (this.externalLaunchInProgress) {
      return;
    }

    this.externalLaunchInProgress = true;
    openExternalLink(url);
    this.playerMovement.stopPlayer();
  }

  update() {
    if (this.player.body.blocked.left) {
      this.externalLaunchInProgress = false;
      this.scene.start(SCENE_KEYS.choice);
      return;
    }

    if (this.controlsEnabled && this.player.body.blocked.right) {
      this.openExternal(WEBSITE_LINKS.angularPortfolio);
      this.player.x = 500;
    }

    if (this.controlsEnabled && this.cursors.down.isDown && this.player.body.touching.down) {
      this.openExternal(WEBSITE_LINKS.reactPortfolio);
    }

    if (this.cursors.down.isUp && !this.player.body.blocked.right) {
      this.externalLaunchInProgress = false;
    }

    this.updatePlayerMovement();
  }
}
