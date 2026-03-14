#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <remote> <base-branch> <task-branch> [<task-branch> ...]" >&2
  echo "Example: $0 origin work feature/task-1 feature/task-2" >&2
  exit 1
fi

REMOTE="$1"
BASE_BRANCH="$2"
shift 2
TASK_BRANCHES=("$@")

if ! git rev-parse --verify "$BASE_BRANCH" >/dev/null 2>&1; then
  echo "Base branch '$BASE_BRANCH' not found locally." >&2
  exit 1
fi

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "Remote '$REMOTE' is not configured." >&2
  exit 1
fi

echo "==> Fetching '$REMOTE'"
git fetch "$REMOTE"

echo "==> Checking out '$BASE_BRANCH'"
git checkout "$BASE_BRANCH"

for BRANCH in "${TASK_BRANCHES[@]}"; do
  REF="$REMOTE/$BRANCH"
  if ! git rev-parse --verify "$REF" >/dev/null 2>&1; then
    echo "Missing ref: $REF" >&2
    exit 1
  fi

  echo "==> Merging $REF"
  if ! git merge --no-ff "$REF" -m "Merge $REF into $BASE_BRANCH"; then
    echo "Merge conflict while merging $REF." >&2
    echo "Resolve conflicts, then run: git add -A && git commit" >&2
    exit 2
  fi

  echo "==> Running tests"
  npm test

done

if rg -n "^(<<<<<<<|=======|>>>>>>>)"; then
  echo "Conflict markers still present after merge." >&2
  exit 3
fi

echo "==> Done. All branches merged into '$BASE_BRANCH' with tests passing."
