'use strict'
import {ethers, Contract} from 'ethers'
import abi from 'human-standard-token-abi';
import fetch from 'node-fetch'

const API_QUOTE_URL = 'https://api.0x.org/swap/v1/quote';
// TODO: THIS IS MY ADDRESS AND SHOULD BE CHANGED BEFORE GO LIVE
// TODO: GENERATE ADDRESS
const feeAddress = "0x324Ea50e48C07dEb39c8e98f0479d4aBD2Bd8e9a"
const buyTokenPercentageFee=0.0875
const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const BATAddress = "0x0d8775f648430679a709e98d2b0cb6250d2887ef"

const { abi: WETH_ABI } = require('./swap-utils/IWETH.json');




// Takes a buy and sell token , returns the quote , then executes the transaction. 
// TODO: Refresh quotes
// TODO: add signer in opts
// TODO: Observable Store
// Token Methods
// Test
// Get wallet's BAT 

// this.provider = opts.provider
// this.getPermittedAccounts = opts.getPermittedAccounts
// this.blockTracker = opts.blockTracker
// this.signEthTx = opts.signTransaction

export default class SwapsController {
    constructor(opts){
        // super()

        // this.opts = opts 
        // const initSwapControllerState = opts.initSwapControllerState || {} 
        this.provider = opts.provider
        this.buyToken = opts.buyToken
        this.sellToken = opts.sellToken
        this.taker = opts.from
        this.slippagePercentage = opts.slippagePercentage
        this.sellAmount = opts.sellAmount
        this.signEthTx = opts.signTransaction
        this.abi = abi
        this.ethers = ethers
        this.buyTokenPercentageFee = buyTokenPercentageFee
        this.feeAddress = feeAddress
    }

    async wrapETH(){
        let overrides = {
            value: ethers.utils.parseEther(this.sellAmount)
        };
       let receipt =  await _tokenInstance(WETHAddress, WETH_ABI, this.provider.getSigner(0)).deposit(overrides);
       return receipt
    }

    // async quote() {
    //     const qs = _createQueryString({
    //         sellToken: this.sellToken,
    //         buyToken: this.buyToken,
    //         sellAmount: _etherToWei(this.sellAmount),
    //         buyTokenPercentageFee: this.buyTokenPercentageFee,
    //         takerAddress: this.taker,
    //     });
    //     const quoteUrl = `${API_QUOTE_URL}?${qs}`;
    //     const response = fetch(quoteUrl);
    //     return response.json()
    // }

    async quote() {
        const qs = _createQueryString({
            sellAmount: this.sellAmount,
            buyToken: this.buyToken,
            sellToken: this.sellToken,
            buyTokenPercentageFee: this.buyTokenPercentageFee,
            slippagePercentage: this.slippagePercentage,
            takerAddress: this.taker,
            feeRecipient: feeAddress
        });
        const quoteUrl = `${API_QUOTE_URL}?${qs}`;
        console.log(quoteUrl)
        const response = await fetch(quoteUrl);
        return response
    }


    async approveTokenAllowance(response){
        this._waitForTxSuccess(
            this.tokenInstance(this.sellToken)
                .methods
                .approve(
                    response.allowanceTarget,
                    response.sellAmount,
                ))
    }

    async approveTokenAllowance(allowanceTarget){
        let receipt =  await _tokenInstance(BATAddress, this.abi, this.provider.getSigner(0)).approve(allowanceTarget, this.sellAmount);
        return receipt
    }

    async fillOrder (to, data, value, gasPrice, gas){
        const receipt = await this.provider.getSigner(0).sendTransaction({
            from: this.taker,
            to: to,
            data: data,
            value: value,
            gasPrice: gasPrice,
            gas : gas ,
        });
        return receipt
    }   
}

function _createQueryString(params) {
    return Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
}

// Wait for a web3 tx `send()` call to be mined and return the receipt.
// function _waitForTxSuccess(tx) {
//     return new Promise((accept, reject) => {
//         try {
//             tx.on('error', err => reject(err));
//             tx.on('receipt', receipt => accept(receipt));
//         } catch (err) {
//             reject(err);
//         }
//     });
// }

function _tokenInstance(tokenAddress, abi, provider){
    let tokenInstance = new Contract(tokenAddress, abi, provider)
    return tokenInstance
}


function _createWeb3() {
    return new Web3(createProvider());
}

function _etherToWei(etherAmount) {
    return new BigNumber(etherAmount)
        .times('1e18')
        .integerValue()
        .toString(10);
}

function _weiToEther(weiAmount) {
    return new BigNumber(weiAmount)
        .div('1e18')
        .toString(10);
}