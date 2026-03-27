# Copy tone (lore, perks, bosses, contracts) ↔ AGENT-33 tutorial

This note keeps **player-facing strings** aligned with the tutorial voice in [`app/scenes/tutorialScene.js`](../app/scenes/tutorialScene.js) ([**AGENT-33**](../tasks/AGENT-33-tutorial-onboarding-pass.md)): direct, short, second-person implied (“you” without poetry), game terms first (hazards, pickups, challenges, Exit, shields).

## Rules

- **Tutorial (AGENT-33):** bullet facts, one idea per line, no lore dumps.
- **Perks / debuffs (`perkLibrary.js`):** gear or status labels; descriptions stay **mechanical** (+X%, +1 shield, etc.). Light sci-fi nouns are fine if they do not obscure the stat.
- **Boss names (`runnerContent.js` mini-boss entries):** 1–3 words, elemental / artifact flavor (e.g. Storm Core, Void Spire)—same clarity bar as phase labels.
- **Contracts (`contractDirector.js`):** job-board titles (scout, survivor, buster, master) + descriptions that state the metric plainly; no in-world proper nouns required.
- **Menu tagline (`mainMenuScene.js`):** one short line under the logo; imperative or plain statement, same energy as tutorial lines.

## When to change strings

Prefer **this doc + `WORLD.md`** over wide rewrites. Edit in-game copy only when a line is **misleading** or **off-register** (jokey where the rest is dry, or vague where the tutorial is precise).
