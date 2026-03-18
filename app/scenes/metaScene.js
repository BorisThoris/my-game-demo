import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, theme } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import { getMetaState, META_UNLOCK_NODES, purchaseUnlock } from "../game/metaProgression";

const { colors, zIndex, spacing } = theme;

export default class MetaScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.meta);
  }

  create() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, parseInt(colors.semantic.background.overlay.replace("#", ""), 16), 1);
    this.add.text(spacing[10], spacing[6], "Meta Progression", { font: "700 42px Arial", fill: colors.base.white });

    this.currencyText = this.add.text(spacing[10], 82, "", { font: "700 24px Arial", fill: colors.semantic.text.score });
    this.messageText = this.add.text(spacing[10], 116, "Spend currency on permanent run-start bonuses.", {
      font: "700 18px Arial",
      fill: colors.semantic.text.objective
    });

    const entries = Object.values(META_UNLOCK_NODES);
    entries.forEach((node, idx) => {
      const y = 180 + idx * 105;
      const card = this.add.rectangle(60 + 520 / 2, y, 520, 88, parseInt(colors.semantic.background.panel.replace("#", ""), 16), 0.95).setOrigin(0.5);
      card.setStrokeStyle(theme.components.hud.stroke.width, colors.semantic.game.cardStroke, 1);

      const title = this.add.text(80, y - 30, `${node.label} (${node.cost})`, {
        font: "700 24px Arial",
        fill: colors.semantic.text.status
      });
      const desc = this.add.text(80, y - 2, node.description, {
        font: "16px Arial",
        fill: colors.semantic.text.objective
      });
      const prereq = this.add.text(80, y + 18, node.prereqs.length ? `Requires: ${node.prereqs.join(", ")}` : "No prerequisite", {
        font: "15px Arial",
        fill: colors.semantic.text.muted
      });

      const buy = this.add.text(500, y - 6, "Unlock", {
        font: "700 22px Arial",
        fill: colors.semantic.text.status
      }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });

      buy.on("pointerdown", () => {
        const result = purchaseUnlock(node.id);
        if (result.ok) {
          this.messageText.setText(`Unlocked ${node.label}.`);
        } else {
          this.messageText.setText(`Could not unlock ${node.label}: ${result.reason}.`);
        }
        this.renderState();
      });

      this._nodes = this._nodes || [];
      this._nodes.push({ node, card, title, desc, prereq, buy });
    });

    const back = this.add.text(spacing[10], GAME_HEIGHT - 42, "< Back", {
      font: "700 26px Arial",
      fill: colors.semantic.text.status
    }).setInteractive({ useHandCursor: true });
    back.on("pointerdown", () => this.scene.start(SCENE_KEYS.mainMenu));

    this.renderState();
  }

  renderState() {
    const state = getMetaState();
    this.currencyText.setText(`Meta currency: ${state.metaCurrency}`);
    const unlocked = new Set(state.unlockTree.unlockedNodes);

    this._nodes.forEach(({ node, card, title, prereq, buy }) => {
      const has = unlocked.has(node.id);
      const prereqMet = node.prereqs.every(reqId => unlocked.has(reqId));
      const canBuy = !has && prereqMet && state.metaCurrency >= node.cost;

      card.setStrokeStyle(theme.components.hud.stroke.width, has ? colors.semantic.game.cardStrokeSuccess : canBuy ? colors.semantic.game.cardStrokeCanBuy : colors.semantic.game.cardStroke, 1);
      title.setFill(has ? colors.semantic.text.success : colors.semantic.text.status);
      prereq.setFill(prereqMet ? colors.semantic.text.muted : colors.semantic.text.danger);
      buy.setText(has ? "Unlocked" : "Unlock");
      buy.setFill(has ? colors.semantic.text.success : canBuy ? colors.semantic.text.score : colors.semantic.text.muted);
      if (has) {
        buy.disableInteractive();
      } else {
        buy.setInteractive({ useHandCursor: true });
      }
    });
  }
}
