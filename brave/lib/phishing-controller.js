import { PhishingController } from '@metamask/controllers'

class BravePhishingController extends PhishingController {
  constructor (config, state) {
    super(config, state)
    this.configUrl = 'https://mainnet-infura-api.brave.com/blacklist'
    this.phishfortResourceUrl = 'https://mainnet-staging-infura-api.bravesoftware.com/blacklist'
  }

  async updatePhishingLists() {
    if (this.disabled) {
      return
    }

    // Whitelists and tolerances still need to be fetched from the original endpoint
    await super.updatePhishingLists()

    const phishFortDenylist = await fetch(this.phishfortResourceUrl)
    const parsedList = await phishFortDenylist.json()

    if (parsedList && this.detector) {
      this.detector.blacklist = parsedList
    }
  }
}

module.exports.PhishingController = BravePhishingController
