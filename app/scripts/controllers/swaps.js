'use strict'
import { ethers, Contract } from 'ethers'
import abi from 'human-standard-token-abi'
import fetch from 'node-fetch'
import ObservableStore from 'obs-store'
// import process from 'process'

const API_QUOTE_URL = 'https://api.0x.org/swap/v1/quote'
// TODO: THIS IS MY ADDRESS AND SHOULD BE CHANGED BEFORE GO LIVE
// TODO: GENERATE ADDRESS
const feeAddress = '0x324Ea50e48C07dEb39c8e98f0479d4aBD2Bd8e9a'
const buyTokenPercentageFee = 0.0875
const slippagePercentage = 0.0875
const WETHAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const BATAddress = '0x0d8775f648430679a709e98d2b0cb6250d2887ef'
// const { FORKED } = process.env

const { abi: WETH_ABI } = require('./swap-utils/IWETH.json')


const initialState = {
  swap: {
    gasLimit: null,
    gasPrice: null,
    gasTotal: null,
    tokenBalance: '0x0',
    tokenToBalance: '0x0',
    tokenFromBalance: '0x0',
    from: '',
    to: '',
    tokensTo: [{
      address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      decimals: 18,
      symbol: 'AAVE',
    },{
      address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      decimals: 18,
      symbol: 'YFI',
    },
    {
      address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      decimals: 18,
      symbol: 'COMP',
    },
    {
      address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
      decimals: 18,
      symbol: 'ZRX',
    }],
    tokensFrom: [{
      address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      decimals: 18,
      symbol: 'AAVE',
    },{
      address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      decimals: 18,
      symbol: 'YFI',
    },
    {
      address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      decimals: 18,
      symbol: 'COMP',
    },
    {
      address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
      decimals: 18,
      symbol: 'ZRX',
    },
  ],
    amount: '0',
    memo: '',
    errors: {},
    maxModeOn: false,
    editingTransactionId: null,
  },
};

export default class SwapsController {
  constructor (opts) {
    // this.opts = opts
    // const initSwapControllerState = opts.initSwapControllerState || {}
    // this.provider = opts.provider
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
    this.store = new ObservableStore({
      swap: { ...initialState.swap },
    });
  }
  // constructor (){}

  async wrapETH () {
    const overrides = {
      value: ethers.utils.parseEther(this.sellAmount),
    }
    const receipt = await _tokenInstance(WETHAddress, WETH_ABI, this.provider.getSigner(0)).deposit(overrides)
    return receipt
  }

  async quote (sellAmount, buyToken,sellToken) {
    const qs = _createQueryString({
      sellAmount: sellAmount,
      buyToken: buyToken,
      sellToken: sellToken,
      buyTokenPercentageFee: buyTokenPercentageFee,
      slippagePercentage: slippagePercentage,
      // takerAddress: this.taker,
      feeRecipient: feeAddress,
    })
    const quoteUrl = `${API_QUOTE_URL}?${qs}`
    console.log(quoteUrl)
    const response = await fetch(quoteUrl)
    const { swap } = this.store.getState()
    this.store.updateState({
      swap: {
        ...swap,
        quotes: response.json,
      },
    })
    
    return swap.quotes
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

  async fillOrder (to, data, value, gasPrice, gas) {
    const parameters = {
      from: this.taker,
      to: to,
      data: data,
      value: ethers.utils.parseEther(value).toHexString(),
      gasPrice: ethers.utils.hexValue(parseInt(gasPrice)),
      // ...(FORKED ? {} : { gas :  ethers.utils.hexValue(parseInt(gas)) }),
    }
    const receipt = await this.provider.getSigner(0).sendTransaction(parameters)
    return receipt
  }
}

function _createQueryString (params) {
  return Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')
}


function _tokenInstance (tokenAddress, abi, provider) {
  const tokenInstance = new Contract(tokenAddress, abi, provider)
  return tokenInstance
}
