#!/usr/bin/env node

import {
  installStableSkills,
  listStableSkills,
  resolveRepoRoot,
  syncPublishedSkills,
} from './lib/release.mjs'

function parseArgs(argv) {
  const [command = 'install', ...rest] = argv
  const options = {}

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index]

    if (arg === '--target') {
      options.targetDir = rest[index + 1]
      index += 1
      continue
    }

    if (arg === '--repo-root') {
      options.repoRoot = rest[index + 1]
      index += 1
      continue
    }

    if (arg === '-h' || arg === '--help') {
      options.help = true
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return { command, options }
}

function printHelp() {
  process.stdout.write(`dotcodex CLI

Usage:
  dotcodex install [--target <dir>] [--repo-root <dir>]
  dotcodex list [--repo-root <dir>]
  dotcodex build-public [--repo-root <dir>]

Commands:
  install       Install the stable skill whitelist into ~/.codex/skills
  list          Print the stable skill whitelist
  build-public  Refresh the tracked skills/ public layer from .agents/skills
`)
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2))
  if (options.help) {
    printHelp()
    return
  }

  const repoRoot = options.repoRoot ? resolveRepoRoot(options.repoRoot) : undefined

  if (command === 'list') {
    const skills = await listStableSkills(repoRoot)
    for (const skillName of skills) {
      process.stdout.write(`${skillName}\n`)
    }
    return
  }

  if (command === 'build-public') {
    const skills = await syncPublishedSkills(repoRoot)
    process.stdout.write(`Refreshed ${skills.length} published skills\n`)
    for (const skillName of skills) {
      process.stdout.write(`${skillName}\n`)
    }
    return
  }

  if (command === 'install') {
    const result = await installStableSkills({
      repoRoot,
      targetDir: options.targetDir,
    })
    process.stdout.write(`Installed ${result.skills.length} stable skills into ${result.targetDir}\n`)
    for (const skillName of result.skills) {
      process.stdout.write(`${skillName}\n`)
    }
    return
  }

  throw new Error(`Unknown command: ${command}`)
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
})
