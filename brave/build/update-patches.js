// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

const path = require('path')
const fs = require('fs-extra')
const { runAsync } = require('./lib/util')

const desiredReplacementSeparator = '-'
const patchExtension = '.patch'

async function getModifiedPaths (gitRepoPath) {
  const modifiedDiffArgs = ['diff', '--diff-filter=M', '--name-only', '--ignore-space-at-eol']
  const cmdOutput = await runAsync('git', modifiedDiffArgs, { cwd: gitRepoPath })
  return cmdOutput.split('\n').filter((s) => s)
}

async function writePatchFiles (modifiedPaths, gitRepoPath, patchDirPath) {
  const patchFilenames = modifiedPaths.map((s) => s.replace(/\//g, desiredReplacementSeparator) + patchExtension)

  if (modifiedPaths.length) {
    await fs.ensureDir(patchDirPath)
  }

  let writeOpsDoneCount = 0
  const writePatchOps = modifiedPaths.map(async (old, i) => {
    const singleDiffArgs = ['diff', '--src-prefix=a/', '--dst-prefix=b/', '--full-index', old]
    const patchContents = await runAsync('git', singleDiffArgs, { cwd: gitRepoPath })
    const patchFilename = patchFilenames[i]
    await fs.writeFile(path.join(patchDirPath, patchFilename), patchContents)

    writeOpsDoneCount++
    const logRepoName = path.basename(gitRepoPath)
    console.log(`updatePatches [${logRepoName}] wrote ${writeOpsDoneCount} / ${modifiedPaths.length}: ${patchFilename}`)
  })

  await Promise.all(writePatchOps)
  return patchFilenames
}

const readDirPromise = (pathName) => new Promise((resolve, reject) =>
  fs.readdir(pathName, (err, fileList) => {
    if (err) {
      return reject(err)
    }
    return resolve(fileList)
  }) // eslint-disable-line comma-dangle
)

async function removeStalePatchFiles (patchFilenames, patchDirPath, keepPatchFilenames) {
  let existingPathFilenames
  try {
    existingPathFilenames = ((await readDirPromise(patchDirPath)) || [])
      .filter((s) => s.endsWith('.patch'))
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`Path at ${patchDirPath} does not exist.`)
      return
    }
    throw err
  }

  const validFilenames = patchFilenames.concat(keepPatchFilenames)
  const toRemoveFilenames = existingPathFilenames.filter((x) => !validFilenames.includes(x))

  let removedProgress = 0
  for (const filename of toRemoveFilenames) {
    const fullPath = path.join(patchDirPath, filename)
    fs.removeSync(fullPath)
    removedProgress++
    console.log(`updatePatches *REMOVED* ${removedProgress}/${toRemoveFilenames.length}: ${filename}`)
  }
}

async function updatePatches (gitRepoPath, patchDirPath, pathFilter) {
  let modifiedPaths = await getModifiedPaths(gitRepoPath)
  modifiedPaths = modifiedPaths.filter(pathFilter)
  const patchFilenames = await writePatchFiles(modifiedPaths, gitRepoPath, patchDirPath)
  await removeStalePatchFiles(patchFilenames, patchDirPath, [])
}

const patchDir = path.join(path.dirname(__filename), '..', 'patches')
const metaMaskDir = path.join(path.dirname(__filename), '..', '..')
const pathFilter = (f) => {
  return f.length > 0 &&
    !f.endsWith('package.json') &&
    !f.endsWith('yarn.lock') &&
    !f.startsWith('brave') &&
    !f.endsWith('ui/app/css/index.scss')
}

updatePatches(metaMaskDir, patchDir, pathFilter)
  .then(() => {
    console.log('Finished updating patches')
  })
  .catch((err) => {
    console.error('Error updating patch files:')
    console.error(err)
  })
