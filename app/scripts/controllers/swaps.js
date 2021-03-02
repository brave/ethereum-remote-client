'use strict'
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BigNumber = require('bignumber.js');
const process = require('process');
const Web3 = require('web3');
import ethers from 'ethers'
import abi from 'human-standard-token-abi';
import fetch from 'node-fetch'


const API_QUOTE_URL = 'https://api.0x.org/swap/v1/quote';
// TODO: THIS IS MY ADDRESS AND SHOULD BE CHANGED BEFORE GO LIVE
// TODO: GENERATE ADDRESS
const feeAddress = "0x324Ea50e48C07dEb39c8e98f0479d4aBD2Bd8e9a"
const buyTokenPercentageFee=0.0875


// Takes a buy and sell token , returns the quote , then executes the transaction. 
// TODO: Refresh quotes
// TODO: add signer in opts
// TODO: Observable Store
// Token Methods
// Test

export default class SwapsController {
    constructor(opts){
        super()

        this.opts = opts 
        // const initSwapControllerState = opts.initSwapControllerState || {} 
        this.provider = opts.provider
        this.buyToken = opts.buyToken
        this.sellToken = opts.sellToken
        this.taker = opts.from
        this.slippagePercentage = opts.slippagePercentage
        this.sellAmount = opts.sellAmount
        this.buyAmount = opts.buyAmount

        this.abi = abi
        this.ethers = ethers
        this.buyTokenPercentageFee = buyTokenPercentageFee
        this.feeAddress = feeAddress
    }



    wrapETH(){
        _waitForTxSuccess(weth.methods.deposit().send({
                value: sellAmountWei,
                from: taker,
            }));
    }

    quote() {
        const qs = createQueryString({
            sellToken: this.sellToken,
            buyToken: this.buyToken,
            sellAmount: this.etherToWei(this.sellAmount),
            buyTokenPercentageFee: this.buyTokenPercentageFee,
            // 0x-API cannot perform taker validation in forked mode.
            takerAddress: this.taker,
        });
        const quoteUrl = `${API_QUOTE_URL}?${qs}`;
        const response = await fetch(quoteUrl);
        return response.json()
    }

    approveTokenAllowance(response){
        this._waitForTxSuccess(
            this.tokenInstance(this.sellToken)
                .methods
                .approve(
                    response.allowanceTarget,
                    response.sellAmount,
                ))
    }

    fillOrder (){
        const receipt = await _waitForTxSuccess(web3.eth.sendTransaction({
            from: this.taker,
            to: response.to,
            data: response.data,
            value: response.value,
            gasPrice: response.gasPrice,
            gas : response.gas ,
        }));
        return receipt
    }


    // PRIVATE METHODS
    _createQueryString(params) {
        return Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
    }
    
    // Wait for a web3 tx `send()` call to be mined and return the receipt.
     _waitForTxSuccess(tx) {
        return new Promise((accept, reject) => {
            try {
                tx.on('error', err => reject(err));
                tx.on('receipt', receipt => accept(receipt));
            } catch (err) {
                reject(err);
            }
        });
    }

    _tokenInstance(token){
        let tokenInstance = new this.ethers.Contract(token, this.abi, this.provider)
        return tokenInstance
    }
    
    createProvider() {
        const provider = /^ws?:\/\//.test(RPC_URL)
            ? new Web3.providers.WebsocketProvider(RPC_URL)
            : new Web3.providers.HttpProvider(RPC_URL);
        if (!MNEMONIC) {
            return provider;
        }
        return new HDWalletProvider({ mnemonic: MNEMONIC, providerOrUrl: provider });
    }
    
    createWeb3() {
        return new Web3(createProvider());
    }
    
    etherToWei(etherAmount) {
        return new BigNumber(etherAmount)
            .times('1e18')
            .integerValue()
            .toString(10);
    }
    
    weiToEther(weiAmount) {
        return new BigNumber(weiAmount)
            .div('1e18')
            .toString(10);
    }
}

