import assert from "node:assert/strict";
import test from "node:test";
import { openExternalLink } from "../app/shared/browser.js";

test("openExternalLink returns null when window is unavailable", () => {
  assert.equal(openExternalLink("https://example.com"), null);
});

test("openExternalLink opens a new tab with hardened flags", () => {
  let call = null;
  global.window = {
    open(...args) {
      call = args;
      return "opened";
    }
  };

  const result = openExternalLink("https://example.com");

  assert.equal(result, "opened");
  assert.deepEqual(call, [
    "https://example.com",
    "_blank",
    "noopener,noreferrer"
  ]);

  delete global.window;
});
