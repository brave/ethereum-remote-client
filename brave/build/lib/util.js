// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

const { spawn } = require('child_process')
const crypto = require('crypto')
const fs = require('fs')

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

const runGitAsync = (repoPath, gitArgs, verbose = false, logError = false) => {
  return runAsync('git', gitArgs, { cwd: repoPath, verbose, continueOnFail: true })
    .catch((err) => {
      if (logError) {
        console.error(err.message)
        console.error(`Git arguments were: ${gitArgs.join(' ')}`)
        console.log(err.stdout)
        console.error(err.stderr)
      }
      return Promise.reject(err)
    })
}

const calculateFileChecksum = (filePath, algorithm = 'sha256') => {
  return new Promise((resolve, reject) => {
    try {
      const checksumGenerator = crypto.createHash(algorithm)
      const fileStream = fs.createReadStream(filePath)
      fileStream.on('error', function (err) {
        err.message = `CalculateFileChecksum error in FileStream at path "${filePath}": ${err.message}`
        reject(err)
      })
      checksumGenerator.once('readable', function () {
        const checksum = checksumGenerator.read().toString('hex')
        resolve(checksum)
      })
      fileStream.pipe(checksumGenerator)
    } catch (err) {
      err.message = `CalculateFileChecksum error using algorithm "${algorithm}" at path "${filePath}": ${err.message}`
      reject(err)
    }
  })
}

module.exports.runAsync = runAsync
module.exports.runGitAsync = runGitAsync
module.exports.calculateFileChecksum = calculateFileChecksum
