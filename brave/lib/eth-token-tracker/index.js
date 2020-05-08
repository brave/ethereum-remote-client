const TokenTracker = require('eth-token-tracker')

module.exports = class BraveTokenTracker extends TokenTracker {

  constructor (opts = {}) {
    super({
      ...opts,
      // Is currently configured to 8 seconds
      pollingInterval: (16 * 1000)
    })
  }
}
