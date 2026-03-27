# Dev editor route (`#/editor`)

## Status (Path B — deferred)

The **#/editor** route is a **development-only** stub. There is no production editor MVP yet. Planned tools (e.g. procedural texture export, hazard palette preview) are tracked under [`tasks/AGENT-39-editor-mvp-or-defer.md`](../tasks/AGENT-39-editor-mvp-or-defer.md).

## How to open (dev only)

1. `npm run dev`
2. Open `http://localhost:5173/#/editor` (or your dev port).

Shipping builds (`npm run build`, Electron packaged app) **do not** register `EditorScene` or listen for `#/editor`; loading always continues to the main menu even if the hash is present (**AGENT-12**).

## Related

- [`tasks/AGENT-12-editor-production-gate.md`](../tasks/AGENT-12-editor-production-gate.md) — prod gate.
