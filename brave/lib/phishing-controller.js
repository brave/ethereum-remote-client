import { PhishingController } from '@metamask/controllers'

class BravePhishingController extends PhishingController {
  constructor (config, state) {
    super(config, state)
    this.configUrl = 'https://mainnet-infura-api.brave.com/blacklist'
    this.phishfortResourceUrl = 'https://mainnet-infura-api.brave.com/phishfort'
  }

  async updatePhishingLists () {
    if (this.disabled) {
      return
    }

    // Whitelists and tolerances still need to be fetched from the original endpoint
    await super.updatePhishingLists()

    const phishFortDenylist = await fetch(this.phishfortResourceUrl) // eslint-disable-line no-undef
    const parsedList = await phishFortDenylist.json()

    if (parsedList && this.detector) {
      this.detector.blacklist = parsedList
    }
  }
}

module.exports.PhishingController = BravePhishingController
