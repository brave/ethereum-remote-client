const RecentBlocksController = require('../../../../app/scripts/controllers/recent-blocks')

module.exports = class BraveRecentBlockController extends RecentBlocksController {

  constructor (opts = {}) {
    super({
      ...opts,
      // Defaults to 40
      historyLength: 20
    })
  }
}
