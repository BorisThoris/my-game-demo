# UI / scene serial batches — one launch run per file

Use when **`mainMenuScene.js`**, **`optionsScene.js`**, or **`onlineService.js`** would otherwise get two agents at once.

```bash
./scripts/agents/launch_task_agents.sh --tasks-file tasks/launch/ui-serial/01-agent-28.md
```

Merge, rebase, then continue.

## Suggested order

| Order | File | Agent | Note |
|-------|------|--------|------|
| 1 | [`01-agent-28.md`](./01-agent-28.md) | 28 | Leaderboard UI — ideal after Steam/online baseline |
| 2 | [`02-agent-30.md`](./02-agent-30.md) | 30 | Offline adapter honesty |
| 3 | [`03-agent-27.md`](./03-agent-27.md) | 27 | Key rebinding (touches dodge + options) |
| 4 | [`04-agent-46.md`](./04-agent-46.md) | 46 | Gamepad / Steam Input — after 27 |
| 5 | [`05-agent-31.md`](./05-agent-31.md) | 31 | Accessibility presentation |
| 6 | [`06-agent-32.md`](./06-agent-32.md) | 32 | Audio load failure UX |
| 7 | [`07-agent-33.md`](./07-agent-33.md) | 33 | Tutorial / onboarding |
| 8 | [`08-agent-29.md`](./08-agent-29.md) | 29 | Telemetry upload + privacy UI |
| 9 | [`09-agent-37.md`](./09-agent-37.md) | 37 | About / privacy / support |

If **AGENT-36** (e2e) is running, prefer merging volatile UI passes first, then deep e2e updates.

See **[`../PARALLEL_EXECUTION.md`](../PARALLEL_EXECUTION.md)**.
