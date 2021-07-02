'use strict'
import fetch from 'node-fetch'
import ObservableStore from 'obs-store'
import getConfig from '../../../ui/app/pages/swap/swap.config'


export default class SwapsController {
  constructor (opts) {
    const initState = opts.initState || {}
    this.provider = opts.provider
    this.store = new ObservableStore({ initState })
  }

  async quote (fromAsset, toAsset, amount, gasPrice, slippage, selectedAddress, network, full) {
    const config = getConfig(network)

    const baseQueryObj = {
      takerAddress: selectedAddress,
      sellAmount: amount,
      buyToken: toAsset.address || toAsset.symbol,
      sellToken: fromAsset.address || fromAsset.symbol,
      buyTokenPercentageFee: config.buyTokenPercentageFee,
      slippagePercentage: slippage / 100,
      feeRecipient: config.feeRecipient,
      gasPrice,
    }

    // Add an affiliateAddress field if querying the full quote, which allows
    // us to tag the trade for metrics and/or aggregated statistics.
    //
    // We're using the same ETH address as feeRecipient for this purpose.
    const queryObj = full
      ? { affiliateAddress: config.feeRecipient, ...baseQueryObj }
      : baseQueryObj

    const qs = createQueryString(queryObj)

    const path = full ? 'quote' : 'price'
    const quoteUrl = `${config.swapAPIURL}/${path}?${qs}`

    const response = await fetch(quoteUrl)
    return response.json()
  }
}

export function createQueryString (params) {
  return Object.entries(params)
    .filter(([_, v]) => v)
    .map(([k, v]) => `${k}=${v}`).join('&')
}
