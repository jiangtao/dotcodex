---
name: writing-plans
description: Creates executable implementation plans that break down validated designs into detailed tasks for Codex execution.
argument-hint: [design-folder-path]
user-invocable: true
---

# Writing Plans

Convert a validated design into an executable Codex plan that can run through the superpower loop without ambiguity.

## Closed-Loop Goal

This skill is the planning bridge in the full superpower loop:

`brainstorming -> writing-plans -> executing-plans -> behavior-driven-development / agent-team-driven-development -> verification`

The output is not prose for humans only. It must be detailed enough that `executing-plans` can carry the work through to verified completion.

## Initialization

1. Resolve the design folder from `$ARGUMENTS` or the latest matching design under `docs/plans/`.
2. Verify the folder includes `_index.md` and `bdd-specs.md`.
3. Treat `bdd-specs.md` as the source of truth for task decomposition.

## Core Rules

- Every plan is BDD-driven.
- Every implementation path must follow test-first ordering.
- Every task must be explicit, bounded, and independently understandable.
- Every dependency must represent a real technical prerequisite.
- Plans describe what to build and verify, not final implementation code.

## Phase 1: Plan Structure

Create a plan folder under `docs/plans/YYYY-MM-DD-<topic>-plan/`.

`_index.md` must include:

- goal
- architecture summary
- execution plan metadata
- task file references
- BDD coverage
- dependency chain

See `./references/plan-structure-template.md`.

## Phase 2: Task Decomposition

Break work into granular task files:

- one task per file
- file pattern `task-<NNN>-<feature>-<type>.md`
- test task before implementation task
- explicit `depends-on` metadata
- full BDD scenario content copied into each task
- concrete verification commands

See `./references/task-granularity-and-verification.md`.

## Phase 3: Validation

Validate the plan before transition:

- every BDD scenario has task coverage
- dependency graph is acyclic and justified
- test/impl pairing is preserved
- no vague or multi-purpose tasks remain

Get user confirmation that the plan is ready for execution.

## Phase 4: Transition

When the plan is complete:

1. Save the plan folder.
2. State that the next step is `executing-plans`.
3. Hand off to execution instead of implementing ad hoc.

Use this exact transition language:

`Plan complete. Continue with superpowers:executing-plans to execute the plan to verified completion.`

## References

- `./references/plan-structure-template.md`
- `./references/task-granularity-and-verification.md`
- `./references/plan-reflection.md`
- `../../skills/references/git-commit.md`
- `../../skills/references/prompt-patterns.md`
- `../../skills/references/completion-promises.md`
