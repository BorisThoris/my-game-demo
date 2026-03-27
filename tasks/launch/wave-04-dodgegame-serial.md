# Wave 04 — `dodgeGame.js` and related gameplay (serial)

**Do not pass this file to `launch_task_agents.sh`.** It has no `` `AGENT-XX` `` table rows on purpose.

`dodgeGame.js` must have **at most one** active agent. Use **[`serial/README.md`](./serial/README.md)** — run the launch script **once per file**, merge to `main`, rebase other worktrees, then run the next file.

Suggested merge order (also listed in `serial/`):

1. Game-over / meta framing before next-unlock hint (**04 → 03**).
2. Contracts, achievements, PB, risk pickup (**01, 02, 05, 06**).
3. Meta systems (**07–09**).
4. HUD, session/restart, UI trim, tips (**16, 17, 19, 10**).
5. Lean QA (**20**).
6. Content / feel passes (**41, 42, 43**), after **40** (doc) is merged from wave 01.

```bash
./scripts/agents/launch_task_agents.sh --tasks-file tasks/launch/serial/01-agent-04.md --dry-run
```
