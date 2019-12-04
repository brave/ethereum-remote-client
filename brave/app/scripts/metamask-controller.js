const MetamaskController = require('../../../app/scripts/metamask-controller')
const nodeify = require('../../../app/scripts/lib/nodeify')
const BravePreferencesController = require('./controllers/preferences')

module.exports = class BraveController extends MetamaskController {

  constructor (opts) {
    super(opts)

    this.optsOpenPopup = opts.openPopup
    this.preferencesController = new BravePreferencesController({
      initState: opts.initState.PreferencesController,
      initLangCode: opts.initLangCode,
      openPopup: opts.openPopup,
      network: this.networkController,
    })
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
    api.setHardwareConnect = nodeify(this.preferencesController.setHardwareConnect, this.preferencesController)
    api.setRewardsDisclosureAccepted = nodeify(this.preferencesController.setRewardsDisclosureAccepted, this.preferencesController)
    return api
  }
}
