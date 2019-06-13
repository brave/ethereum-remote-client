const MetamaskController = require('../../../app/scripts/metamask-controller')
const nodeify = require('../../../app/scripts/lib/nodeify')

module.exports = class BraveController extends MetamaskController {
  constructor (opts) {
    super(opts)
  }

  getApi () {
    const api = super.getApi()
    api.setBatTokenAdded = nodeify(this.preferencesController.setBatTokenAdded, this.preferencesController)
    return api
  }
}
