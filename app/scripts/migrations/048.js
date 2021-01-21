const version = 48
import { cloneDeep } from 'lodash'
import { getPlatform } from '../lib/util'
import { PLATFORM_BRAVE } from '../lib/enums'

/**
 * The purpose of this migration is to remove the {@code ipfsGateway} setting and default to native Brave ipfs.
 */
export default {
  version,
  migrate: async function (originalVersionedData) {
    const versionedData = cloneDeep(originalVersionedData)
    versionedData.meta.version = version
    const state = versionedData.data
    versionedData.data = transformState(state)
    return versionedData
  },
}

function transformState (state) {
  // if it is Brave Browser and chrome.ipfs flag is available then use native Brave ipfs
  const isChromeIpfsAvailable = window?.chrome?.ipfs?.getIPFSEnabled
  if (getPlatform() === PLATFORM_BRAVE && isChromeIpfsAvailable) {
    state.PreferencesController.ipfsGateway = 'ipfs://<cid>'
  } else {
    // If someone is using an old version of Brave default to dweb.link if no preference is defined
    if (state?.PreferencesController) {
      const ipfsGateway = state.PreferencesController.ipfsGateway
      if (ipfsGateway === undefined) {
        state.PreferencesController.ipfsGateway = 'dweb.link'
      }
    }
  }

  return state
}
