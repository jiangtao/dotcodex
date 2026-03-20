import { copyFile, mkdir, readFile, readdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const MODULE_DIR = dirname(fileURLToPath(import.meta.url))
const DEFAULT_REPO_ROOT = resolve(MODULE_DIR, '..', '..')

export function resolveRepoRoot(repoRoot = DEFAULT_REPO_ROOT) {
  return resolve(repoRoot)
}

export function resolveManifestPath(repoRoot = DEFAULT_REPO_ROOT) {
  return join(resolveRepoRoot(repoRoot), 'release', 'skills.json')
}

export async function loadReleaseManifest(repoRoot = DEFAULT_REPO_ROOT) {
  const manifestPath = resolveManifestPath(repoRoot)
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))

  if (!Array.isArray(manifest.skills) || manifest.skills.length === 0) {
    throw new Error(`Invalid release manifest at ${manifestPath}`)
  }

  return manifest
}

export async function listStableSkills(repoRoot = DEFAULT_REPO_ROOT) {
  const manifest = await loadReleaseManifest(repoRoot)
  return [...manifest.skills]
}

export function resolveSourceSkillDir(repoRoot, skillName) {
  return join(resolveRepoRoot(repoRoot), '.agents', 'skills', skillName)
}

export function resolvePublishedSkillDir(repoRoot, skillName) {
  return join(resolveRepoRoot(repoRoot), 'skills', skillName)
}

export function resolveInstallTargetDir(targetDir) {
  if (targetDir) {
    return resolve(targetDir)
  }

  const codexHome = process.env.CODEX_HOME
    ? resolve(process.env.CODEX_HOME)
    : join(homedir(), '.codex')

  return join(codexHome, 'skills')
}

async function copySkillDir(sourceDir, targetDir) {
  await rm(targetDir, { recursive: true, force: true })
  await copyTree({
    sourceDir,
    targetDir,
    renameFile: fileName => fileName,
  })
}

async function copyTree({
  sourceDir,
  targetDir,
  renameFile,
}) {
  await mkdir(targetDir, { recursive: true })
  const entries = await readdir(sourceDir, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = join(sourceDir, entry.name)
    const targetName = renameFile(entry.name)
    const targetPath = join(targetDir, targetName)

    if (entry.isDirectory()) {
      await copyTree({
        sourceDir: sourcePath,
        targetDir: targetPath,
        renameFile,
      })
      continue
    }

    await mkdir(dirname(targetPath), { recursive: true })
    await copyFile(sourcePath, targetPath)
  }
}

export async function syncPublishedSkills(repoRoot = DEFAULT_REPO_ROOT) {
  const root = resolveRepoRoot(repoRoot)
  const stableSkills = await listStableSkills(root)
  const publishedRoot = join(root, 'skills')
  await mkdir(publishedRoot, { recursive: true })

  for (const skillName of stableSkills) {
    const sourceDir = resolveSourceSkillDir(root, skillName)
    const targetDir = resolvePublishedSkillDir(root, skillName)

    if (!existsSync(sourceDir)) {
      throw new Error(`Missing source skill: ${sourceDir}`)
    }

    await rm(targetDir, { recursive: true, force: true })
    await copyTree({
      sourceDir,
      targetDir,
      renameFile(fileName) {
        return fileName === 'SKILL.md' ? 'skill.md' : fileName
      },
    })
  }

  return stableSkills
}

function resolveInstallSourceDir(repoRoot, skillName) {
  const publishedDir = resolvePublishedSkillDir(repoRoot, skillName)
  if (existsSync(publishedDir)) {
    return publishedDir
  }

  const sourceDir = resolveSourceSkillDir(repoRoot, skillName)
  if (existsSync(sourceDir)) {
    return sourceDir
  }

  throw new Error(`Skill is missing from both published and source layers: ${skillName}`)
}

export async function installStableSkills({
  repoRoot = DEFAULT_REPO_ROOT,
  targetDir,
} = {}) {
  const root = resolveRepoRoot(repoRoot)
  const installTargetDir = resolveInstallTargetDir(targetDir)
  const stableSkills = await listStableSkills(root)

  await mkdir(installTargetDir, { recursive: true })

  for (const skillName of stableSkills) {
    const sourceDir = resolveInstallSourceDir(root, skillName)
    const destinationDir = join(installTargetDir, skillName)
    await rm(destinationDir, { recursive: true, force: true })
    await copyTree({
      sourceDir,
      targetDir: destinationDir,
      renameFile(fileName) {
        return fileName === 'skill.md' ? 'SKILL.md' : fileName
      },
    })
  }

  return {
    targetDir: installTargetDir,
    skills: stableSkills,
  }
}
