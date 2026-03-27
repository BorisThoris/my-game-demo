# AGENT-39 — Editor: real MVP or explicit deferral (gap §4)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §4 — [`editorScene.js`](../app/scenes/editorScene.js) is placeholder; **AGENT-12** only gates prod.

## Objective (product choice)
**Path A — MVP:** Implement **one** useful tool (e.g. export procedural texture params JSON, or preview hazard palette) so `#/editor` justifies existence in dev builds.

**Path B — Defer:** Replace placeholder copy with **“Editor deferred — see issue #…”** and remove from public roadmap docs; keep route for future.

## Acceptance criteria
- [x] Path stated in PR; no infinite placeholder without plan. *(**Path B — defer**; copy in `editorScene.js`.)*
- [x] If MVP: documented how to use in `docs/EDITOR.md` (short). *(Defer doc: `docs/EDITOR.md`.)*

## Dependencies
**AGENT-12** for prod gate remains relevant.
