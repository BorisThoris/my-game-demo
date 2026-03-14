# Conflict Resolution & Merge Plan (Task PRs)

I inspected this local repository and found that there are currently no additional local/remote branches configured beyond `work`, so I cannot directly merge task PR branches in this environment yet.

## What I checked

- Verified current branch and history.
- Checked all local/remote branches.
- Checked configured remotes.
- Scanned for unresolved merge conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).

## Current status in this repo snapshot

- Only branch present: `work`
- No Git remote configured (`git remote -v` is empty)
- No unresolved conflict markers in files

Because the PR refs/branches are not present in this checkout, an actual merge operation cannot be executed here yet.

---

## Fast path to unblock and let me merge conflicts for you

If you provide PR branch refs (or add a remote), I can resolve and merge in one pass.

### Option A — add/fetch remote branches

1. Add remote:
   - `git remote add origin <repo-url>`
2. Fetch PR branches:
   - `git fetch origin`
3. Share target branches to merge (example):
   - `feature/task-1`
   - `feature/task-2`
   - `feature/task-3`

### Option B — provide patch files

1. Export each PR as patch (`.patch`) and place in repo.
2. Apply in sequence:
   - `git am 0001.patch`
   - `git am 0002.patch`
3. I resolve any conflicts and complete merge commit(s).

---

## Deterministic merge order (recommended)

To reduce conflicts and rework:

1. **Data contracts first**
   - Save schema, config constants, type/shared interfaces.
2. **Core runtime logic**
   - Dodge game runtime, spawn/challenge/objective directors.
3. **UI scenes**
   - Main menu/options/credits/new panels.
4. **Online integrations**
   - Achievements/leaderboards/telemetry adapters.
5. **Tests + docs**
   - Update snapshots/tests after functional merge settles.

---

## Conflict resolution policy I will apply

1. Keep existing stable runtime behavior unless PR introduces intentional replacement.
2. Prefer additive composition over deleting features from either side.
3. Preserve backward compatibility for save files (migration guards required).
4. Normalize scene key usage through `app/config/sceneKeys.js`.
5. Ensure no placeholder service call paths crash when offline.
6. Re-run tests after each merge chunk; final full run before commit.

---

## Merge checklist I will execute when branches are available

- [ ] Merge branch 1 and resolve conflicts
- [ ] Run tests
- [ ] Merge branch 2 and resolve conflicts
- [ ] Run tests
- [ ] Merge branch 3 and resolve conflicts
- [ ] Run tests
- [ ] Final pass for conflict markers
- [ ] Final test suite
- [ ] Commit merge result with conflict notes

---

## Commands ready to run (once branches exist)

```bash
# Example sequence

git checkout work
git fetch origin

# Merge task branches in chosen order
git merge --no-ff origin/feature/task-1
git merge --no-ff origin/feature/task-2
git merge --no-ff origin/feature/task-3

# Validate no conflict markers remain
rg -n "^(<<<<<<<|=======|>>>>>>>)"

# Validate test suite
npm test
```

If you provide the missing PR refs/branches, I can perform the actual conflict resolution + merge immediately.
