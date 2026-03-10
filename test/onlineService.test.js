import assert from "node:assert/strict";
import test from "node:test";

const store = new Map();

global.localStorage = {
  getItem(key) {
    return store.has(key) ? store.get(key) : null;
  },
  setItem(key, value) {
    store.set(key, String(value));
  },
  removeItem(key) {
    store.delete(key);
  }
};

global.window = {
  addEventListener() {}
};

const {
  createLocalAdapter,
  createSteamAdapter,
  setOnlineAdapter,
  unlockAchievement,
  submitLeaderboardScore,
  flushQueue,
  getOnlineStatus,
  submitRunLeaderboards
} = await import("../app/services/onlineService.js");

function resetState() {
  store.clear();
  setOnlineAdapter(createLocalAdapter());
}

test("local adapter contract returns safe defaults", async () => {
  resetState();
  const adapter = createLocalAdapter();

  assert.deepEqual(await adapter.unlockAchievement("score_50"), { ok: true });
  assert.deepEqual(await adapter.submitLeaderboardScore("best_score", 10), { ok: true });
  assert.deepEqual(await adapter.getLeaderboardEntries("best_score", 5), []);
  assert.deepEqual(await adapter.saveToCloud({ hello: 1 }), { ok: true });
  assert.equal(await adapter.loadFromCloud(), null);
  assert.deepEqual(await adapter.setRichPresence("In menu"), { ok: true });
});

test("steam adapter contract forwards calls to provider", async () => {
  resetState();
  const calls = [];
  const provider = {
    unlockAchievement(id) { calls.push(["unlock", id]); return { ok: true }; },
    submitLeaderboardScore(id, score) { calls.push(["submit", id, score]); return { ok: true }; },
    getLeaderboardEntries(id, count) { calls.push(["list", id, count]); return [{ name: "a", score: 12 }]; },
    saveToCloud(payload) { calls.push(["save", payload]); return { ok: true }; },
    loadFromCloud() { calls.push(["load"]); return { highScore: 10 }; },
    setRichPresence(status) { calls.push(["presence", status]); return { ok: true }; }
  };
  const adapter = createSteamAdapter(provider);

  await adapter.unlockAchievement("score_50");
  await adapter.submitLeaderboardScore("best_score", 33);
  const entries = await adapter.getLeaderboardEntries("best_score", 3);
  const cloud = await adapter.loadFromCloud();
  await adapter.saveToCloud({ highScore: 44 });
  await adapter.setRichPresence("In game");

  assert.equal(entries.length, 1);
  assert.equal(cloud.highScore, 10);
  assert.equal(calls.length, 6);
});

test("failed submissions are queued and retried", async () => {
  resetState();
  let shouldFail = true;
  const provider = {
    unlockAchievement() {
      if (shouldFail) throw new Error("offline");
      return { ok: true };
    },
    submitLeaderboardScore() {
      if (shouldFail) throw new Error("offline");
      return { ok: true };
    }
  };

  setOnlineAdapter(createSteamAdapter(provider));
  unlockAchievement("score_50");
  submitLeaderboardScore("best_score", 99);
  await new Promise(resolve => setTimeout(resolve, 20));

  let status = getOnlineStatus();
  assert.ok(status.queueLength >= 2);

  shouldFail = false;
  const queued = JSON.parse(store.get("skyfall_online_queue") || "[]");
  queued.forEach(item => {
    item.nextAttemptAt = 0;
    item.attempt = 0;
  });
  store.set("skyfall_online_queue", JSON.stringify(queued));
  await flushQueue();
  status = getOnlineStatus();
  assert.equal(status.queueLength, 0);
  assert.equal(Boolean(status.achievements.score_50?.synced), true);
});

test("submitRunLeaderboards submits canonical and daily-seed boards", async () => {
  resetState();
  const calls = [];
  const provider = {
    submitLeaderboardScore(id, score) { calls.push([id, score]); return { ok: true }; }
  };
  setOnlineAdapter(createSteamAdapter(provider));

  submitRunLeaderboards({ runScore: 77, survivalSeconds: 20, dailySeedDate: new Date("2026-01-15T00:00:00Z") });
  await new Promise(resolve => setTimeout(resolve, 20));

  assert.deepEqual(calls, [
    ["best_score", 77],
    ["longest_survival_sec", 20],
    ["daily_seed_20260115", 77]
  ]);
});
