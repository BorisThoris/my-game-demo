# AGENT-21 — Electron IPC bridge (gap §2.1)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §2.1 — preload only exposes `electronQuit`; no bridge for Steam, paths, or window APIs.

## Objective
Extend [`electron/preload.js`](../electron/preload.js) with a **minimal, secure** `contextBridge` API surface and matching [`electron/main.js`](../electron/main.js) `ipcMain` handlers. **Do not** enable `nodeIntegration` in the renderer.

## Deliverables
1. **API design** — e.g. `window.skyfallElectron = { quit, platform, getUserDataPath? }` (only what you need for AGENT-22/23).
2. **IPC handlers** — validate channels; reject unknown messages.
3. **Renderer detection** — `typeof window.skyfallElectron !== "undefined"` for Electron vs browser.
4. **Docs** — short comment block in `preload.js` listing extension points for native Steam module.

## Acceptance criteria
- [ ] Browser build unchanged (no `window.skyfallElectron` or safe no-op).
- [ ] Electron dev + prod: quit still works; new APIs covered by smoke test or manual checklist.
- [ ] No raw `ipcRenderer` exposure to the page.

## Out of scope
Implementing Steam native bindings (AGENT-22).

## Dependencies
Before **AGENT-22** if Steam runs in main process.
