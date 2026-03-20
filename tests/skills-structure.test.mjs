import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const manifestPath = new URL('../release/skills.json', import.meta.url)
const releaseManifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const requiredSkills = releaseManifest.skills

for (const skill of requiredSkills) {
  test(`${skill} has a SKILL.md with required frontmatter`, () => {
    const path = new URL(`../.agents/skills/${skill}/SKILL.md`, import.meta.url)
    assert.equal(existsSync(path), true)
    const content = readFileSync(path, 'utf8')
    assert.match(content, /^---\n/)
    assert.match(content, /\nname:\s*.+/)
    assert.match(content, /\ndescription:\s*.+/)
  })

  test(`${skill} is published in the public skills layer`, () => {
    const path = new URL(`../skills/${skill}/skill.md`, import.meta.url)
    assert.equal(existsSync(path), true)
  })
}
