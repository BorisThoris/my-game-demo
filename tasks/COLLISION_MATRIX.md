# Agent × hot file collision matrix

**Legend:** ● = almost always touches; ◐ = sometimes; ○ = rare/none.  
**Rule:** Two agents with ● on the same file → **not parallel** without coordination.

| Agent | dodgeGame | saveManager | mainMenu | options | index.js | onlineService | electron |
|-------|-----------|-------------|----------|---------|----------|---------------|----------|
| 01 | ◐ | ○ | ○ | ○ | ○ | ○ | ○ |
| 02 | ● | ○ | ○ | ○ | ○ | ○ | ○ |
| 03 | ◐ | ○ | ○ | ◐ | ○ | ○ | ○ |
| 04–06,10,16,19 | ● | ○ | ○ | ◐ | ○ | ○ | ○ |
| 07–09 | ● | ○ | ○ | ○ | ○ | ○ | ○ |
| 11 | ○ | ◐ | ○ | ○ | ● | ○ | ○ |
| 12 | ○ | ○ | ○ | ○ | ● | ○ | ○ |
| 13 | ◐ | ○ | ○ | ○ | ○ | ● | ○ |
| 14–15 | ● | ◐ | ● | ○ | ○ | ○ | ○ |
| 23 | ○ | ● | ○ | ○ | ○ | ◐ | ○ |
| 24 | ◐ | ● | ○ | ● | ◐ | ○ | ○ |
| 25–26 | ○ | ● | ● | ○ | ○ | ○ | ○ |
| 27 | ● | ● | ○ | ● | ○ | ○ | ○ |
| 28 | ○ | ○ | ● | ○ | ◐ | ● | ○ |
| 29–30 | ◐ | ● | ● | ● | ○ | ● | ○ |
| 31–33,32 | ● | ● | ◐ | ● | ○ | ○ | ○ |
| 21–22 | ◐ | ◐ | ○ | ○ | ● | ● | ● |
| 34 | ○ | ○ | ○ | ◐ | ○ | ○ | ○ |
| 36–39 | ● | ○ | ● | ● | ● | ○ | ○ |
| 40–54 | varies | ◐ | ◐ | ◐ | ○ | ○ | ◐ |

**Docs-only (no code hot spots):** **18, 35, 40, 44** (if checklist-only), **45** (notes), **50, 51, 53, 54** (primarily docs)—safe to parallel with each other.

**When in doubt:** grep `AGENT-NN` scope in the task file, then `rg pattern app/` before parallelizing.
