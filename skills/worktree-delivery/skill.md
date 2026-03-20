---
name: worktree-delivery
description: Use when delivering code from a git worktree, preparing a commit, syncing another branch, or evaluating whether a target branch such as main is safe to merge into without overwriting local state.
---

# Worktree Delivery

## Overview

Use this skill to finish work in the correct worktree, commit only the intended changes, and assess merge readiness without trampling another worktree's local state. It is for the handoff phase after implementation is done.

## 中文说明

这个技能用于 worktree 交付收尾阶段：确认当前 worktree 是正确基线、只提交本次应该提交的变更、检查目标分支是否有本地脏状态，并在 merge 前明确告诉你“可以合并”还是“为什么现在不能合并”。

## When To Use

- The user asks to commit, merge, sync to another branch, or "deliver" work
- The repo uses multiple worktrees and there is any chance the wrong one could be treated as the source of truth
- A target branch such as `main` may contain local uncommitted changes
- You need to decide whether to merge now, stop, or ask for confirmation because of conflicting local state

## Workflow

1. Verify the authoritative worktree.
Confirm the declared source-of-truth path exists, is a real git worktree, and contains the expected project files. Do not assume a documented path is valid if it only contains placeholders or logs.

Before proceeding, inspect whether the repo defines a stricter delivery workflow such as `CLAUDE.md`, `/dev:commit`, or repo docs for branch/PR/review requirements. If it does, that workflow takes precedence over any generic "just commit/push" behavior.

2. Check the implementation worktree state.
Inspect branch name, `git status --short`, and the exact files changed. Commit only when the diff matches the task.

3. Validate before commit.
Run the relevant checks the repo requires for the touched area. If a fresh worktree is missing dependencies, install them first and then rerun validation.

4. Create the commit in the implementation worktree.
Use a scoped commit message that matches the shipped behavior. Do not touch the target branch yet.

If the repo has a structured commit workflow like `/dev:commit`, complete its required branch, summary, test-plan, test-report, and review steps before any merge or push to the target branch.

5. Inspect the target branch before merge.
Look at the target branch's worktree, branch name, and `git status --short`.
- If it is clean, merge or fast-forward as requested.
- If it has local changes, do not overwrite them silently.
- If local changes overlap with files from the new commit, stop and surface the conflict clearly.

6. Preserve local target-branch state before any destructive sync.
Preferred options:
- Ask the user to merge manually
- Create a backup branch first if the user wants automated preservation
- Only clean or reset a target branch when the user explicitly approves it

## Decision Rules

- Never merge into `main` just because the feature branch is ready; `main` must also be clean or explicitly backed up.
- Never bypass a repo-local branch/PR/review workflow just because the implementation is complete.
- Never treat another branch or running copy as the baseline if the active worktree is declared as source of truth.
- If plan docs or repo instructions mention syncing another branch, that still means sync from the current authoritative worktree outward.
- If the target branch contains unrelated user edits, preserve them and let the user choose the merge strategy.

## Output Shape

- `Implementation branch status`
- `Validation run`
- `Commit created`
- `Target branch status`
- `Merge ready` or `Blocked with reason`

## Good Examples

- The source-of-truth worktree path from docs did not actually contain the repo. Recreate or attach the real worktree there before coding.
- The feature branch is committed, but `main` has local edits to the same files. Stop and ask whether to back up `main` or leave merge to the user.
- A fresh worktree cannot build because dependencies are absent. Install dependencies in that worktree before concluding the branch is broken.

## Bad Examples

- Merging into `main` without checking whether its worktree is dirty
- Resetting or overwriting a target branch to "make the merge easy"
- Reporting that work was merged when only the feature branch was committed

No extra resources are required for this skill.
