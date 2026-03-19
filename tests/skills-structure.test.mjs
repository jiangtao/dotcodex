import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const requiredSkills = [
  'agent-team-driven-development',
  'behavior-driven-development',
  'executing-plans',
  'systematic-debugging',
]

for (const skill of requiredSkills) {
  test(`${skill} has a SKILL.md with required frontmatter`, () => {
    const path = new URL(`../.agents/skills/${skill}/SKILL.md`, import.meta.url)
    assert.equal(existsSync(path), true)
    const content = readFileSync(path, 'utf8')
    assert.match(content, /^---\n/)
    assert.match(content, /\nname:\s*.+/)
    assert.match(content, /\ndescription:\s*.+/)
  })
}

