const MetamaskController = require('../../../app/scripts/metamask-controller')
const { BitGoController } = require('./controllers/bitgo')
const nodeify = require('../../../app/scripts/lib/nodeify')

module.exports = class BraveController extends MetamaskController {

  constructor (opts) {
    super(opts)

    this.bitGoController = new BitGoController({
      ...this.opts,
      keyringController: this.keyringController
    })

    if (this.keyringController.password) {
      this.bitGoController.unlockAndSetKey(this.keyringController.password)
    }
  }

  async createNewVaultAndKeychain (password) {
    await super.createNewVaultAndKeychain(password)
    this.bitGoController.unlockAndSetKey(password)
  }

  async createNewVaultAndRestore (password) {
    await super.createNewVaultAndRestore(password)
    this.bitGoController.unlockAndSetKey(password)
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

    return api
  }
}
