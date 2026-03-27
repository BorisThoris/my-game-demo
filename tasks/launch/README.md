# Launch wave files (for `launch_task_agents.sh`)

Each markdown file lists **task ids** in table cells with backticks:

```markdown
| `AGENT-18` | Tier C deferrals doc |
```

The script extracts **every** `` `...` `` token on lines that look like table rows (`| ... |`). **Only put multiple ids in one file if those agents may run in parallel** (see [`../COLLISION_MATRIX.md`](../COLLISION_MATRIX.md)).

## Layout

| Path | Role |
|------|------|
| [`wave-01-docs-and-checklists.md`](./wave-01-docs-and-checklists.md) | Max parallel — docs / checklists |
| [`wave-02-isolated-small-code.md`](./wave-02-isolated-small-code.md) | Small isolated code |
| [`wave-03-deletions-and-gates.md`](./wave-03-deletions-and-gates.md) | Orphan scene cleanup |
| [`wave-03b-agent-14-optional.md`](./wave-03b-agent-14-optional.md) / [`wave-03c-agent-15-optional.md`](./wave-03c-agent-15-optional.md) | Optional strips (approval) |
| [`wave-04-dodgegame-serial.md`](./wave-04-dodgegame-serial.md) | **Read me first** — no rows for the script |
| [`serial/`](./serial/) | **One agent per file** — `dodgeGame.js` chain + **41–43** |
| [`wave-05-save-platform-online.md`](./wave-05-save-platform-online.md) | Online audit + display truth |
| [`wave-05b-electron-ipc.md`](./wave-05b-electron-ipc.md) … [`wave-05f-progression-menu.md`](./wave-05f-progression-menu.md) | Platform / save serialization |
| [`wave-06-ui-scenes.md`](./wave-06-ui-scenes.md) | **Read me first** — no rows for the script |
| [`ui-serial/`](./ui-serial/) | **One agent per file** — menus / input / telemetry |
| [`wave-07-ship-quality.md`](./wave-07-ship-quality.md) | E2E + CI |
| [`wave-07b-localization.md`](./wave-07b-localization.md) / [`wave-07c-performance-min-spec.md`](./wave-07c-performance-min-spec.md) | i18n / perf |

## Commands

From repo root (Git Bash or WSL):

```bash
./scripts/agents/launch_task_agents.sh --tasks-file tasks/launch/wave-01-docs-and-checklists.md --dry-run
./scripts/agents/launch_task_agents.sh --tasks-file tasks/launch/wave-01-docs-and-checklists.md
```

Worktrees: **`.agents/<slug>`** (see [`../MULTI_AGENT_TASK_RUNBOOK.md`](../../MULTI_AGENT_TASK_RUNBOOK.md)).

Merge waves: **[`../PARALLEL_EXECUTION.md`](../PARALLEL_EXECUTION.md)**. Chat prompt: **[`../CHAT_OPENER_TEMPLATE.md`](../CHAT_OPENER_TEMPLATE.md)**.
