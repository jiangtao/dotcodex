---
name: brainstorming
description: Structures collaborative dialogue to turn rough ideas into implementation-ready designs. Use when the user has a new idea, feature request, ambiguous requirement, or asks to brainstorm before implementation.
user-invocable: true
---

# Brainstorming Ideas Into Designs

Turn rough ideas into implementation-ready designs through structured collaborative dialogue, then hand off into the Codex superpower execution chain.

## Closed-Loop Goal

This skill is the entrypoint to the full superpower loop:

`brainstorming -> writing-plans -> executing-plans -> behavior-driven-development / agent-team-driven-development -> verification`

Do not stop at ideation. Drive the work toward a design that can be planned and executed without ambiguity.

## Existing Plan Fast Path

If the user points to an existing plan or spec and asks to execute it, do not force a new design pass. Examples include `执行 docs/plans/...`, `implement this plan`, `run this spec`, or `continue executing the plan`.

When that happens:

1. Inspect the referenced plan, the current repo state, and any nearby docs/code.
2. Use this skill only to resolve ambiguity, tighten assumptions, or identify missing execution constraints.
3. Transition directly into `executing-plans` in the same turn rather than stopping after analysis.
4. Treat the user's execute wording as authorization for in-scope implementation, verification, and local environment changes explicitly required by the plan.
5. If execution reaches delivery, defer to any repo-specific commit or delivery workflow such as `CLAUDE.md`, `/dev:commit`, or `worktree-delivery` rather than pushing directly by convention.

Pause only when a real blocker remains, such as destructive data loss, ambiguous target account/environment, external spend, production impact, or unrelated dirty state that would likely be overwritten.

## Initialization

1. Read the local project context first: `README.md`, relevant docs, and nearby code.
2. Identify the minimum unknowns blocking a concrete design.
3. Default to reasonable assumptions and continue when the codebase already provides enough evidence.
4. Ask one focused question at a time only when the codebase does not answer a truly blocking unknown and the decision would materially change the design.
5. Keep the conversation moving toward a committed design artifact without preference-polling pauses.

## Core Principles

1. Converge in order: clarify -> compare -> choose -> design -> reflect -> transition.
2. Context first: inspect the codebase before asking the user.
3. Autonomy first: if a sensible default covers the request, choose it and continue.
4. Incremental validation: confirm major design decisions before elaborating only when the decision is genuinely user-dependent or risky.
5. YAGNI ruthlessly: remove anything not required for the requested outcome.
6. BDD-ready output: the design must provide enough detail for `writing-plans` and downstream BDD execution.

## Phase 1: Discovery

Explore the codebase, constraints, and existing patterns before proposing solutions.

- Review relevant files, docs, and recent changes.
- Identify missing requirements, constraints, and success criteria.
- Ask exactly one focused question at a time only when needed.
- Do not ask about preferred output shape, option labels, or sequencing if a combined or recommended default would satisfy the request.

If the problem is unusually open-ended or requires challenging conventions, load `build-like-iphone-team` explicitly during option analysis.

See `./references/discovery.md` and `./references/exit-criteria.md`.

## Phase 2: Option Analysis

Propose 2-3 grounded options, recommend one, and explain the trade-offs in concrete terms.

- Base options on the actual codebase and operating constraints.
- Prefer the smallest design that preserves the intended workflow.
- Get explicit user alignment before moving to design creation only when the choice is unresolved and materially affects the resulting design. Otherwise, choose the recommended option and continue.

See `./references/options.md` and `./references/exit-criteria.md`.

## Phase 3: Design Creation

Create a design folder under `docs/plans/YYYY-MM-DD-<topic>-design/` with at least:

- `_index.md`
- `bdd-specs.md`
- `architecture.md`
- `best-practices.md`

The design must be sufficient for `writing-plans` to decompose into executable tasks.

`_index.md` must include a `Design Documents` section that links the supporting files.

See `./references/design-creation.md`.

Skip this phase when the user already supplied an executable plan and the remaining work is execution rather than design authoring.

## Phase 4: Reflection

Review the design for:

- requirement coverage
- BDD completeness
- cross-document consistency
- missing risks or assumptions

Update the design until the gaps are resolved, then confirm with the user that the design is ready to plan.

See `./references/reflection.md` and `./references/exit-criteria.md`.

## Phase 5: Transition

When the design is complete:

1. Save the design documents.
2. State that the next step is `writing-plans`.
3. Hand off to the implementation-planning phase instead of jumping straight into coding.

If the user intent already implies continued execution, do not pause to ask whether to continue to the next planning phase.
Do not create self-imposed stopping points after a completed artifact if the next step is an obvious, in-scope, non-destructive continuation of the same request. Execute that continuation in the same turn.

Use this exact transition language:

`Design complete. Continue with superpowers:writing-plans to convert this into an executable plan.`

If the user already supplied an executable plan, use this transition language instead:

`Plan understood. Continue with superpowers:executing-plans and complete the requested deliverables end-to-end.`

## Default Output Rules

- For repository learning, architecture review, deep-dive explanation, or interview-prep requests, default to a combined deliverable:
  1. technical breakdown
  2. interview-ready narrative
  3. principle-level explanation for teaching/review
- When the user explicitly asks for automatic execution, treat that as instruction to continue without confirmation pauses except for truly blocking unknowns.
- When the user explicitly asks to execute a referenced plan, do not stop after analysis or design. Continue through execution, verification, and other obvious in-scope deliverables in the same turn.
- Do not end with optional-next-step language when the next step is already the requested execution path.
- In yolo-style or auto-execute sessions, keep advancing through adjacent deliverables until the requested deliverable set is complete or a real blocker appears.
- Completion is defined by the user's requested deliverable set, not by the agent deciding the current output is already substantial enough.

## References

- `./references/core-principles.md`
- `./references/discovery.md`
- `./references/options.md`
- `./references/design-creation.md`
- `./references/reflection.md`
- `./references/exit-criteria.md`
- `../../skills/references/git-commit.md`
- `../../skills/references/prompt-patterns.md`
- `../../skills/references/completion-promises.md`
