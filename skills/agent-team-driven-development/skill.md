---
name: agent-team-driven-development
description: Coordinate Codex sub-agents as an implementation team. Use when a plan has independent workstreams that benefit from role ownership, parallel execution, and review gates.
---

# Agent Team Driven Development

Codex does not use Claude's teammate runtime. In Codex, the main session acts as lead and coordinates sub-agents explicitly.

## Runtime Mapping

- Main session: team lead
- `spawn_agent`: create architect, implementer, and reviewer workers
- `send_input`: assign scoped work and follow-ups
- `wait_agent`: only when the critical path is blocked
- `close_agent`: shut down completed workers

## Roles

- `Architect`: resolves cross-cutting concerns and unblocks repeated failures
- `Implementer`: owns a bounded task slice and follows BDD
- `Reviewer`: validates plan compliance, regression risk, and missing tests

## Team Rules

1. The lead owns the execution plan and state file.
2. Every worker gets explicit file ownership.
3. Implementers must report verification evidence, not just summary claims.
4. Reviewer feedback must be resolved before a task is accepted.
5. After repeated failed loops on one scenario, escalate to Architect.

## When to Use a Team

Use sub-agents when:
- at least two tasks are independent
- the files can be split cleanly
- review can happen in parallel with ongoing implementation

Stay in the lead session when:
- the task is highly coupled
- the next step depends on immediate local inspection
- only one small change remains
