'use strict'
import fetch from 'node-fetch'
import ObservableStore from 'obs-store'
import config from '../../../ui/app/pages/swap/swap.config'


export default class SwapsController {
  constructor (opts) {
    const initState = opts.initState || {}
    this.provider = opts.provider
    this.store = new ObservableStore({ initState })
  }

  async quote (fromAssetSymbol, toAssetSymbol, amount, gasPrice) {
    const qs = _createQueryString({
      sellAmount: amount,
      buyToken: toAssetSymbol,
      sellToken: fromAssetSymbol,
      buyTokenPercentageFee: config.buyTokenPercentageFee,
      slippagePercentage: config.defaultSlippage,
      feeRecipient: config.feeRecipient,
      gasPrice,
    })

    const quoteUrl = `${config.swapAPIQuoteURL}?${qs}`
    const response = await fetch(quoteUrl)
    return response.json()
  }
}

function _createQueryString (params) {
  return Object.entries(params)
    .filter(([_, v]) => v)
    .map(([k, v]) => `${k}=${v}`).join('&')
}
