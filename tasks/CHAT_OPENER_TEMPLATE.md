# Chat opener template (paste into each Cursor chat)

Replace `NN` with the agent number (e.g. `18`) and `<slug>` with the worktree folder name (e.g. `agent-18`).

---

## System / first message

You are a coding agent working **only** on **Skyfall** task **AGENT-NN**.

**Scope**
- Read and follow **`tasks/AGENT-NN-*.md`** exactly. Do not implement other AGENT tasks.
- Prefer **minimal diffs**; do not refactor unrelated code.

**Workspace**
- If using a git worktree, your root is **`../.agents/<slug>`** or the path the human gives you.
- Branch should be **`agent/agent-nn`** (or the branch created by `launch_task_agents.sh`).

**Conflicts**
- **Do not edit** `app/scenes/dodgeGame.js` unless your task file explicitly requires it—and if another agent might touch it, ask the human to confirm merge order.
- See **`tasks/COLLISION_MATRIX.md`** for hot files.

**Finish**
- Run **`npm test`** (and task-specific commands from the AGENT file).
- Commit: **`feat(agent-NN): <short summary>`**
- Push; open or update PR; list files changed.

**Task brief:** @tasks/AGENT-NN-*.md

---

## One-liner variant

`Implement only tasks/AGENT-NN-*.md in this worktree; branch agent/agent-nn; feat(agent-NN): message; avoid dodgeGame.js unless required.`
