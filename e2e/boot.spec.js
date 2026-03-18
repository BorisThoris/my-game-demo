// @ts-check
import { test, expect } from "@playwright/test";

const PAGE_LOAD_TIMEOUT = 15000;
const CANVAS_SELECTOR = "#phaser-example canvas";
const PHASER_CONTAINER = "#phaser-example";

test.describe("Boot and menu", () => {
  test.setTimeout(25000);

  test("page loads with title and game canvas", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Skyfall/i, { timeout: PAGE_LOAD_TIMEOUT });
    const canvas = page.locator(CANVAS_SELECTOR);
    await expect(canvas).toBeVisible({ timeout: PAGE_LOAD_TIMEOUT });
  });

  test("page has header text", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".page-header h1")).toContainText("Skyfall", {
      timeout: PAGE_LOAD_TIMEOUT,
    });
  });

  test("no console errors on page load", async ({ page }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push({ type: msg.type(), text: msg.text() });
      }
    });
    await page.goto("/");
    const canvas = page.locator(CANVAS_SELECTOR);
    await expect(canvas).toBeVisible({ timeout: PAGE_LOAD_TIMEOUT });
    expect(
      consoleErrors,
      `Console errors on load: ${JSON.stringify(consoleErrors)}`
    ).toHaveLength(0);
  });

  test("starting game via Space switches to game scene", async ({ page }) => {
    await page.goto("/");
    const canvas = page.locator(CANVAS_SELECTOR);
    await expect(canvas).toBeVisible({ timeout: PAGE_LOAD_TIMEOUT });
    await page.keyboard.press("Space");
    await expect(canvas).toBeVisible();
  });

  test("starting game via click keeps canvas visible and produces no console errors", async ({
    page,
  }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push({ type: msg.type(), text: msg.text() });
      }
    });
    await page.goto("/");
    const container = page.locator(PHASER_CONTAINER);
    const canvas = page.locator(CANVAS_SELECTOR);
    await expect(canvas).toBeVisible({ timeout: PAGE_LOAD_TIMEOUT });
    consoleErrors.length = 0;
    const box = await container.boundingBox();
    expect(box).toBeTruthy();
    const clickX = box.x + box.width / 2;
    const clickY = box.y + box.height - 120;
    await page.mouse.click(clickX, clickY);
    await expect(canvas).toBeVisible();
    expect(
      consoleErrors,
      `Console errors after start: ${JSON.stringify(consoleErrors)}`
    ).toHaveLength(0);
  });

  test("app is running at #/editor: canvas visible and no console errors", async ({
    page,
  }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push({ type: msg.type(), text: msg.text() });
      }
    });
    await page.goto("/#/editor");
    const canvas = page.locator(CANVAS_SELECTOR);
    await expect(canvas).toBeVisible({ timeout: PAGE_LOAD_TIMEOUT });
    expect(page.url()).toContain("#/editor");
    expect(
      consoleErrors,
      `Console errors on #/editor: ${JSON.stringify(consoleErrors)}`
    ).toHaveLength(0);
  });

  test("achievements screen opens from menu and Back returns without errors", async ({
    page,
  }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push({ type: msg.type(), text: msg.text() });
      }
    });
    await page.goto("/");
    const canvas = page.locator(CANVAS_SELECTOR);
    await expect(canvas).toBeVisible({ timeout: PAGE_LOAD_TIMEOUT });
    consoleErrors.length = 0;

    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    const gameW = 1280;
    const gameH = 720;
    const achievementsItemX = 100;
    const achievementsItemY = 336;
    const clickAchievementsX = box.x + (box.width * achievementsItemX) / gameW;
    const clickAchievementsY = box.y + (box.height * achievementsItemY) / gameH;
    await page.mouse.click(clickAchievementsX, clickAchievementsY);
    await page.waitForTimeout(400);
    await expect(canvas).toBeVisible();
    expect(
      consoleErrors,
      `Console errors after opening Achievements: ${JSON.stringify(consoleErrors)}`
    ).toHaveLength(0);

    const backX = box.x + (box.width * 640) / gameW;
    const backY = box.y + (box.height * 620) / gameH;
    await page.mouse.click(backX, backY);
    await page.waitForTimeout(300);
    await expect(canvas).toBeVisible();
    expect(
      consoleErrors,
      `Console errors after Back: ${JSON.stringify(consoleErrors)}`
    ).toHaveLength(0);
  });
});
