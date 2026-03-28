# Session fit and restart (game over)

**Task:** [`tasks/AGENT-17-session-restart-audit.md`](../tasks/AGENT-17-session-restart-audit.md)

## Player path: death → playing again

1. Run ends; game-over UI appears (summary + buttons). No blocking modal outside the scene.
2. **One action to restart:**
   - Click **Replay** / play-again control, or
   - Press **R** or **Space** while `gameOverState === "ended"` (same as `resetRun()`).

`resetRun()` clears game-over UI, resets run state, and does not route through the meta scene.

## Pause / ESC

- **ESC** opens pause only when the run is active (`gameOverState === false`) and other gates (challenge UI, get-ready, etc.) allow it — avoids fighting the game-over overlay.
- Intentional friction: players see the end-of-run summary on screen before replay; there is no extra “are you sure” step.

## Edge cases

- Restart is not offered during `activeChallenge` or `pendingPerkChoices` in the same way as mid-run pause; those flows complete first. Game over sets `gameOverState` to `"ended"` after normal death flow.
