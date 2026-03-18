// @ts-check
import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Use a dedicated port so tests don't hit another app on 3000. For local dev: npm run dev -- --port 3000 then open http://localhost:3000/#/editor
const port = process.env.PLAYWRIGHT_APP_PORT ? parseInt(process.env.PLAYWRIGHT_APP_PORT, 10) : 25999;
const baseURL = "http://localhost:" + port;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 4,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx vite --port " + port + " --strictPort",
    url: baseURL,
    timeout: 60000,
    cwd: __dirname,
    reuseExistingServer: !process.env.CI,
  },
});
