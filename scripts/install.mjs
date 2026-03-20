#!/usr/bin/env node

import { installStableSkills, resolveRepoRoot } from './lib/release.mjs'

function parseArgs(argv) {
  const options = {}

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--target') {
      options.targetDir = argv[index + 1]
      index += 1
      continue
    }

    if (arg === '--repo-root') {
      options.repoRoot = argv[index + 1]
      index += 1
      continue
    }

    if (arg === '-h' || arg === '--help') {
      options.help = true
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function printHelp() {
  process.stdout.write(`Install dotcodex stable skills into a Codex profile.

Usage:
  node scripts/install.mjs [--target <dir>] [--repo-root <dir>]

Options:
  --target <dir>     Install into a custom Codex skills directory
  --repo-root <dir>  Use a custom repository root
  -h, --help         Show this help message
`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    printHelp()
    return
  }

  const result = await installStableSkills({
    repoRoot: options.repoRoot ? resolveRepoRoot(options.repoRoot) : undefined,
    targetDir: options.targetDir,
  })

  process.stdout.write(`Installed ${result.skills.length} stable skills into ${result.targetDir}\n`)
  for (const skillName of result.skills) {
    process.stdout.write(`${skillName}\n`)
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
})
