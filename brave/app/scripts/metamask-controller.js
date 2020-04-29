const MetamaskController = require('../../../app/scripts/metamask-controller')
const BitGoController = require('./controllers/bitgo')
const nodeify = require('../../../app/scripts/lib/nodeify')

module.exports = class BraveController extends MetamaskController {

  constructor (opts) {
    super(opts)

    if (this.keyringController.password) {
      this.createBitGoController()
    }
  }

  createBitGoController () {
    chrome.braveWallet.getProjectId((braveProjectId) => {
      this.bitGoController = new BitGoController({
        ...this.opts,
        keyringController: this.keyringController,
        password: this.keyRingController.password,
        projectId: braveProjectId
      })
    })
  }

  async createNewVaultAndKeychain (password) {
    await super.createNewVaultAndKeychain(password)
    this.createBitGoController()
  }

  async createNewVaultAndRestore (password) {
    await super.createNewVaultAndRestore(password)
    this.createBitGoController()
  }

  getApi () {
    const api = super.getApi()
    api.setBatTokenAdded = nodeify(this.preferencesController.setBatTokenAdded, this.preferencesController)
    api.setHardwareConnect = nodeify(this.preferencesController.setHardwareConnect, this.preferencesController)
    api.setRewardsDisclosureAccepted = nodeify(this.preferencesController.setRewardsDisclosureAccepted, this.preferencesController)
    return api
  }
}
