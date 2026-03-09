// @ts-check
import { test, expect } from "@playwright/test";

const GAME_CANVAS = "#phaser-example canvas";

test.describe("Game scene", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Space");
    await expect(page.locator(GAME_CANVAS)).toBeVisible({ timeout: 10000 });
  });

  test("game scene shows canvas after start", async ({ page }) => {
    const canvas = page.locator(GAME_CANVAS);
    await expect(canvas).toBeVisible();
  });

  test("short gameplay with arrow key keeps canvas visible and does not crash", async ({ page }) => {
    await page.keyboard.down("ArrowRight");
    await page.keyboard.up("ArrowRight");
    const canvas = page.locator(GAME_CANVAS);
    await expect(canvas).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Game start", () => {
  test("no console errors during game start", async ({ page }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    await page.goto("/");
    await page.keyboard.press("Space");
    await expect(page.locator(GAME_CANVAS)).toBeVisible({ timeout: 5000 });
    expect(consoleErrors, `Unexpected console.error(s): ${consoleErrors.join("; ")}`).toHaveLength(0);
  });
});
