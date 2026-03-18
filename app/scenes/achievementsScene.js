import { GAME_CENTER_X, GAME_HEIGHT, GAME_WIDTH, theme } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import { BODY_STYLE, PANEL_TITLE_STYLE } from "../config/sceneStyles";
import { ACHIEVEMENTS } from "../config/achievements";
import { listAchievementStates } from "../services/onlineService";
import BaseScene from "./baseScene";

const ROW_HEIGHT = 52;
const PADDING_LEFT = 120;
const PADDING_RIGHT = 120;

export default class AchievementsScene extends BaseScene {
  constructor() {
    super(SCENE_KEYS.achievements);
  }

  create(data) {
    super.createSceneShell(GAME_WIDTH - 120, "flex", false);
    this.input.keyboard.resetKeys();
    this.returnTo = (data && data.returnTo) || SCENE_KEYS.mainMenu;
    this.returnData = (data && data.returnData) || null;

    const colors = theme.colors;
    const states = listAchievementStates();
    const list = Object.values(ACHIEVEMENTS);

    let y = 70;
    this.createText(GAME_CENTER_X, y, "Achievements", PANEL_TITLE_STYLE, 0.5, 0.5);
    y += 55;

    list.forEach((ach) => {
      const state = states.find((s) => s.id === ach.id);
      const unlocked = state ? state.unlocked : false;

      this.createText(PADDING_LEFT, y, ach.title, {
        ...BODY_STYLE,
        font: "700 22px Arial",
        fill: unlocked ? colors.semantic.text.status : colors.semantic.text.muted,
        align: "left"
      });
      this.createText(PADDING_LEFT, y + 26, ach.description, {
        ...BODY_STYLE,
        font: "700 18px Arial",
        fill: colors.semantic.text.muted,
        align: "left"
      });
      const badge = this.createText(GAME_WIDTH - PADDING_RIGHT, y + 12, unlocked ? "Unlocked" : "Locked", {
        ...BODY_STYLE,
        font: "700 18px Arial",
        fill: unlocked ? colors.semantic.text.success : colors.semantic.text.muted,
        align: "right"
      });
      badge.setOrigin(1, 0.5);
      y += ROW_HEIGHT;
    });

    y += 24;
    const back = this.createText(GAME_CENTER_X, Math.min(y, GAME_HEIGHT - 80), "Back", {
      ...BODY_STYLE,
      font: "700 28px Arial",
      fill: colors.semantic.text.warm
    });
    back.setOrigin(0.5, 0.5);
    back.setInteractive({ useHandCursor: true });
    back.on("pointerover", () => back.setScale(1.08));
    back.on("pointerout", () => back.setScale(1));
    back.on("pointerdown", () => {
      if (this.returnTo === SCENE_KEYS.game && this.returnData) {
        this.scene.start(SCENE_KEYS.game, this.returnData);
      } else {
        this.scene.start(this.returnTo, this.returnData || undefined);
      }
    });
  }
}
