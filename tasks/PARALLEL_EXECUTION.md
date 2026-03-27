# Parallel execution — many chats, minimal collisions

Use this with **git worktrees** (one per chat) and **merge waves** so multiple Cursor agents can run at once without stomping the same files.

**Prerequisites:** [`MULTI_AGENT_TASK_RUNBOOK.md`](../MULTI_AGENT_TASK_RUNBOOK.md) — `scripts/agents/launch_task_agents.sh`  
**Task index:** [`README.md`](./README.md)

---

## 1. Rules (non-negotiable)

| Rule | Why |
|------|-----|
| **One agent ↔ one branch ↔ one worktree** | Isolates unmerged work. |
| **One chat owns one `AGENT-XX` task** | Clear accountability and commit messages. |
| **Do not parallel two agents on [`dodgeGame.js`](../app/scenes/dodgeGame.js)** | Highest conflict surface; serialize or merge between chats. |
| **Merge docs-only waves first** | Flushes low-risk PRs and updates truth for everyone. |
| **Rebase worktree on `main` before merge** | Reduces surprise conflicts. |

---

## 2. Hot files (serialize or assign one owner per wave)

Touch these in **at most one active agent** per wave:

| File / area | Typical agents |
|-------------|----------------|
| `app/scenes/dodgeGame.js` | 01, 02, 04–06, 10, 16, 19, 32, 41, 43, 46, 48… |
| `app/save/saveManager.js` | 23, 25, 27, 29, 47, 49… |
| `app/scenes/mainMenuScene.js` | 26, 28, 30, 37, 44 (links)… |
| `app/scenes/optionsScene.js` | 19, 24, 27, 29, 31, 37, 46, 47… |
| `app/index.js` | 12, 21, 22, 47… |
| `app/services/onlineService.js` | 13, 22, 28, 30… |
| `electron/*` | 21, 22, 49… |

See **[`COLLISION_MATRIX.md`](./COLLISION_MATRIX.md)** for agent × file hints.

---

## 3. Launch waves (max parallel chats)

Each file under [`launch/`](./launch/) is a **batch** of backtick task ids for:

```bash
./scripts/agents/launch_task_agents.sh --tasks-file tasks/launch/<file>.md --dry-run
./scripts/agents/launch_task_agents.sh --tasks-file tasks/launch/<file>.md
```

| Wave file | Parallel chats | Merge order |
|-----------|----------------|-------------|
| [`launch/wave-01-docs-and-checklists.md`](./launch/wave-01-docs-and-checklists.md) | **10** | First (any order) |
| [`launch/wave-02-isolated-small-code.md`](./launch/wave-02-isolated-small-code.md) | **4** | After wave 01 |
| [`launch/wave-03-deletions-and-gates.md`](./launch/wave-03-deletions-and-gates.md) | **1** | After 02; **11** before heavy `dodgeGame` work |
| [`launch/wave-03b-agent-14-optional.md`](./launch/wave-03b-agent-14-optional.md) / [`launch/wave-03c-agent-15-optional.md`](./launch/wave-03c-agent-15-optional.md) | **1** each | Optional strips (product approval) |
| [`launch/wave-04-dodgegame-serial.md`](./launch/wave-04-dodgegame-serial.md) | **n/a** (instructions) | Then [`launch/serial/`](./launch/serial/) — **one file per merge** |
| [`launch/wave-05-save-platform-online.md`](./launch/wave-05-save-platform-online.md) | **2** | After dodge serial chunk stable |
| [`launch/wave-05b-electron-ipc.md`](./launch/wave-05b-electron-ipc.md) → [`launch/wave-05c-steamworks.md`](./launch/wave-05c-steamworks.md) | **1** each | **21** before **22** |
| [`launch/wave-05d-save-merge.md`](./launch/wave-05d-save-merge.md) → [`launch/wave-05e-currency.md`](./launch/wave-05e-currency.md) → [`launch/wave-05f-progression-menu.md`](./launch/wave-05f-progression-menu.md) | **1** each | Serialize **23 → 25 → 26** on `saveManager` / menu |
| [`launch/wave-06-ui-scenes.md`](./launch/wave-06-ui-scenes.md) | **n/a** (instructions) | [`launch/ui-serial/`](./launch/ui-serial/) — **one file per merge** |
| [`launch/wave-07-ship-quality.md`](./launch/wave-07-ship-quality.md) | **2** | **36** + **49** (near end) |
| [`launch/wave-07b-localization.md`](./launch/wave-07b-localization.md) / [`launch/wave-07c-performance-min-spec.md`](./launch/wave-07c-performance-min-spec.md) | **1** each | Broad strings / perf — usually after UI settles |

**Coverage:** all **54** agents appear exactly once across the waves above, except optional **14** / **15** (only if approved). If you skip optional strips, you still have a complete map from [`README.md`](./README.md).

---

## 4. Open a chat (copy-paste template)

Use **[`CHAT_OPENER_TEMPLATE.md`](./CHAT_OPENER_TEMPLATE.md)**.

Minimal inline version:

```
You are implementing ONLY tasks/AGENT-NN-*.md.
Work in worktree: .agents/<slug> on branch agent/<slug>.
Do not edit files outside the task scope; do not pick up other agents' work.
Commit: feat(agent-NN): <summary>
When done, push branch and stop.
```

---

## 5. Merge strategy

1. **Merge wave 01** → `main` (docs/checklists).
2. **Rebase** active worktrees:  
   `git -C .agents/<slug> fetch origin && git -C .agents/<slug> rebase origin/main`
3. **Merge wave 02**, then **03** (deletes/gates before big gameplay edits).
4. **Wave 04:** walk [`launch/serial/`](./launch/serial/) — merge **one** PR per file, rebase other worktrees, then the next file.
5. **Waves 05–05f** as in the table (serialize **21 → 22** and **23 → 25 → 26**).
6. **Wave 06:** walk [`launch/ui-serial/`](./launch/ui-serial/) the same way.
7. **Wave 07** (+ **07b** / **07c** as needed); run **`npm test` + `npm run test:e2e`** on `main` after each wave if possible.

---

## 6. If two agents collide

1. Prefer **splitting** the task: one owns `dodgeGame.js`, one owns `contractDirector.js` (coordinate in PR comments).
2. Otherwise **abort** one worktree, merge the other, re-run second agent on fresh `main`.

---

## 7. Optional strips (`BACKLOG-OPTIONAL-STRIPS`)

**Never** parallel with gameplay waves on the same files. Run **after** `main` is stable or dedicate **one** agent + **one** worktree.

---

## Related

- [`CHAT_OPENER_TEMPLATE.md`](./CHAT_OPENER_TEMPLATE.md)  
- [`COLLISION_MATRIX.md`](./COLLISION_MATRIX.md)  
- [`launch/README.md`](./launch/README.md)
