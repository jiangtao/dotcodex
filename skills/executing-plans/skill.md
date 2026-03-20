---
name: executing-plans
description: Execute implementation plans end-to-end in Codex using a persistent BDD repair loop, explicit task state, optional sub-agent delegation, and no self-imposed confirmation stops.
---

# Executing Plans

This Codex workflow replaces Claude's hook-driven loop with two layers:

- an in-session repair loop driven by the main agent
- an external watchdog that can re-run `codex exec --full-auto` until the state reaches a terminal condition

## Core Loop

For each task or batch:

1. Read the task and its BDD scenario.
2. Run the failing check first.
3. Implement the smallest change or delegate to an `Implementer`.
4. Re-run the BDD verification.
5. If the check fails, do root-cause analysis before changing code again.
6. Escalate to `Reviewer` or `Architect` when retries stop converging.
7. Continue until all required scenarios are green.

## Authority Model

When the user asks to execute a plan, treat that as authorization to complete the plan end-to-end within the current workspace unless the user explicitly narrows scope.

Before any commit, push, merge, deploy, or branch-sync step, inspect the repo for a more specific local delivery workflow such as `CLAUDE.md`, repo docs, `/dev:commit`, or a dedicated delivery skill. If a more specific workflow exists, it overrides the generic authority in this skill.

This authorization includes in-scope actions such as:

- editing code and docs
- running tests and verification commands
- creating local config or scheduler entries described by the plan
- making git commits when no stricter repo-specific commit workflow applies
- pushing to the already configured remote/branch only when no stricter repo-specific delivery workflow applies, or when the user explicitly instructs you to bypass it

Do not stop merely because the next step has side effects. Choose the obvious in-scope next step and continue.

Pause only for:

- destructive commands that would discard user work
- ambiguous target branch, account, environment, or deployment destination
- production-impacting or irreversible operations not clearly requested
- external spending or credential setup not already implied and configured
- unrelated dirty state that would likely be overwritten or accidentally shipped
- a repo-local delivery workflow that requires branch creation, PR prep, review, or merge gating before push/merge

## Completion Rules

Only stop when:

- every required BDD scenario passes
- the remaining task count is zero
- reviewer findings are resolved
- no blocker is waiting on user input
- the requested deliverable set is complete from the user's perspective, not merely from the agent's perspective

Do not stop at a natural checkpoint just because the current artifact looks substantial. In yolo/full-auto sessions, continue through the next obvious in-scope, non-destructive task until a real blocker or explicit user stop appears.

If the plan itself includes side-effectful completion steps such as commit, install, push, or deploy, treat those as part of the requested deliverable set rather than optional follow-ups.
However, still execute those steps according to any stricter repo-local workflow that governs delivery.

## Watchdog State

The watchdog reads a state file such as `.codex/superpowers-loop/<run-id>/state.json`.

Suggested states:

- `running`
- `needs_retry`
- `blocked_awaiting_user`
- `completed`
- `failed_terminal`

`blocked_awaiting_user` is the only non-terminal state that intentionally pauses automatic continuation.

Do not enter `blocked_awaiting_user` merely to ask whether to continue, whether the user wants the next obvious deliverable, or whether the current amount of output is enough.
Do not enter `blocked_awaiting_user` just because the next step is a routine local side effect already authorized by the execute request or the plan.

## Full-Auto Re-entry

The watchdog should invoke Codex like this:

```bash
codex exec --full-auto --cd <workdir> --add-dir "$HOME/.codex" "<prompt>"
```
