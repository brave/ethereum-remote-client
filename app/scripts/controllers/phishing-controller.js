import { PhishingController } from '@metamask/controllers'

const PhishingDetector = require('eth-phishing-detect/src/detector')

export default class BravePhishingController extends PhishingController {
  constructor (config, state) {
    super(config, state)
    this.configUrl = 'https://mainnet-infura-api.brave.com/blacklist'
    this.phishfortResourceUrl = 'https://mainnet-infura-api.brave.com/phishfort'
  }

  async fetchPhishfortDenyList () {
    const phishFortDenylist = await fetch(this.phishfortResourceUrl) // eslint-disable-line no-undef
    return await phishFortDenylist.json()
  }

  async update (state, overwrite = false) {
    if (state.phishing && state.phishing.blacklist) {
      const denyList = await this.fetchPhishfortDenyList()
      if (denyList) {
        state.phishing.blacklist = [
          ...state.phishing.blacklist,
          ...denyList,
        ]
        this.detector = new PhishingDetector(state.phishing)
      }
    }
    super.update(state, overwrite)
  }
}
