import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

function runNode(args, options = {}) {
  return spawnSync(process.execPath, args, {
    cwd: new URL('../', import.meta.url),
    encoding: 'utf8',
    ...options,
  })
}

test('CLI can list stable skills from the release manifest', () => {
  const result = runNode(['scripts/cli.mjs', 'list'])
  assert.equal(result.status, 0, result.stderr || result.stdout)

  const listedSkills = result.stdout
    .trim()
    .split('\n')
    .filter(Boolean)

  assert.ok(listedSkills.length > 0, 'CLI should list at least one stable skill')
  assert.ok(listedSkills.includes('brainstorming'))
  assert.ok(listedSkills.includes('behavior-driven-development'))
  assert.ok(listedSkills.includes('writing-plans'))
})

test('installer copies only published stable skills into target codex directory', () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'dotcodex-install-'))
  const targetDir = join(tempRoot, 'skills')

  try {
    const result = runNode(['scripts/install.mjs', '--target', targetDir])
    assert.equal(result.status, 0, result.stderr || result.stdout)

    const manifest = JSON.parse(readFileSync(new URL('../release/skills.json', import.meta.url), 'utf8'))

    for (const skillName of manifest.skills) {
      const installedEntries = readdirSync(join(targetDir, skillName))
      assert.equal(installedEntries.includes('SKILL.md'), true, `expected installed skill ${skillName}`)
      assert.equal(installedEntries.includes('skill.md'), false, `installed Codex skill should normalize to SKILL.md for ${skillName}`)
    }

    assert.equal(existsSync(join(targetDir, 'brainstorming', 'SKILL.md')), true, 'brainstorming should be part of the installed closed loop')
    assert.equal(existsSync(join(targetDir, 'writing-plans', 'SKILL.md')), true, 'writing-plans should be part of the installed closed loop')
  }
  finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('install shell wrapper delegates to the shared installer', () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'dotcodex-install-sh-'))
  const targetDir = join(tempRoot, 'skills')

  try {
    const result = spawnSync('sh', ['install.sh', '--target', targetDir], {
      cwd: new URL('../', import.meta.url),
      encoding: 'utf8',
    })
    assert.equal(result.status, 0, result.stderr || result.stdout)
    assert.equal(existsSync(join(targetDir, 'systematic-debugging', 'SKILL.md')), true)
  }
  finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})
