# Public Codex Distribution Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `dotcodex` usable as both a repo-local Codex workflow source-of-truth and a publicly installable stable skill collection.

**Architecture:** Keep `.agents/skills/` as the source layer for repo-local Codex workflows. Add a stable release manifest plus a generated `skills/` public layer, then ship a single installer implementation that powers both `install.sh` and the npm CLI.

**Tech Stack:** Node.js, npm package bin, shell installer wrapper, Node test runner

---

### Task 1: Define the release contract

**Files:**
- Create: `release/skills.json`
- Create: `tests/release-contract.test.mjs`

**Step 1: Write the failing test**

Assert that the stable release manifest exists, lists at least one skill, and every listed skill has a source directory under `.agents/skills/` and a published directory under `skills/`.

**Step 2: Run test to verify it fails**

Run: `node --test tests/release-contract.test.mjs`
Expected: FAIL because the manifest and public `skills/` layer do not exist yet.

**Step 3: Write minimal implementation**

Add a manifest describing the stable skill whitelist and create the published `skills/` layer for the initial stable skills.

**Step 4: Run test to verify it passes**

Run: `node --test tests/release-contract.test.mjs`
Expected: PASS.

### Task 2: Add an installer contract

**Files:**
- Create: `tests/install-cli.test.mjs`
- Create: `scripts/lib/release.mjs`
- Create: `scripts/install.mjs`
- Create: `scripts/cli.mjs`
- Create: `install.sh`

**Step 1: Write the failing test**

Assert that the installer copies only stable whitelisted skills into a target Codex skills directory and that the CLI exposes a list/install flow.

**Step 2: Run test to verify it fails**

Run: `node --test tests/install-cli.test.mjs`
Expected: FAIL because the installer and CLI do not exist yet.

**Step 3: Write minimal implementation**

Implement shared release helpers, a Node installer, a CLI entrypoint, and a shell wrapper that delegates to the same installer.

**Step 4: Run test to verify it passes**

Run: `node --test tests/install-cli.test.mjs`
Expected: PASS.

### Task 3: Wire package metadata and docs

**Files:**
- Modify: `package.json`
- Modify: `README.md`

**Step 1: Write the failing test**

Extend package-level checks to assert that the package exposes a bin entry and the root README describes repo-local use plus `install.sh` and npm installation.

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL until metadata and docs are updated.

**Step 3: Write minimal implementation**

Update package metadata for public distribution and rewrite the README around the source-vs-release model, stable whitelist, install methods, and verification commands.

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

### Task 4: Verify release hygiene

**Files:**
- Modify: `tests/skills-structure.test.mjs`
- Modify: `scripts/sync-superpowers-from-dotclaude.sh`

**Step 1: Write the failing test**

Assert that release-manifested skills remain in sync and that upstream sync scripts do not reference removed release directories.

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL if stale `vendor/` assumptions remain.

**Step 3: Write minimal implementation**

Align existing tests and maintenance scripts with the new public release model.

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.
