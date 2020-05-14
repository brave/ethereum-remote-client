const {
  AddressBookController,
  CurrencyRateController,
  ShapeShiftController,
  PhishingController,
} = require('gaba')
const PhishingDetector = require('eth-phishing-detect/src/detector');

class BravePhishingController extends PhishingController {

  async updatePhishingLists () {
    if (this.disabled) {
      return
    }

    const response = await fetch('https://mainnet-infura-api.brave.com/blacklist')
    const parsedResponse = await response.json()

    if (parsedResponse) {
      this.detector = new PhishingDetector(parsedResponse)
      this.update({ parsedResponse })
    }
  }
}

module.exports = {
  AddressBookController,
  CurrencyRateController,
  ShapeShiftController,
  PhishingController: BravePhishingController
}
