# AGENT-37 — About, privacy, support surfaces (gap §9)

## Source
[`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](../docs/GAP_ANALYSIS_BEYOND_TASKS.md) §9 — privacy disclosure for telemetry; in-game About; Steam support expectations.

## Objective
1. **About** modal or scene section: game name, `GAME_VERSION`, link placeholders `https://` for **Support**, **Privacy**, **Store** (replace with real URLs before ship).
2. Wire **Privacy** link from **AGENT-29** telemetry copy to same URL.
3. Optional: **“Report a bug”** mailto or GitHub issues link for non-Steam builds.

## Acceptance criteria
- [x] No broken `href="#"` without visible “coming soon” if URLs unset.
- [x] Options or main menu reachable path to About in ≤3 clicks.

## Key files
- New small scene or `optionsScene` subsection
- [`app/config/version.js`](../app/config/version.js)
