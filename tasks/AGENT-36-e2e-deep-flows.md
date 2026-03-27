# AGENT-36 — E2E deep flows (gap §8, epic 6)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §8 — Playwright only smoke; no challenge / game over / meta / contracts path.

## Objective
Extend [`e2e/`](../e2e/) with **stable** tests (prefer `data-testid` or deterministic hooks):
1. **Menu → Play → die** — assert game over text or replay control appears.
2. **Options** — change music volume; reload or revisit and assert persisted (read `localStorage` key for save).
3. **Achievements** — open scene from options; assert list renders.
4. **Challenge keys** — if feasible without flakiness: trigger challenge and press `Digit1` (may need fixed seed or cheat flag—**if too flaky**, document skip and add unit test instead).

## Acceptance criteria
- [ ] `npm run test:e2e` green in CI.
- [ ] Each test file has comment on flakiness mitigations (timeouts, selectors).

## Dependencies
Run after **AGENT-20** batch or on integration branch; coordinate with **AGENT-04/19** if game-over DOM changes.
