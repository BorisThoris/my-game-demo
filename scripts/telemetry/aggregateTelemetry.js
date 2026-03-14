#!/usr/bin/env node
import fs from "node:fs";

const usage = () => {
  console.error("Usage: node scripts/telemetry/aggregateTelemetry.js <telemetry-json-path>");
};

const path = process.argv[2];
if (!path) {
  usage();
  process.exit(1);
}

const raw = fs.readFileSync(path, "utf8");
const events = JSON.parse(raw);
if (!Array.isArray(events)) {
  throw new Error("Telemetry file must be a JSON array of events.");
}

const runStart = new Set(events.filter(e => e.eventName === "run_start").map(e => e.runId));
const runEnd = events.filter(e => e.eventName === "run_end");
const bossClears = new Set(
  events
    .filter(e => e.eventName === "boss_outcome" && e.outcome === "cleared")
    .map(e => e.runId)
);
const challengeOutcomes = events.filter(e => e.eventName === "challenge_performance");

const runLengths = runEnd
  .map(e => Number(e.runTimeMs || 0))
  .filter(value => Number.isFinite(value) && value >= 0)
  .sort((a, b) => a - b);

const median = values => {
  if (values.length === 0) return 0;
  const mid = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return (values[mid - 1] + values[mid]) / 2;
  }
  return values[mid];
};

const firstBossReachRate = runStart.size > 0 ? bossClears.size / runStart.size : 0;
const challengeSuccessRate =
  challengeOutcomes.length > 0
    ? challengeOutcomes.filter(entry => entry.success).length / challengeOutcomes.length
    : 0;

const report = {
  runCount: runStart.size,
  completedRunCount: runEnd.length,
  medianRunLengthMs: median(runLengths),
  firstBossReachRate,
  challengeSuccessRate
};

console.log(JSON.stringify(report, null, 2));
