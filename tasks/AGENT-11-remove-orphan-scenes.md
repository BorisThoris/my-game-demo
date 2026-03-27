# AGENT-11 — Remove orphan scenes (safe strip)

## Role
Repo hygiene engineer.

## Objective
Delete **unused** Phaser scenes not registered in `app/index.js`: `beginningScene.js`, `choiceScene.js`, `introductionScene.js`, `websitesScene.js`, `navigationScene.js`. Clean `app/config/sceneKeys.js` and **any** stray imports. Verify with full-repo search.

## Pre-flight
```bash
rg "beginningScene|choiceScene|introductionScene|websitesScene|navigationScene|introScene" --glob "*.js"
```

## Implementation steps
1. Confirm zero references from `mainMenuScene`, `dodgeGame`, `loadingScene`, tests, `electron/`.
2. Delete the five scene files (adjust list if any still referenced).
3. Remove dead keys from `SCENE_KEYS`.
4. Remove `shared/` or portfolio helpers only if exclusively used by deleted scenes (grep first).
5. Run `npm test` and `npm run test:e2e`.

## Acceptance criteria
- [x] Game boots: Loading → Main Menu → Play unchanged.
- [x] No broken imports; Vite build succeeds.
- [x] `sceneKeys.js` has no keys pointing to deleted scenes.

## Do not delete
- `ChallengeDirector` / challenge flow (product constraint).
- `EditorScene` (handled by AGENT-12).

## Key files
- `app/scenes/*.js` (deletions)
- `app/config/sceneKeys.js`
