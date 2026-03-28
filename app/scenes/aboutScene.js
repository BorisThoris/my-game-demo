import { GAME_CENTER_X, GAME_HEIGHT, GAME_WIDTH, theme } from "../config/gameConfig";
import { EXTERNAL_LINKS } from "../config/externalLinks";
import { SCENE_KEYS } from "../config/sceneKeys";
import { BODY_STYLE, PANEL_TITLE_STYLE } from "../config/sceneStyles";
import { GAME_VERSION } from "../config/version";
import { openExternalLink } from "../shared/browser";
import BaseScene from "./baseScene";

const { colors } = theme;

function linkLabel(url) {
  return url && url.startsWith("http") ? "Open link" : "Not configured (pre-release)";
}

export default class AboutScene extends BaseScene {
  constructor() {
    super(SCENE_KEYS.about);
  }

  create(data) {
    super.createSceneShell(GAME_WIDTH - 120, "flex", false);
    this.input.keyboard.resetKeys();
    this.returnTo = (data && data.returnTo) || SCENE_KEYS.mainMenu;
    this.returnData = (data && data.returnData) || null;

    let y = 56;
    this.createText(GAME_CENTER_X, y, "About Skyfall", PANEL_TITLE_STYLE, 0.5, 0.5);
    y += 48;
    this.createText(GAME_CENTER_X, y, `Version ${GAME_VERSION}`, {
      font: "700 22px Arial",
      fill: colors.semantic.text.accent,
      align: "center"
    }).setOrigin(0.5, 0.5);
    y += 56;

    const rows = [
      { key: "support", title: "Support" },
      { key: "privacy", title: "Privacy policy" },
      { key: "store", title: "Store page" },
      { key: "reportBug", title: "Report a bug" }
    ];

    rows.forEach(({ key, title }) => {
      const url = EXTERNAL_LINKS[key] || "";
      const configured = Boolean(url && url.startsWith("http"));
      this.createText(160, y, title, { ...BODY_STYLE, font: "700 20px Arial", align: "left" });
      const action = this.createText(420, y, linkLabel(url), {
        ...BODY_STYLE,
        font: "700 18px Arial",
        fill: configured ? colors.semantic.text.accent : colors.semantic.text.muted,
        align: "left"
      });
      if (configured) {
        action.setInteractive({ useHandCursor: true });
        action.on("pointerover", () => action.setScale(1.04));
        action.on("pointerout", () => action.setScale(1));
        action.on("pointerdown", () => openExternalLink(url));
      }
      y += 44;
    });

    y += 24;
    this.createText(
      GAME_CENTER_X,
      y,
      "Leaderboards and achievements sync only when a Steam (or other) adapter is active.\nLocal profile: scores stay on this device — see main menu status line.",
      {
        ...BODY_STYLE,
        font: "700 14px Arial",
        fill: colors.semantic.text.muted,
        align: "center",
        wordWrap: { width: 920 }
      }
    ).setOrigin(0.5, 0);
    y += 72;

    const back = this.createText(GAME_CENTER_X, Math.min(y + 20, GAME_HEIGHT - 72), "Back", {
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
