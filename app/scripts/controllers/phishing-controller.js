import { PhishingController } from '@metamask/controllers'

const PhishingDetector = require('eth-phishing-detect/src/detector')

export default class BravePhishingController extends PhishingController {
  constructor (config, state) {
    super(config, state)
    this.configUrl = 'https://mainnet-infura-api.brave.com/blacklist'
    this.phishfortDomainList = 'https://raw.githubusercontent.com/phishfort/phishfort-lists/master/whitelists/domains.json'
    this.phishfortHostingList = 'https://raw.githubusercontent.com/phishfort/phishfort-lists/master/whitelists/hostingproviders.json'
    this.phishfortResourceUrl = 'https://mainnet-infura-api.brave.com/phishfort'
  }

  async fetchPhishfortLists () {
    const phishFortDenyList = await fetch(this.phishfortResourceUrl) // eslint-disable-line no-undef
    const phishFortDomainList = await fetch(this.phishfortDomainList) // eslint-disable-line no-undef
    const phishFortHostingList = await fetch(this.phishfortHostingList) // eslint-disable-line no-undef
    return Promise.all([
      phishFortDenyList.json(),
      phishFortDomainList.json(),
      phishFortHostingList.json(),
    ])
  }

  async update (state, overwrite = false) {
    if (state.phishing && state.phishing.blacklist && state.phishing.whitelist) {
      const [denyList, domainList, hostingList] = await this.fetchPhishfortLists()
      if (denyList || domainList || hostingList) {
        if (denyList) {
          state.phishing.blacklist = [
            ...state.phishing.blacklist,
            ...denyList,
          ]
        }
        if (hostingList || domainList) {
          state.phishing.whitelist = [
            ...state.phishing.whitelist,
            ...(hostingList || []),
            ...(domainList || []),
          ]
        }
        this.detector = new PhishingDetector(state.phishing)
      }
    }
    super.update(state, overwrite)
  }
}
