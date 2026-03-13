# Multi-agent runbook (task list kickoff)

This runbook starts parallel execution for each task in `list.md`.

## Quick start (copy/paste)

From repo root:

```bash
npm run agents:plan
npm run agents:launch
```

If you prefer direct script execution:

```bash
./scripts/agents/launch_task_agents.sh --dry-run
./scripts/agents/launch_task_agents.sh
```

## What those commands do

- `agents:plan` shows what will be created (no repo mutation).
- `agents:launch` creates one branch + one git worktree per task row in `list.md`.
- Worktrees are created under `.agents/`.

Default behavior:
- Reads task ids from markdown rows in `list.md` (`| `taskId` | ... |`)
- Creates branches named `agent/<task-id-slug>`
- Creates git worktrees under `.agents/<task-id-slug>`

Example override:

```bash
scripts/agents/launch_task_agents.sh \
  --tasks-file list.md \
  --base-branch work \
  --prefix feature \
  --workspace .agents
```

## 2) Agent handoff template

For each worktree:
1. Open `.agents/<task-id-slug>`
2. Implement one task only
3. Run targeted tests
4. Commit using message: `feat(task:<task-id>): <summary>`
5. Push and open PR

## 3) How to work inside an agent worktree

Example for task `replay`:

```bash
cd .agents/replay
git branch --show-current
```

You should see branch `agent/replay`.

When done:

```bash
git add -A
git commit -m "feat(task:replay): <summary>"
```

## 4) Merge order

1. Shared asset generators/utilities
2. Scene/runtime wiring
3. UI polish and balancing
4. Tests/docs

This keeps conflict probability low while parallelizing independent tasks.

## 5) Cleanup worktrees (optional)

```bash
git worktree list
git worktree remove .agents/replay
git branch -D agent/replay
```
