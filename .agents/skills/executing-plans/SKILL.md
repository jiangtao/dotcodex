---
name: executing-plans
description: Execute implementation plans in Codex using a persistent BDD repair loop, explicit task state, and optional sub-agent delegation.
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

## Completion Rules

Only stop when:

- every required BDD scenario passes
- the remaining task count is zero
- reviewer findings are resolved
- no blocker is waiting on user input

## Watchdog State

The watchdog reads a state file such as `.codex/superpowers-loop/<run-id>/state.json`.

Suggested states:

- `running`
- `needs_retry`
- `blocked_awaiting_user`
- `completed`
- `failed_terminal`

`blocked_awaiting_user` is the only non-terminal state that intentionally pauses automatic continuation.

## Full-Auto Re-entry

The watchdog should invoke Codex like this:

```bash
codex exec --full-auto --cd <workdir> --add-dir "$HOME/.codex" "<prompt>"
```
