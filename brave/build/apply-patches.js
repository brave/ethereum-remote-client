// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

const path = require('path')
const GitPatcher = require('./lib/git-patcher')

const applyPatches = async () => {
  const patchDir = path.join(path.dirname(__filename), '..', 'patches')
  const metaMaskDir = path.join(path.dirname(__filename), '..', '..')
  const metaMaskPatcher = new GitPatcher(patchDir, metaMaskDir)

  console.log('Applying patches...')

  const metaMaskPatchStatus = await metaMaskPatcher.applyPatches()
  const hasPatchingError = metaMaskPatchStatus.some((p) => p.error)

  if (hasPatchingError) {
    console.error('Could not apply patches')
    process.exit(1)
  }

  console.log('Successfully applied patches.')
}

applyPatches()
