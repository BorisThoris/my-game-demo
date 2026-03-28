# AGENT-49 — CI/CD & release engineering (fully fledged §J)

## Source
[`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md) axis **J**.

## Objective
1. **CI** — GitHub Actions (or chosen host): on PR/push — `npm test`, `npm run build`, optionally `npm run test:e2e` (headless Chromium).
2. **Version** — single source: `GAME_VERSION` / `package.json` sync ritual in `docs/RELEASE.md`.
3. **Artifacts** — `electron-builder` output naming; **changelog** `CHANGELOG.md` (Keep a Changelog style).
4. **Signing** — document **Windows code signing** steps (cert, `signtool`); implement if cert available, else **“unsigned build”** warning in release doc.

## Acceptance criteria
- [x] Green CI on default branch for **test + build**.
- [x] `docs/RELEASE.md` — **one page** “how to ship 1.x.y”.

## Out of scope
Mac notarization unless you scope it in the same doc as future work.
