const PreferencesController = require('../../../../app/scripts/controllers/preferences')

module.exports = class BravePreferencesController extends PreferencesController {
  constructor (opts = {}) {
    if (opts.initState === undefined) {
      opts['initState'] = {}
    }
    opts.initState.batTokenAdded = false
    super(opts)
  }

  setBatTokenAdded () {
    this.store.updateState({ batTokenAdded: true })
    return Promise.resolve(true)
  }
}
