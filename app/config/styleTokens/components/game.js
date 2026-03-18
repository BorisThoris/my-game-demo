/**
 * Game layout and world component tokens.
 * Reference theme.components.game in gameConfig and scenes.
 */
const layoutWidth = 1280;
const layoutHeight = 720;
const game = {
  layout: {
    width: layoutWidth,
    height: layoutHeight,
    centerX: layoutWidth / 2,
    centerY: layoutHeight / 2
  },
  world: {
    groundX: 1280,
    groundY: 768
  },
  player: {
    startY: 540,
    heightFraction: 0.11,
    introX: 100,
    menuX: 600,
    startX: 220
  }
};

export default game;
