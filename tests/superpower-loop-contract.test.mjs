import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function readSkill(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8')
}

test('brainstorming hands off to writing-plans', () => {
  const content = readSkill('../.agents/skills/brainstorming/SKILL.md')
  assert.match(content, /brainstorming -> writing-plans -> executing-plans/i)
  assert.match(content, /Continue with superpowers:writing-plans/i)
})

test('writing-plans hands off to executing-plans', () => {
  const content = readSkill('../.agents/skills/writing-plans/SKILL.md')
  assert.match(content, /brainstorming -> writing-plans -> executing-plans/i)
  assert.match(content, /Continue with superpowers:executing-plans/i)
})
