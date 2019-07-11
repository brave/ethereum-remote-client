const MetamaskController = require('../../../app/scripts/metamask-controller')
const ProviderApprovalController = require('../../../app/scripts/controllers/provider-approval')
const nodeify = require('../../../app/scripts/lib/nodeify')

module.exports = class BraveController extends MetamaskController {

  constructor (opts) {
    super(opts)

    this.optsOpenPopup = opts.openPopup
    this.providerApprovalController = new ProviderApprovalController({
      closePopup: opts.closePopup,
      openPopup: this.openPopup.bind(this),
      keyringController: this.keyringController,
      preferencesController: this.preferencesController,
    })

    this.memStore.config.ProviderApprovalController = this.providerApprovalController.store
    this.memStore.subscribe(this.sendUpdate.bind(this))
  }

  openPopup () {
    const prefStore = this.preferencesController.store
    const hasOnboarded = prefStore.getState().completedOnboarding

    if (hasOnboarded) {
      this.optsOpenPopup()
    } else {
      chrome.tabs.create({ url: 'chrome://wallet/home.html' })
    }
  }

  getApi () {
    const api = super.getApi()
    api.setBatTokenAdded = nodeify(this.preferencesController.setBatTokenAdded, this.preferencesController)
    return api
  }
}
