import { PhishingController } from '@metamask/controllers'

export default class BravePhishingController extends PhishingController {
  constructor (config, state) {
    super(config, state)
    this.configUrl = 'https://mainnet-infura-api.brave.com/blacklist'
  }
}
