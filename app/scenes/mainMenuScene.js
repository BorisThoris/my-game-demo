import { GAME_HEIGHT, GAME_WIDTH, PLAYER_START_Y } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import { EXIT_UNLOCK_SCORE } from "../game/runnerContent";
import { ensureProceduralTexture, DEFAULT_PROCEDURAL_PARAMS } from "../game/proceduralSprites";
import { ARCHETYPE_LIBRARY } from "../game/archetypeSystem";
import { setRichPresence } from "../services/onlineService";
import {
  getSelectedArchetype,
  getSettings,
  initSaveFromCloud,
  setSelectedArchetype,
  getActiveContracts,
  getMetaProgression,
  claimCompletedContract
} from "../save/saveManager";
import { GAME_VERSION } from "../config/version";
import BaseScene from "./baseScene";
import { getModeList, normalizeGameMode } from "../game/modeConfig";

/** Valve/GMod-style main menu: options panel on the left, visuals (player + bg) on the right. */
const PANEL_WIDTH = 380;
const PANEL_PADDING = 32;
const ACCENT_COLOR = 0xf0a020;
const PANEL_FILL = 0x0a0f14;
const PANEL_ALPHA = 0.94;
const MENU_PLAYER_X = GAME_WIDTH - 200;
const MENU_PLAYER_Y = PLAYER_START_Y - 50;
const MENU_PLAYER_SCALE = 1.4;

export default class MainMenuScene extends BaseScene {
  constructor() {
    super(SCENE_KEYS.mainMenu);
    this.selectedMode = "Classic";
  }

  init(data) {
    this._menuData = data || {};
    this.selectedMode = normalizeGameMode(this._menuData.mode || this.selectedMode);
  }

