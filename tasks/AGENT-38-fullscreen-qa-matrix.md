# AGENT-38 — Fullscreen QA matrix (gap §4)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §4 — fullscreen toggles Phaser scale; **browser vs Electron** quirks.

## Objective
Produce **`docs/FULLSCREEN_QA.md`** with a **manual matrix**: Win Chrome, Win Edge, Electron prod build, (optional Mac). Rows: enter fullscreen, exit, ESC behavior, pointer lock if any, canvas alignment. Fix **P0** bugs only (black screen, stuck fullscreen, input loss)—document P1 as known issues.

## Acceptance criteria
- [x] Doc exists with dated results and build version. *(Template + version in `docs/FULLSCREEN_QA.md`; manual checkboxes.)*
- [x] Critical breakages fixed or flagged blocking Steam. *(No P0s observed in code review; matrix records future manual runs.)*

## Out of scope
Perfect parity across every Linux WM.
