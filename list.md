# Asset list – everything needed

Inventory of every asset the game needs. Programmatic (code-drawn) equivalents are implemented for dodge-game assets; base-scene assets are listed for completeness (Phase 2 optional). All programmatic assets are built with the **shape system** (Phaser Graphics: circles, rects, polygons, lines); no SVG files or SVG data are used.

---

## Dodge game (UI / pickups / perks)

| Id | Purpose | Format | Programmatic spec |
|----|---------|--------|-------------------|
| `replay` | Replay button on game over screen | Single image, ~128×128 | Circle or rounded rect + filled play triangle (triangle pointing right) |
| `powerUp` | Generic pickup fallback when spritesheet not used | Single image, ~64×64 | Star or ring (e.g. pickupShine-style); neutral white/light fill |
| `stagePowerup` | Phase transition "stage powers up" pop at screen center | Single image, ~64×64 | Star/ring combo or multi-ring burst; soft fill |
| `stageIntensityHeat` | Heat phase / boss active indicator in HUD | Single image, ~64×64 | Flame silhouette (triangles/polygon) or upward bars; tint red/orange at use |
| `pickupPowerups` | In-world pickup sprites | Spritesheet, 4 frames, each 64×64 | Frame 0: shield (ring + inner fill). Frame 1: speed (bolt/arrow). Frame 2: invuln (star). Frame 3: scoreMult (double star or X) |
| `perkIcons` | Perk choice panel icons | Spritesheet, 8 frames, each 48×48 | Frames 0–7 = PERK_LIBRARY order: kinetic-boots (boot/wedge), magnetic-core (circle), overclock (gear polygon), phase-buffer (hourglass), thick-skin (shield), scavenger (gem/diamond), quick-step (small boot), fortress (shield variant) |

---

## Base scene / shared

| Id | Purpose | Format | Programmatic spec (Phase 2) |
|----|---------|--------|-----------------------------|
| `ground` | Floor / platform tile | Single image | Tile pattern or simple rect with line |
| `background` | Background tileSprite | Single image | Gradient or simple pattern |
| `arrow` | Navigation / CTA (e.g. right arrow) | Single image | Filled triangle or arrow shape |
| `crouch-flex` | Character animation | Spritesheet, 256×256 per frame | Simplified procedural frames |
| `crouch-walk-left` | Character animation | Spritesheet, 256×256 per frame | Simplified procedural frames |
| `crouch-walk-right` | Character animation | Spritesheet, 256×256 per frame | Simplified procedural frames |
| `jump` | Character animation | Spritesheet, 256×256 per frame | Simplified procedural frames |

Note: `mummy`, `mummy2`, `flex` are already procedural (dummy sheets from `ensureProceduralPlayerSheets`); player is drawn by StickmanPlayer.
