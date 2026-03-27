#!/usr/bin/env bash
# Create worktrees for every Skyfall launch batch (instruction-only waves skipped).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

run() {
  ./scripts/agents/launch_task_agents.sh --tasks-file "$1"
}

WAVES=(
  tasks/launch/wave-01-docs-and-checklists.md
  tasks/launch/wave-02-isolated-small-code.md
  tasks/launch/wave-03-deletions-and-gates.md
  tasks/launch/wave-03b-agent-14-optional.md
  tasks/launch/wave-03c-agent-15-optional.md
  tasks/launch/wave-05-save-platform-online.md
  tasks/launch/wave-05b-electron-ipc.md
  tasks/launch/wave-05c-steamworks.md
  tasks/launch/wave-05d-save-merge.md
  tasks/launch/wave-05e-currency.md
  tasks/launch/wave-05f-progression-menu.md
  tasks/launch/wave-07-ship-quality.md
  tasks/launch/wave-07b-localization.md
  tasks/launch/wave-07c-performance-min-spec.md
)

for f in "${WAVES[@]}"; do
  echo "=== $f ==="
  run "$f"
done

shopt -s nullglob
for f in tasks/launch/serial/??-agent-*.md; do
  echo "=== $f ==="
  run "$f"
done
for f in tasks/launch/ui-serial/??-agent-*.md; do
  echo "=== $f ==="
  run "$f"
done

echo "launch_all_waves: done"
