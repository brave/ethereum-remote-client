// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

const path = require('path')
const fs = require('fs-extra')
const { spawn } = require('child_process')

const desiredReplacementSeparator = '-'
const patchExtension = '.patch'

const runAsync = (cmd, args = []) => {
  return new Promise((resolve, reject) => {
    const prog = spawn(cmd, args, {})
    let stderr = ''
    let stdout = ''
    prog.stderr.on('data', (data) => {
      stderr += data
    })
    prog.stdout.on('data', (data) => {
      stdout += data
    })
    prog.on('close', (statusCode) => {
      if (statusCode !== 0) {
        const err = new Error(`Program ${cmd} exited with error code ${statusCode}.`)
        err.stderr = stderr
        err.stdout = stdout
        reject(err)
        return
      }
      resolve(stdout)
    })
  })
}

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

async function removeStalePatchFiles (patchDirPath) {
  try {
    ((await readDirPromise(patchDirPath)) || [])
      .filter((s) => s.endsWith('.patch'))
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`Path at ${patchDirPath} does not exist.`)
      return
    }
    throw err
  }
}

async function updatePatches (gitRepoPath, patchDirPath, pathFilter) {
  let modifiedPaths = await getModifiedPaths(gitRepoPath)
  modifiedPaths = modifiedPaths.filter(pathFilter)
  await writePatchFiles(modifiedPaths, gitRepoPath, patchDirPath)
  await removeStalePatchFiles(patchDirPath)
}

const patchDir = path.join(path.dirname(__filename), '..', 'patches')
const metaMaskDir = path.join(path.dirname(__filename), '..', '..')
const pathFilter = (f) => f.length > 0 && !f.endsWith('package.json')

updatePatches(metaMaskDir, patchDir, pathFilter)
  .then(() => {
    console.log('Finished updating patches')
  })
  .catch((err) => {
    console.error('Error updating patch files:')
    console.error(err)
  })
