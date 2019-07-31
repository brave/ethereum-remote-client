const InfuraController = require('../../../../app/scripts/controllers/infura')

module.exports = class BraveInfuraController extends InfuraController {

  /*
   * The indicator property represents the severity of any
   * outages or downtime. "none" indicates an "ok" status
   */
  async checkInfuraNetworkStatus () {
    const response = await fetch('https://hfq2h9152m63.statuspage.io/api/v2/status.json')
    const parsedResponse = await response.json()

    this.store.updateState({
      infuraNetworkStatus: parsedResponse,
    })

    return parsedResponse
  }
}
