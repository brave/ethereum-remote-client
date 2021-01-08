export class Currency {
  static from(id) {
    if (!id)
      return

    return CURRENCIES.find((c) => c.id === id.toUpperCase())
  }

  static mainAndTestNet (mainNet, desc, testNet) {
    testNet = testNet || `T${mainNet.toUpperCase()}`

    return [
      new Currency({ id: mainNet, desc, testNet }),
      new Currency({ id: testNet, desc, mainNet }),
    ]
  }

  constructor({ id, desc, mainNet, testNet }) {
    this.id = id.toUpperCase()
    this.desc = desc
    this._mainNetId = mainNet
    this._testNetId = testNet
  }

  isTestNet() {
    return !!this.mainNet
  }

  get mainNet() {
    if (!this._mainNetId) {
      return this
    }

    return Currency.from(this._mainNetId)
  }

  get testNet() {
    if (!this._testNetId) {
      return null
    }

    return Currency.from(this._testNetId)
  }

  renderConversion(amount, conversionRate) {
    return (conversionRate * (amount / 1e8)).toFixed(2)
  }
}

export const CURRENCIES = [
  ...Currency.mainAndTestNet('BTC', 'Bitcoin'),
  ...Currency.mainAndTestNet('ETH', 'Ethereum'),
  ...Currency.mainAndTestNet('LTC', 'Litecoin'),
  ...Currency.mainAndTestNet('ZEC', 'ZCash'),
]
