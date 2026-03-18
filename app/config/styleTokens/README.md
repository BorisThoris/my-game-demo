# Design tokens

Use theme tokens for all new code. Avoid magic numbers for colors, spacing, typography, and z-index.

## Usage

```js
import theme from "../config/styleTokens"; // or from "../config/gameConfig" / "../config/dodgeHudStyles"

// Colors
theme.colors.semantic.text.score   // "#fff2b5"
theme.colors.semantic.stroke.hud   // "#0d1823"
theme.colors.semantic.game.phaseCyan  // 0x55d6ff (Phaser tint)

// Spacing (pixels)
theme.spacing[4]   // 16
theme.spacing[8]   // 32

// Typography
theme.typography.fontFamily.primary
theme.typography.fontSize["2xl"]   // "44px"

// Z-index (depth / stacking)
theme.zIndex.hud       // 8
theme.zIndex.gameOverContent  // 11

// Component tokens
theme.components.hud.phaseBar.width   // 320
theme.components.game.layout.width   // 1280
```

## Structure

- **domain/** – spacing, zIndex, typography, colors (base + semantic)
- **components/** – hud, game (layout and component-specific values)
- **index.js** – aggregates into single `theme` export

## Colors

Use `theme.colors.semantic` for UI (text, stroke, background). Use `theme.colors.semantic.game` for Phaser tints (hex numbers). Do not hardcode hex or rgb in scene or config code.

## Spacing

Use `theme.spacing[n]` (numeric scale in pixels). Do not use raw `8`, `16` etc. in new code.

## Typography

Use `theme.typography` (fontFamily, fontSize, fontWeight). Prefer semantic text colors from `theme.colors.semantic.text`.

## Z-index

Use `theme.zIndex` for depth/stacking (base, hud, overlay, pausePanel, gameOverPanel, etc.). Keeps layering consistent.

## Component tokens

Use `theme.components.hud` and `theme.components.game` for repeated layout values (phase bar width, game dimensions, player start position). Config files (gameConfig.js, dodgeHudStyles.js) import theme and re-export derived constants so existing imports keep working.
