'use strict'
import { ethers, Contract } from 'ethers'
import abi from 'human-standard-token-abi'
import fetch from 'node-fetch'
import ObservableStore from 'obs-store'
// import process from 'process'

import config from '../../../../ui/app/pages/swap/swap.config'

const slippagePercentage = 0.0875
const WETHAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const BATAddress = '0x0d8775f648430679a709e98d2b0cb6250d2887ef'
// const { FORKED } = process.env

const { abi: WETH_ABI } = require('./utils/IWETH.json')

export default class SwapsController {
  constructor(opts) {
    const initState = opts.initState || {}
    // this.opts = opts
    // const initSwapControllerState = opts.initSwapControllerState || {}
    this.provider = opts.provider
    // this.buyToken = opts.buyToken
    // this.sellToken = opts.sellToken
    // this.taker = opts.from
    // this.slippagePercentage = opts.slippagePercentage
    // this.sellAmount = opts.sellAmount
    // this.signEthTx = opts.signTransaction
    // this.abi = abi
    // this.ethers = ethers
    // this.buyTokenPercentageFee = buyTokenPercentageFee
    // this.feeAddress = feeAddress
    this.store = new ObservableStore({ initState });
  }
  // constructor (){}

  async wrapETH () {
    const overrides = {
      value: ethers.utils.parseEther(this.sellAmount),
    }
    const receipt = await _tokenInstance(WETHAddress, WETH_ABI, this.provider.getSigner(0)).deposit(overrides)
    return receipt
  }

  async quote (fromAssetSymbol, toAssetSymbol, amount, gasPrice) {
    const qs = _createQueryString({
      sellAmount: amount,
      buyToken: toAssetSymbol,
      sellToken: fromAssetSymbol,
      buyTokenPercentageFee: config.buyTokenPercentageFee,
      slippagePercentage: slippagePercentage,
      // takerAddress: this.taker,
      feeRecipient: config.feeRecipient,
      gasPrice,
    })

    const quoteUrl = `${config.swapAPIQuoteURL}?${qs}`
    const response = await fetch(quoteUrl)
    return response.json()
  }

  async approveTokenAllowance (response) {
    this._waitForTxSuccess(
      this.tokenInstance(this.sellToken)
        .methods
        .approve(
          response.allowanceTarget,
          response.sellAmount,
        ))
  }

  async approveTokenAllowance (allowanceTarget) {
    const receipt = await _tokenInstance(BATAddress, this.abi, this.provider.getSigner(0)).approve(allowanceTarget, this.sellAmount)
    return receipt
  }

  async fillOrder (quote) {
    const gas = 0
    const parameters = {
      from: this.taker,
      to: quote.to,
      data: quote.data,
      value: ethers.utils.parseEther(quote.value).toHexString(),
      gasPrice: ethers.utils.hexValue(parseInt(quote.gasPrice)),
      ...(FORKED ? {} : { gas: ethers.utils.hexValue(parseInt(gas)) }),
    }
    const receipt = await this.provider.getSigner(0).sendTransaction(parameters)
    return receipt
  }
}

function _createQueryString (params) {
  return Object.entries(params)
    .filter(([_, v]) => v)
    .map(([k, v]) => `${k}=${v}`).join('&')
}


function _tokenInstance (tokenAddress, abi, provider) {
  const tokenInstance = new Contract(tokenAddress, abi, provider)
  return tokenInstance
}