  create() {
    initSaveFromCloud();
    super.createSceneShell(MENU_PLAYER_X, "flex", false);
    this.input.keyboard.resetKeys();
    setRichPresence("In menu");
    if (getSettings().fullscreen && this.scale && this.scale.startFullscreen) {
      this.scale.startFullscreen();
    }

    this._ensureMenuProceduralTextures();
    this._addProceduralEnemies();
    this._poseAndSizePlayer();
    this.selectedArchetypeId = getSelectedArchetype();

    const contracts = getActiveContracts();
    const contractClaims = [];
    contracts.forEach((contract) => {
      const reward = claimCompletedContract(contract.id);
      if (reward) {
        contractClaims.push({ title: contract.title, reward });
      }
    });
    const refreshedMeta = getMetaProgression();

    // Left panel (Valve/GMod style)
    const panel = this.add.graphics();
    panel.fillStyle(PANEL_FILL, PANEL_ALPHA);
    panel.fillRect(0, 0, PANEL_WIDTH, GAME_HEIGHT);
    panel.lineStyle(3, ACCENT_COLOR, 1);
    panel.lineBetween(PANEL_WIDTH, 0, PANEL_WIDTH, GAME_HEIGHT);
    panel.setDepth(5);

    // Title top-left of panel
    const title = this.add.text(PANEL_PADDING, 72, "SKYFALL", {
      font: "700 42px Arial",
      fill: "#ffffff"
    });
    title.setDepth(10);

    const modes = getModeList();
    const modeLabel = this.add.text(PANEL_PADDING, 138, "Mode", {
      font: "700 18px Arial",
      fill: "#8ea0b2"
    });
    modeLabel.setDepth(10);

    modes.forEach((entry, index) => {
      const modeText = this.add.text(PANEL_PADDING, 164 + index * 24, "", {
        font: "700 16px Arial",
        fill: "#6a7a8a"
      });
      const refresh = () => {
        const isSelected = this.selectedMode === entry.mode;
        modeText.setText(`${isSelected ? "▶" : "•"} ${entry.label}`);
        modeText.setColor(isSelected ? "#ffffff" : "#8ea0b2");
      };
      refresh();
      modeText.setDepth(10);
      modeText.setInteractive({ useHandCursor: true });
      modeText.on("pointerdown", () => {
        this.selectedMode = entry.mode;
        this.scene.restart({ mode: this.selectedMode });
      });
    });

    // Menu options on the left, vertical list
    const menuYStart = 252;
    const menuSpacing = 56;
    const menuItems = [
      {
        label: "Play",
        action: () =>
          this.scene.start(SCENE_KEYS.game, {
            mode: this.selectedMode,
            archetypeId: this.selectedArchetypeId
          })
      },
      {
        label: "Options",
        action: () =>
          this.scene.start(SCENE_KEYS.options, { returnTo: SCENE_KEYS.mainMenu })
      },
      { label: "Credits", action: () => this.scene.start(SCENE_KEYS.credits) },
      { label: "Progression", action: () => this.scene.start(SCENE_KEYS.meta) },
      { label: "Quit", action: () => this.quit() }
    ];

    menuItems.forEach((item, i) => {
      const y = menuYStart + i * menuSpacing;
      const text = this.add.text(PANEL_PADDING, y, item.label, {
        font: "700 28px Arial",
        fill: "#c8d0d8"
      });
      text.setDepth(10);
      text.setInteractive({ useHandCursor: true });
      text.on("pointerover", () => {
        text.setFill("#ffffff");
        text.setScale(1.02);
      });
      text.on("pointerout", () => {
        text.setFill("#c8d0d8");
        text.setScale(1);
      });
      text.on("pointerdown", item.action);
    });

    const archetypeLabel = this.add.text(PANEL_PADDING, menuYStart + menuItems.length * menuSpacing + 18, "Archetype", {
      font: "700 18px Arial",
      fill: "#88a0b8"
    });
    archetypeLabel.setDepth(10);

    const archetypeValue = this.add.text(PANEL_PADDING, archetypeLabel.y + 24, "", {
      font: "700 24px Arial",
      fill: "#ffffff"
    });
    archetypeValue.setDepth(10);

    const archetypeDesc = this.add.text(PANEL_PADDING, archetypeValue.y + 34, "", {
      font: "700 14px Arial",
      fill: "#7c8ea0",
      wordWrap: { width: PANEL_WIDTH - PANEL_PADDING * 2 }
    });
    archetypeDesc.setDepth(10);

    const updateArchetypeText = () => {
      const selected = ARCHETYPE_LIBRARY.find(entry => entry.id === this.selectedArchetypeId) || ARCHETYPE_LIBRARY[0];
      archetypeValue.setText(`${selected.name}  (click to change)`);
      archetypeDesc.setText(selected.description);
    };

    archetypeValue.setInteractive({ useHandCursor: true });
    archetypeValue.on("pointerover", () => archetypeValue.setFill("#9ae6ff"));
    archetypeValue.on("pointerout", () => archetypeValue.setFill("#ffffff"));
    archetypeValue.on("pointerdown", () => {
      const currentIndex = ARCHETYPE_LIBRARY.findIndex(entry => entry.id === this.selectedArchetypeId);
      const nextIndex = (Math.max(currentIndex, 0) + 1) % ARCHETYPE_LIBRARY.length;
      this.selectedArchetypeId = ARCHETYPE_LIBRARY[nextIndex].id;
      setSelectedArchetype(this.selectedArchetypeId);
      updateArchetypeText();
    });
    updateArchetypeText();

    const completedContracts = contracts.filter((contract) => contract.completed || contract.claimed).length;
    const contractHeadline = `Contracts: ${completedContracts}/${contracts.length} complete`;
    const contractProgress = contracts
      .map((contract) => {
        const progress = contract.metric === "survivalMs"
          ? `${Math.floor(contract.progress / 1000)}s/${Math.floor(contract.target / 1000)}s`
          : `${contract.progress}/${contract.target}`;
        return `${contract.title} ${progress}`;
      })
      .join("\n");
    this.add.text(PANEL_PADDING, 622, [contractHeadline, contractProgress].join("\n"), {
      font: "700 11px Arial",
      fill: "#b9d7f5",
      wordWrap: { width: PANEL_WIDTH - PANEL_PADDING * 2 }
    }).setDepth(10);

    const claimSummary = contractClaims.length
      ? `Claimed: ${contractClaims.map((entry) => `+${entry.reward.currency}c/+${entry.reward.fragments}f ${entry.title}`).join(" • ")}`
      : `Currency: ${refreshedMeta.currency} • Fragments: ${refreshedMeta.unlockFragments}`;
    this.add.text(PANEL_PADDING, 672, claimSummary, {
      font: "700 11px Arial",
      fill: contractClaims.length ? "#8be9b1" : "#fff2b5",
      wordWrap: { width: PANEL_WIDTH - PANEL_PADDING * 2 }
    }).setDepth(10);

    // Bottom-left: version and tagline (n-ish, left bottom left)
    const tagline = this.add.text(
      PANEL_PADDING,
      GAME_HEIGHT - 92,
      `Mode: ${this.selectedMode} • Reach score ${EXIT_UNLOCK_SCORE} and touch the right edge to finish a run.`,
      { font: "700 14px Arial", fill: "#6a7a8a", wordWrap: { width: PANEL_WIDTH - PANEL_PADDING * 2 } }
    );
    tagline.setDepth(10);

    const versionText = this.add.text(PANEL_PADDING, GAME_HEIGHT - 34, `v${GAME_VERSION}`, {
      font: "700 16px Arial",
      fill: "#5a6a7a"
    });
    versionText.setDepth(10);
  }

