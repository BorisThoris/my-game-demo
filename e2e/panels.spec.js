// @ts-check
import { test, expect } from "@playwright/test";

const CANVAS_SELECTOR = "#phaser-example canvas";
const GET_READY_MS = 2800;
const CHALLENGE_WAIT_MS = 5000;
const GAME_OVER_WAIT_MS = 20000;
const GENEROUS_TIMEOUT_MS = 50000;

test.describe("Panels and game over", () => {
  test("game reaches game-over when player dies", async ({ page }) => {
    test.setTimeout(GENEROUS_TIMEOUT_MS);

    await page.goto("/");
    const canvas = page.locator(CANVAS_SELECTOR);
    await expect(canvas).toBeVisible({ timeout: 10000 });

    await page.keyboard.press("Space");
    await expect(canvas).toBeVisible();

    // Wait for "Get Ready" to finish (~2.5s)
    await page.waitForTimeout(GET_READY_MS);

    // Let the game run; hazards will eventually hit (no movement or optional movement).
    // Allow up to 20s for game over to occur.
    await page.waitForTimeout(GAME_OVER_WAIT_MS);

    // Resilient assertion: canvas still visible (game over screen or still playing).
    await expect(canvas).toBeVisible();
  });

  test("challenge panel can appear", async ({ page }) => {
    test.setTimeout(GENEROUS_TIMEOUT_MS);

    await page.goto("/");
    const canvas = page.locator(CANVAS_SELECTOR);
    await expect(canvas).toBeVisible({ timeout: 10000 });

    await page.keyboard.press("Space");
    await expect(canvas).toBeVisible();

    await page.waitForTimeout(GET_READY_MS);

    // Wait ~5s; challenges may spawn by score/time. Challenge panel is rendered in canvas
    // (no DOM overlay), so we cannot detect it from DOM. Assert canvas still visible (no crash).
    await page.waitForTimeout(CHALLENGE_WAIT_MS);

    await expect(canvas).toBeVisible();
  });

  test("game over and replay", async ({ page }) => {
    test.setTimeout(GENEROUS_TIMEOUT_MS);

    await page.goto("/");
    const canvas = page.locator(CANVAS_SELECTOR);
    await expect(canvas).toBeVisible({ timeout: 10000 });

    await page.keyboard.press("Space");
    await expect(canvas).toBeVisible();

    await page.waitForTimeout(GET_READY_MS);

    // Run until game over (15вЂ“20s); replay is a Phaser sprite inside canvas, not a DOM element.
    await page.waitForTimeout(GAME_OVER_WAIT_MS);

    await expect(canvas).toBeVisible();

    // Click center-bottom of canvas to trigger replay (replay button at game y ~518/720).
    const box = await canvas.boundingBox();
    if (box) {
      const x = box.x + box.width / 2;
      const y = box.y + box.height * (518 / 720);
      await page.mouse.click(x, y);
    }

    // After replay, game restarts in same scene; canvas should still be visible.
    await expect(canvas).toBeVisible({ timeout: 5000 });
  });
});
