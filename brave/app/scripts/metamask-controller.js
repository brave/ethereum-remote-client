const MetamaskController = require('../../../app/scripts/metamask-controller')
const { BitGoController } = require('./controllers/bitgo')
const nodeify = require('../../../app/scripts/lib/nodeify')

module.exports = class BraveController extends MetamaskController {

  constructor (opts) {
    super(opts)

    chrome.braveWallet.getProjectID((projectId) => {
      this.bitGoController = new BitGoController({
        ...this.opts,
        projectId: projectId,
        keyringController: this.keyringController
      })

      if (this.keyringController.password) {
        this.bitGoController.unlockAndSetKey(this.keyringController.password)
      }
    })
  }

  getApi () {
    const api = super.getApi()

    // Brave modifications
    api.setBatTokenAdded = nodeify(this.preferencesController.setBatTokenAdded, this.preferencesController)
    api.setHardwareConnect = nodeify(this.preferencesController.setHardwareConnect, this.preferencesController)
    api.setRewardsDisclosureAccepted = nodeify(this.preferencesController.setRewardsDisclosureAccepted, this.preferencesController)

    // BitGo
    api.createBitGoWallet = nodeify(this.bitGoController.createWallet, this.bitGoController)
    api.getBitGoWalletBalance = nodeify(this.bitGoController.getBalance, this.bitGoController)
    api.getBitGoWalletTransfers = nodeify(this.bitGoController.getTransfers, this.bitGoController)
    api.sendBitGoTransaction = nodeify(this.bitGoController.sendTx, this.bitGoController)
    api.unlockAndSetKey = nodeify(this.bitGoController.unlockAndSetKey, this.bitGoController)

    return api
  }
}
