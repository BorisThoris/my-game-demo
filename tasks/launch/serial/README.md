# Serial batches — one `launch_task_agents.sh` run per file

Each file below contains **exactly one** `` `AGENT-XX` `` row so the script never spawns two dodgeGameplay agents at once.

Run from repo root (Git Bash / WSL):

```bash
./scripts/agents/launch_task_agents.sh --tasks-file tasks/launch/serial/01-agent-04.md
```

**Merge that branch to `main`, rebase other worktrees, then** open the next file.

## Merge order — gameplay / feel (`dodgeGame.js` chain)

| Order | File | Agent |
|-------|------|--------|
| 1 | [`01-agent-04.md`](./01-agent-04.md) | 04 game-over meta framing |
| 2 | [`02-agent-03.md`](./02-agent-03.md) | 03 next-unlock hint |
| 3 | [`03-agent-01.md`](./03-agent-01.md) | 01 contracts |
| 4 | [`04-agent-02.md`](./04-agent-02.md) | 02 achievements |
| 5 | [`05-agent-05.md`](./05-agent-05.md) | 05 personal best |
| 6 | [`06-agent-06.md`](./06-agent-06.md) | 06 risk pickup |
| 7 | [`07-agent-07.md`](./07-agent-07.md) | 07 meta nodes |
| 8 | [`08-agent-08.md`](./08-agent-08.md) | 08 daily modifier |
| 9 | [`09-agent-09.md`](./09-agent-09.md) | 09 perk tags / feats |
| 10 | [`10-agent-16.md`](./10-agent-16.md) | 16 HUD clarity |
| 11 | [`11-agent-17.md`](./11-agent-17.md) | 17 session / restart |
| 12 | [`12-agent-19.md`](./12-agent-19.md) | 19 UI trim / game over options |
| 13 | [`13-agent-10.md`](./13-agent-10.md) | 10 post-run tips |
| 14 | [`14-agent-20.md`](./14-agent-20.md) | 20 QA regression (lean capstone) |
| 15 | [`15-agent-41.md`](./15-agent-41.md) | 41 balance / pacing |
| 16 | [`16-agent-42.md`](./16-agent-42.md) | 42 audio production |
| 17 | [`17-agent-43.md`](./17-agent-43.md) | 43 visual readability |

Agent **40** is doc-first and ships from [`../wave-01-docs-and-checklists.md`](../wave-01-docs-and-checklists.md); merge it before **41–43** when possible.

Coordinate **09** with **02** if both touch achievement-adjacent hooks.

See **[`../PARALLEL_EXECUTION.md`](../PARALLEL_EXECUTION.md)** and **[`../COLLISION_MATRIX.md`](../COLLISION_MATRIX.md)**.
