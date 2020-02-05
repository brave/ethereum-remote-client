const MetamaskController = require('../../../app/scripts/metamask-controller')
const nodeify = require('../../../app/scripts/lib/nodeify')
const percentile = require('percentile')
const {BN} = require('ethereumjs-util')
const GWEI_BN = new BN('1000000000')

module.exports = class BraveController extends MetamaskController {

  getApi () {
    const api = super.getApi()
    api.setBatTokenAdded = nodeify(this.preferencesController.setBatTokenAdded, this.preferencesController)
    api.setHardwareConnect = nodeify(this.preferencesController.setHardwareConnect, this.preferencesController)
    api.setRewardsDisclosureAccepted = nodeify(this.preferencesController.setRewardsDisclosureAccepted, this.preferencesController)
    return api
  }

  getGasPrice () {
    const { recentBlocksController } = this
    const { recentBlocks } = recentBlocksController.store.getState()

    if (recentBlocks.length === 0) {
      return '0x' + GWEI_BN.toString(16)
    }

    const lowestPrices = recentBlocks.map((block) => {
      if (!block.gasPrices || block.gasPrices.length < 1) {
        return GWEI_BN
      }

      // Return GWEI_BN if there are any undefined hex values
      const hasNullHexes = block.gasPrices.some((hex => hex == null))
      if (hasNullHexes) {
        return GWEI_BN
      }

      return block.gasPrices
        .map(hexPrefix => hexPrefix.substr(2))
        .map(hex => new BN(hex, 16))
        .sort((a, b) => {
          return a.gt(b) ? 1 : -1
        })[0]
    }).map(number => number.div(GWEI_BN).toNumber())

    const percentileNum = percentile(65, lowestPrices)
    const percentileNumBn = new BN(percentileNum)
    return '0x' + percentileNumBn.mul(GWEI_BN).toString(16)
  }
}
