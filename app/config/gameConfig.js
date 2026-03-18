/**
 * Game dimensions and layout. Values come from style tokens (theme.components.game).
 */
import theme from "./styleTokens/index.js";

const layout = theme.components.game.layout;
const world = theme.components.game.world;
const player = theme.components.game.player;

export const GAME_WIDTH = layout.width;
export const GAME_HEIGHT = layout.height;
export const GAME_CENTER_X = layout.centerX;
export const GAME_CENTER_Y = layout.centerY;

export const PLAYER_START_Y = player.startY;
/** Player height as fraction of game height (e.g. 0.11 ≈ 11% of screen) for proportionate stickman */
export const PLAYER_HEIGHT_FRACTION = player.heightFraction;
export const INTRO_PLAYER_X = player.introX;
export const MENU_PLAYER_X = player.menuX;
export const START_PLAYER_X = player.startX;

export const WORLD_BOUNDS = {
  groundX: world.groundX,
  groundY: world.groundY
};

/** Re-export theme for consumers that want tokens directly */
export { theme };
