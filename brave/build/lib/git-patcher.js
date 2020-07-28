// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const {
  runGitAsync,
  calculateFileChecksum,
} = require('./util')

const extPatch = 'patch'
const extPatchInfo = 'patchinfo'
const encodingPatchInfo = 'utf8'
const patchInfoSchemaVersion = 1
const applyArgs = [ '--ignore-space-change', '--ignore-whitespace' ]

const patchApplyReasons = {
  NO_PATCH_INFO: 0,
  PATCH_INFO_OUTDATED: 1,
  PATCH_CHANGED: 2,
  PATCH_REMOVED: 3,
  SRC_CHANGED: 4,
}

const regexGitApplyNumStats = /^((\d|-)+\s+){2}/

module.exports = class GitPatcher {
  constructor (patchDirPath, repoPath, logProgress = true) {
    this.patchDirPath = patchDirPath
    this.repoPath = repoPath
    this.shouldLogProgress = logProgress
  }

  logProgressLine (...messages) {
    if (this.shouldLogProgress) {
      console.log(...messages)
    }
  }

  logProgress (message) {
    if (this.shouldLogProgress) {
      process.stdout.write(message)
    }
  }

  async applyPatches () {
    const [patchDirExists, repoDirExists] = await Promise.all([
      fs.exists(this.patchDirPath),
      fs.exists(this.repoPath),
    ])
    if (!patchDirExists) {
      return []
    }
    if (!repoDirExists) {
      throw new Error(`Could not apply patches. Repo at path "${this.repoPath}" does not exist.`)
    }
    const allFilenames = await fs.readdir(this.patchDirPath)
    const patchFilenames = allFilenames.filter((s) => s.endsWith(`.${extPatch}`))
    const patchInfoFilenames = allFilenames.filter((s) => s.endsWith(`.${extPatchInfo}`))

    const patchesToApply = []
    const patchInfosObsolete = []

    for (const filename of patchFilenames) {
      const patchInfoFilename = filename.slice(0, extPatch.length * -1) + extPatchInfo
      const hasPatchInfo = patchInfoFilenames.includes(patchInfoFilename)
      const fullPath = path.join(this.patchDirPath, filename)
      const patchInfoFullPath = path.join(this.patchDirPath, patchInfoFilename)
      const needsPatchReason = (!hasPatchInfo)
        ? patchApplyReasons.NO_PATCH_INFO
        : (await this.isPatchStale(fullPath, patchInfoFullPath))
      if (needsPatchReason !== null) {
        patchesToApply.push({
          patchPath: fullPath,
          patchInfoPath: path.join(this.patchDirPath, patchInfoFilename),
          reason: needsPatchReason,
        })
      }
    }

    for (const filename of patchInfoFilenames) {
      const patchFilename = filename.slice(0, extPatchInfo.length * -1) + extPatch
      const hasPatch = patchFilenames.includes(patchFilename)
      if (!hasPatch) {
        const fullPath = path.join(this.patchDirPath, filename)
        patchInfosObsolete.push(fullPath)
      }
    }
    const pathStatuses = []
    try {
      if (patchesToApply.length) {
        const appliedPathsStatuses = await this.performApplyForPatches(patchesToApply)
        pathStatuses.push(...appliedPathsStatuses)
      }
      if (patchInfosObsolete.length) {
        const resetStatuses = await this.handleObsoletePatchInfos(patchInfosObsolete)
        pathStatuses.push(...resetStatuses)
      }
    } catch (err) {
      console.error(err)
      console.error('There was an error applying added, modified or removed patches. Please consider running `init` to reset and re-apply all patches.')
    }
    return pathStatuses
  }

  async getPatchInfo (patchInfoPath) {
    try {
      const patchInfoRaw = await fs.readFile(patchInfoPath, encodingPatchInfo)
      const patchInfo = JSON.parse(patchInfoRaw)
      return patchInfo
    } catch (err) {
      err.message = `Error reading Patch Info file at path "${patchInfoPath}": ${err.message}`
      throw err
    }
  }

  async isPatchStale (patchPath, patchInfoPath) {
    const patchInfo = await this.getPatchInfo(patchInfoPath)
    if (!patchInfo || patchInfo.schemaVersion !== patchInfoSchemaVersion) {
      return patchApplyReasons.PATCH_INFO_OUTDATED
    }

    const { patchChecksum, appliesTo } = patchInfo
    const currentPatchChecksum = await calculateFileChecksum(patchPath)
    if (currentPatchChecksum !== patchChecksum) {
      return patchApplyReasons.PATCH_CHANGED
    }

    for (const { path: localPath, checksum } of appliesTo) {
      const fullPath = path.join(this.repoPath, localPath)
      const currentChecksum = await calculateFileChecksum(fullPath)
      if (currentChecksum !== checksum) {
        return patchApplyReasons.SRC_CHANGED
      }
    }

    return null
  }

  async performApplyForPatches (patchesToApply) {
    const prepOps = []
    this.logProgress(os.EOL + 'Getting patch data...')
    for (const patchData of patchesToApply) {
      prepOps.push(
        this.getAppliesTo(patchData.patchPath)
          .then((appliesTo) => ({
            appliesTo,
            ...patchData,
          }))
          .catch((err) => ({
            error: new Error('Could not read data from patch file: ' + err.message),
            ...patchData,
          }))
          .then((data) => {
            this.logProgress('.')
            return data
          }),
      )
    }

    const patchSets = await Promise.all(prepOps)
    this.logProgress(os.EOL + 'Resetting...')

    const allRepoPaths = patchSets.filter((p) => !p.error).reduce(
      (allPaths, set) => allPaths.concat(set.appliesTo.map((s) => s.path)),
      [],
    )
    try {
      await this.resetRepoFiles(allRepoPaths)
    } catch (error) {
      console.warn('There were some failures during git reset of specific repo paths: ', allRepoPaths.join(' '))
    }
    this.logProgressLine('done.')
    this.logProgress('Applying patches:')

    for (const patchData of patchSets) {
      const { patchPath } = patchData
      this.logProgress('.')
      try {
        await runGitAsync(this.repoPath, ['apply', patchPath, ...applyArgs])
      } catch (err) {
        patchData.error = err
      }
    }
    this.logProgressLine('All patch apply done.')
    const patchInfoOps = []
    for (const { appliesTo, patchPath, patchInfoPath } of patchSets.filter((p) => !p.error)) {
      patchInfoOps.push(this.writePatchInfo(patchInfoPath, appliesTo, patchPath))
    }

    await Promise.all(patchInfoOps)

    return patchSets.reduce(
      (all, { appliesTo, patchPath, error, reason }) => {
        if (appliesTo && appliesTo.length) {
          return all.concat(appliesTo.map(
            ({ path }) => ({
              path,
              patchPath,
              error,
              reason,
            }),
          ))
        } else {
          return all.concat([{
            patchPath,
            error,
            reason,
          }])
        }
      },
      [],
    )
  }

  async getAppliesTo (patchPath) {
    const applyStatArgs = ['apply', patchPath, '--numstat', '-z', ...applyArgs]
    return (await runGitAsync(this.repoPath, applyStatArgs))
      .split(os.EOL)
      .filter((s) => s)
      .map((s) => ({
        path: s.replace(regexGitApplyNumStats, '').replace(/\0/g, ''),
      }))
  }

  async writePatchInfo (patchInfoPath, appliesTo, patchPath) {
    for (const appliesToFile of appliesTo) {
      appliesToFile.checksum = await calculateFileChecksum(path.join(this.repoPath, appliesToFile.path))
    }
    const patchInfo = {
      schemaVersion: patchInfoSchemaVersion,
      patchChecksum: await calculateFileChecksum(patchPath),
      appliesTo,
    }
    await fs.writeFile(patchInfoPath, JSON.stringify(patchInfo), { encoding: encodingPatchInfo })
  }

  resetRepoFiles (filePaths) {
    return runGitAsync(this.repoPath, ['checkout', ...filePaths])
  }

  async handleObsoletePatchInfos (patchInfosObsolete) {
    const ops = []
    const allPaths = []
    const allStatuses = []
    for (const patchInfoPath of patchInfosObsolete) {
      const patchInfo = await this.getPatchInfo(patchInfoPath)
      const removeOp = fs.unlink(patchInfoPath)
        .catch((err) => {
          this.logProgressLine(`Warning: Could not remove obsolete PatchInfo file at path ${patchInfoPath}: "${err.message}"`)
        })
      ops.push(removeOp)
      allPaths.push(...patchInfo.appliesTo.map((s) => s.path))
      allStatuses.push(...patchInfo.appliesTo.map(({ path }) => ({
        path,
        patchPath: patchInfoPath.replace(/(.patchinfo)$/, `.${extPatch}`),
        reason: patchApplyReasons.PATCH_REMOVED,
      })))
    }
    let resetWasSuccessful = true
    const resetOp = this.resetRepoFiles(allPaths)
      .catch(() => {
        resetWasSuccessful = false
      })
    ops.push(resetOp)
    await Promise.all(ops)
    return allStatuses.map((statusIn) => {
      const status = {
        ...statusIn,
      }
      if (!resetWasSuccessful) {
        status.warning = 'Some resets failed'
      }
      return status
    })
  }
}
