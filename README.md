# dotcodex

Codex-native workflow repository for Jerret's team.

This repository is the source-of-truth for Codex-specific adaptations. It does not use Claude's plugin manifest format. Instead, it follows Codex's skill layout and repository scanning rules.

## Codex Skill Spec

Based on the official Codex skills documentation:

- Codex skills live in directories with a `SKILL.md` file
- Repository-scoped skills should live under `.agents/skills/`
- A skill directory can also include `scripts/`, `references/`, `assets/`, and optional `agents/openai.yaml`
- Codex scans `.agents/skills` from the current directory up to the repo root

## Repository Layout

```text
dotcodex/
├── .agents/
│   └── skills/
│       ├── agent-team-driven-development/
│       ├── behavior-driven-development/
│       ├── executing-plans/
│       └── systematic-debugging/
├── examples/
│   ├── prompt.md
│   └── state.json
├── scripts/
│   ├── start-superpower-loop.sh
│   ├── superpower-watchdog.mjs
│   └── sync-superpowers-from-dotclaude.sh
├── vendor/
│   └── superpowers/
└── tests/
```

## Source of Truth

- Claude-side upstream and fork maintenance happen in `/Users/jt/places/personal/dotclaude`
- Codex-side adaptation happens here in `dotcodex`
- `vendor/superpowers/` is a synced reference snapshot from `dotclaude/superpowers`
- `.agents/skills/` contains Codex-native adaptations that can diverge where runtime behavior differs

## Installation

For repository-local use, launch Codex from this repo root so `.agents/skills` is auto-discovered.

For user-global use, you can symlink individual skills into `~/.codex/skills`, but this repository is optimized for repo-scoped skill discovery first.

## Runtime Model

This repository has two Codex-facing layers:

- `vendor/superpowers/` tracks the Claude-side upstream and fork content from `dotclaude`
- `.agents/skills/` holds Codex-native adaptations for runtime behavior

The current Codex-native focus is:

- `agent-team-driven-development`
- `executing-plans`
- `behavior-driven-development`
- `systematic-debugging`

## Watchdog

`scripts/superpower-watchdog.mjs` is the first Codex runtime primitive. It:

- reads a loop state file
- decides whether the run should continue, pause, stop, or fail terminally
- launches `codex exec --full-auto` when continuation is allowed

## Quick Start

From the repository root:

```bash
sh scripts/start-superpower-loop.sh \
  examples/state.json \
  examples/prompt.md
```

The watchdog will launch:

```bash
codex exec --full-auto --cd <workdir> --add-dir "$HOME/.codex" "<prompt>"
```

## Sync Workflow

Use:

```bash
pnpm run sync:superpowers
```

to refresh the `vendor/superpowers/` snapshot from `dotclaude/superpowers`.

## Attribution

**Original author**

Frad LEE (fradser@gmail.com)

The Codex adaptation in this repository is built on top of Frad LEE's original `superpowers` workflow and the Claude-side fork maintained in `jiangtao/dotclaude`.

**Codex adaptation and customization**

Jerret (321jiangtao@gmail.com)
