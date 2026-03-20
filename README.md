# dotcodex

`dotcodex` is the source-of-truth repository for Codex workflows and a stable public skill distribution for end users.

It has two responsibilities:

- Maintain repo-local Codex workflow source code under `.agents/skills/`
- Publish a stable whitelist of installable skills into `~/.codex/skills`

## Repository Model

```text
dotcodex/
├── .agents/skills/        # Source-of-truth workflow skills for repo-local Codex use
├── skills/                # Stable published skill layer for external users
├── release/skills.json    # Stable whitelist manifest
├── scripts/               # Install, release, and runtime tooling
├── examples/              # Example loop state and prompt files
└── tests/                 # Contract and runtime tests
```

`.agents/skills/` is the development layer. `skills/` is the user-facing release layer. The stable whitelist is explicit so the published set preserves the full superpower loop while experimental workflows can remain local.

## Stable Skills

The current stable public distribution is defined in `release/skills.json`:

- `agent-team-driven-development`
- `behavior-driven-development`
- `brainstorming`
- `build-like-iphone-team`
- `executing-plans`
- `systematic-debugging`
- `worktree-delivery`
- `writing-plans`

Together they restore the intended closed-loop workflow:

`brainstorming -> writing-plans -> executing-plans -> behavior-driven-development / agent-team-driven-development -> verification`

`worktree-delivery` complements that loop at handoff time by making branch-sync and merge readiness safer in multi-worktree repos.

## Repo-Local Use

Launch Codex from this repository root to let Codex auto-discover `.agents/skills/`.

```bash
cd /path/to/dotcodex
codex
```

This is the recommended mode when developing or validating workflows inside this repository.

## Public Installation

### Option 1: `install.sh`

Clone the repository, then install the stable whitelist into `~/.codex/skills`:

```bash
git clone <your-dotcodex-repo-url>
cd dotcodex
./install.sh
```

Use `--target` to install into a different Codex profile directory:

```bash
./install.sh --target /tmp/custom-codex/skills
```

### Option 2: `pnpx skills add`

The public `skills/` directory is also shaped to match the `jiangtao-skills` convention, so Agentskills-style installation can pull it directly:

```bash
pnpx skills add <owner>/dotcodex
```

## Maintainer Workflow

Refresh the public `skills/` layer from `.agents/skills/`:

```bash
npm run build:skills
```

Verify the release contract and runtime tooling:

```bash
npm test
```

## Runtime Tooling

`scripts/superpower-watchdog.mjs` is the first Codex runtime primitive in this repository. It reads a loop state file, decides whether execution should continue, and launches `codex exec --full-auto` when continuation is allowed.

Example:

```bash
sh scripts/start-superpower-loop.sh \
  examples/state.json \
  examples/prompt.md
```

## Attribution

Original workflow inspiration: Frad LEE (`superpowers`) and the Claude-side fork maintained in `jiangtao/dotclaude`.

Codex adaptation and distribution model: Jerret.
