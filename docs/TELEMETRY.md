# Telemetry Plan & KPI Baselines

## Event taxonomy

Core run events emitted by gameplay code:
- `run_start`: run begins, includes `runId`, phase, and starting shields.
- `run_end`: run exits or ends in death with `score`, `runTimeMs`, `exited`.
- `death_source`: source classification (`hazard`, `boss_or_projectile`) and texture.
- `pickup_usage`: pickup type and context (`scoreBefore`, shield count).
- `boss_outcome`: boss spawned/cleared outcomes and optional duration.
- `challenge_performance`: challenge type and success/failure.

Additional lightweight events emitted by directors:
- `challenge_spawned`, `challenge_evaluated`
- `objectives_reset`, `objective_completed`, `objective_reward_claimed`

## Local buffering and upload hook

Telemetry writes to local storage key `skyfall.telemetry.v1` and keeps the most recent 250 events.

Upload integration is intentionally hook-based:
1. Register a provider with `registerTelemetryUploader(uploadFn)` in `onlineService.js`.
2. Call `uploadTelemetryBatch()` to flush buffered events.
3. The queue clears on successful upload callback resolution.

## KPI baseline script

Use the aggregation script to compute balancing baselines:

```bash
node scripts/telemetry/aggregateTelemetry.js ./telemetry-sample.json
```

Expected input: JSON array of telemetry events.

Output fields:
- `medianRunLengthMs`: median of `run_end.runTimeMs`
- `firstBossReachRate`: distinct runs with `boss_outcome=cleared` / distinct `run_start`
- `challengeSuccessRate`: successful challenge outcomes / total challenge outcomes

## Dashboard metrics (balancing)

Recommended dashboard cards:
- Run funnel: starts, voluntary exits, deaths.
- Median run length (overall and by phase reached).
- First boss reach/clear rate.
- Death-source distribution by content ID/texture.
- Pickup usage rates and pickup-to-survival correlation.
- Challenge spawn frequency, response latency, success rate by challenge type.
- Objective completion and reward-claim rates by objective ID.

