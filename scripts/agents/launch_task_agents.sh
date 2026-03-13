#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Launch one git worktree + branch per task id from a markdown table.

Usage:
  scripts/agents/launch_task_agents.sh [options]

Options:
  --tasks-file <path>   Markdown file to parse task ids from (default: list.md)
  --base-branch <name>  Base branch for new branches (default: current branch)
  --prefix <name>       Branch prefix (default: agent)
  --workspace <path>    Directory where worktrees are created (default: .agents)
  --dry-run             Print planned actions without creating branches/worktrees
  -h, --help            Show this help

Task parsing:
  Reads markdown table rows like:
    | `taskId` | ... |
USAGE
}

TASKS_FILE="list.md"
BASE_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
BRANCH_PREFIX="agent"
WORKSPACE_DIR=".agents"
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tasks-file)
      TASKS_FILE="$2"
      shift 2
      ;;
    --base-branch)
      BASE_BRANCH="$2"
      shift 2
      ;;
    --prefix)
      BRANCH_PREFIX="$2"
      shift 2
      ;;
    --workspace)
      WORKSPACE_DIR="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ ! -f "$TASKS_FILE" ]]; then
  echo "Tasks file not found: $TASKS_FILE" >&2
  exit 1
fi

mapfile -t TASK_IDS < <(sed -n 's/^|[[:space:]]*`\([^`][^`]*\)`[[:space:]]*|.*/\1/p' "$TASKS_FILE")

if [[ ${#TASK_IDS[@]} -eq 0 ]]; then
  echo "No task ids found in $TASKS_FILE" >&2
  exit 1
fi

mkdir -p "$WORKSPACE_DIR"

echo "Base branch: $BASE_BRANCH"
echo "Task file: $TASKS_FILE"
echo "Workspace: $WORKSPACE_DIR"
echo

for task_id in "${TASK_IDS[@]}"; do
  slug="$(echo "$task_id" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-')"
  slug="${slug#-}"
  slug="${slug%-}"

  branch_name="${BRANCH_PREFIX}/${slug}"
  worktree_path="${WORKSPACE_DIR}/${slug}"

  echo "Task: ${task_id}"
  echo "  branch:   ${branch_name}"
  echo "  worktree: ${worktree_path}"

  if [[ $DRY_RUN -eq 1 ]]; then
    continue
  fi

  if git show-ref --verify --quiet "refs/heads/${branch_name}"; then
    echo "  note: branch already exists locally"
  fi

  if [[ -d "$worktree_path/.git" || -f "$worktree_path/.git" ]]; then
    echo "  note: worktree already exists, skipping"
    continue
  fi

  git worktree add -B "$branch_name" "$worktree_path" "$BASE_BRANCH"
  echo "  created"
  echo
done
