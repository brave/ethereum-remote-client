const MetamaskController = require('../../../app/scripts/metamask-controller')
const nodeify = require('../../../app/scripts/lib/nodeify')

module.exports = class BraveController extends MetamaskController {

  constructor (opts) {
    super(opts)

    if (chrome.braveWallet.hasOwnProperty('ready')) {
      chrome.braveWallet.ready()
    }
  }

  getApi () {
    const api = super.getApi()
    api.setBatTokenAdded = nodeify(this.preferencesController.setBatTokenAdded, this.preferencesController)
    api.setHardwareConnect = nodeify(this.preferencesController.setHardwareConnect, this.preferencesController)
    api.setRewardsDisclosureAccepted = nodeify(this.preferencesController.setRewardsDisclosureAccepted, this.preferencesController)
    return api
  }
}
