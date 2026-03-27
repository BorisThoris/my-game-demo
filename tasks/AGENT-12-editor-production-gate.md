# AGENT-12 — Editor scene production gate (safe strip)

## Role
Build / tooling engineer.

## Objective
Ensure **player/shipping** builds do not register `EditorScene` or respond to `#/editor`, while **dev** keeps full access. Use `import.meta.env.DEV`, `import.meta.env.PROD`, or a `VITE_ENABLE_EDITOR=true` env flag.

## Implementation steps
1. In `app/index.js`, conditionally include `EditorScene` in the `scene` array.
2. Gate `hashchange` listener for `#/editor` the same way.
3. Document in `package.json` scripts or a one-line comment at top of `index.js`.
4. If e2e tests need editor, run tests with flag on in CI config.

## Acceptance criteria
- [ ] `vite build` + preview: `#/editor` does nothing harmful (no crash, no scene).
- [ ] `vite` dev: editor still reachable.
- [ ] Electron build story documented if different (grep `electron/`).

## Key files
- `app/index.js`
- `vite.config.js` (if `define` needed)
- `e2e/*.spec.js` (if editor tested)