  _ensureMenuProceduralTextures() {
    const families = ["orb", "star", "hazardGlow", "ring", "polygon"];
    families.forEach((family, i) => {
      const params = { ...DEFAULT_PROCEDURAL_PARAMS[family], seed: i + 1 };
      ensureProceduralTexture(this, params);
    });
  }

  _addProceduralEnemies() {
    const enemies = [
      { key: ensureProceduralTexture(this, { ...DEFAULT_PROCEDURAL_PARAMS.orb, seed: 1 }), x: 720, y: 220, scale: 0.5, tint: 0xff8866, depth: 2 },
      { key: ensureProceduralTexture(this, { ...DEFAULT_PROCEDURAL_PARAMS.star, seed: 2 }), x: 980, y: 320, scale: 0.45, tint: 0xffaa44, depth: 2 },
      { key: ensureProceduralTexture(this, { ...DEFAULT_PROCEDURAL_PARAMS.hazardGlow, seed: 1 }), x: 1120, y: 180, scale: 0.4, tint: 0xff6644, depth: 2 },
      { key: ensureProceduralTexture(this, { ...DEFAULT_PROCEDURAL_PARAMS.ring, seed: 1 }), x: 820, y: 480, scale: 0.5, tint: 0xffcc66, depth: 2 },
      { key: ensureProceduralTexture(this, { ...DEFAULT_PROCEDURAL_PARAMS.polygon, seed: 2 }), x: 1050, y: 520, scale: 0.4, tint: 0xaa88ff, depth: 2 }
    ];
    enemies.forEach((e) => {
      if (!e.key) return;
      const img = this.add.image(e.x, e.y, e.key);
      img.setScale(e.scale);
      img.setTint(e.tint);
      img.setDepth(e.depth);
      img.setAlpha(0.85);
      this.tweens.add({
        targets: img,
        y: img.y + (Math.sin(Math.random() * Math.PI * 2) * 8),
        duration: 1500 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
    });
  }

  _poseAndSizePlayer() {
    if (!this.player) return;
    this.player.setPosition(MENU_PLAYER_X, MENU_PLAYER_Y);
    this.player.setDepth(6);
    this.player._displayScaleMultiplier = MENU_PLAYER_SCALE;
    this.player.anims.play("jump", true);
    this.tweens.add({
      targets: this.player,
      y: MENU_PLAYER_Y - 12,
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  quit() {
    if (typeof window !== "undefined" && window.electronQuit) {
      window.electronQuit();
    } else {
      window.close();
    }
  }
}
