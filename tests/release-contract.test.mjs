import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

const manifestPath = new URL('../release/skills.json', import.meta.url)
const expectedStableSkills = [
  'agent-team-driven-development',
  'behavior-driven-development',
  'brainstorming',
  'build-like-iphone-team',
  'executing-plans',
  'systematic-debugging',
  'worktree-delivery',
  'writing-plans',
]

test('stable release manifest exists and lists published skills', () => {
  assert.equal(existsSync(manifestPath), true, 'release/skills.json should exist')

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  assert.equal(Array.isArray(manifest.skills), true, 'manifest.skills should be an array')
  assert.ok(manifest.skills.length > 0, 'manifest should publish at least one skill')
  assert.deepEqual(manifest.skills, expectedStableSkills, 'stable whitelist should preserve the full superpower loop')

  for (const skillName of manifest.skills) {
    const sourceDir = new URL(`../.agents/skills/${skillName}/`, import.meta.url)
    const publicDir = new URL(`../skills/${skillName}/`, import.meta.url)
    assert.equal(existsSync(sourceDir), true, `missing source skill: ${skillName}`)
    assert.equal(existsSync(new URL('SKILL.md', sourceDir)), true, `missing source SKILL.md for ${skillName}`)
    assert.equal(existsSync(publicDir), true, `missing published skill: ${skillName}`)
    const publicEntries = readdirSync(publicDir)
    assert.equal(publicEntries.includes('skill.md'), true, `missing published skill.md for ${skillName}`)
    assert.equal(publicEntries.includes('SKILL.md'), false, `published layer should use skill.md for ${skillName}`)

    const sourceContent = readFileSync(new URL('SKILL.md', sourceDir), 'utf8')
    const publicContent = readFileSync(new URL('skill.md', publicDir), 'utf8')
    assert.equal(publicContent, sourceContent, `public skill.md should mirror source SKILL.md for ${skillName}`)
  }
})

test('package metadata keeps repo maintenance scripts local', () => {
  const packagePath = new URL('../package.json', import.meta.url)
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))

  assert.equal(pkg.private, true, 'repository package should stay private')
  assert.equal(typeof pkg.scripts?.['build:skills'], 'string', 'package should expose build:skills')
  assert.equal(typeof pkg.scripts?.test, 'string', 'package should expose test')
})

test('root README describes repo-local use and public installation', () => {
  const readmePath = new URL('../README.md', import.meta.url)
  const readme = readFileSync(readmePath, 'utf8')

  assert.match(readme, /Repo-Local Use/i)
  assert.match(readme, /install\.sh/)
  assert.match(readme, /pnpx skills add/i)
  assert.match(readme, /~\/\.codex\/skills/)
  assert.match(readme, /stable/i)
})
