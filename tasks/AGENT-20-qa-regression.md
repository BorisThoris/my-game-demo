# AGENT-20 — QA regression gate (final)

## Role
QA / release engineer.

## Objective
After other agents merge (or on a integration branch), run full automated tests, manual smoke, and update checklists. **Run last** in a 20-agent wave.

## Commands
```bash
npm test
npm run test:e2e
npm run build
```

## Manual smoke (15 min)
- [ ] Main menu → each remaining mode → death → restart → meta claim path
- [ ] Challenge: math or logic beat completes; perk draft 1/2/3 works
- [ ] Contract daily progress + claim on menu if applicable
- [ ] Achievements scene opens; new achievements unlock smoke test
- [ ] Production build: editor gated per AGENT-12
- [ ] Mobile or narrow viewport: HUD visible

## Implementation steps
1. Fix failures introduced by tasks 01–19 (or file bugs).
2. If e2e flaky, stabilize selectors (data-testid) minimally.
3. Optional: add one e2e assertion for “meta line visible on game over” if AGENT-04 landed.

## Acceptance criteria
- [ ] `npm test` exit 0
- [ ] `npm run test:e2e` exit 0
- [ ] `npm run build` exit 0
- [ ] Short note in PR or `tasks/README.md` “QA wave complete”

## Dependencies
**Blocks on:** merge or rebase of all intended task branches; run on consolidated branch.
