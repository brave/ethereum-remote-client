const BlockTracker = require('eth-block-tracker')

module.exports = class BraveBlockTracker extends BlockTracker {

  constructor (opts = {}) {
    super({
      ...opts,
      // Defaults to 20 seconds
      pollingInterval: (30 * 1000)
    })
  }
}
