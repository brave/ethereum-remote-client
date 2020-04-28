const ObservableStore = require('obs-store')
const bgUtil = require('brave-bitgo-client')

const supportedCoins = {
  btc: 'Bitcoin',
  bch: 'Bitcoin Cash',
  btg: 'Bitcoin Gold',
  bsv: 'Bitcoin SV',
  zec: 'ZCash',
  xlm: 'Stellar',
  xrp: 'Ripple',
  ltc: 'Litecoin',
  dash: 'Dash',
  algo: 'Algorand',
  trx: 'Tron',
  eos: 'Eos'
}

const uint8ToArrayBuf = (array) => {
  return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
}

const promiseGetSeed = (key) => {
  return new Promise((resolve) => {
    if (window.chrome && window.chrome.braveWallet) {
      window.chrome.braveWallet.getBitGoSeed(key, resolve)
    } else {
      // polyfill
      const seed = new Uint8Array(32)
      window.crypto.getRandomValues(seed)
      resolve(uint8ToArrayBuf(seed))
    }
  })
}

class BitGoController {
  constructor (opts = {}) {
    const initState = opts.initState || {}
    this.proxyOrigin = opts.isProduction
      ? 'https://bitgo-proxy.brave.com/' // TODO: update this
      : 'http://localhost:3000/'
    this.store = new ObservableStore(initState)
    // keyringController must be initialized with the password and unlocked
    // TODO: refactor KeyringController so we're not calling a private interface
    if (opts.password) {
      opts.keyringController.submitPassword(opts.password)
    }
    this.encryptionKey = opts.keyringController._getSubkey('ethwallet-encryptor')
    // to get project ID, call chrome.braveWallet.getProjectID
    this.braveServiceKey = opts.projectId
  }

  request (path, opts) {
    const url = `${this.proxyOrigin}${path}`
    const headers = new window.Headers()
    headers.append('x-brave-key', this.braveServiceKey)
    const req = new window.Request(url, Object.assign({ headers }, opts))
    return window.fetch(req)
  }

  async createWallet (coin) {
    if (!supportedCoins[coin]) {
      throw new Error(`Coin type ${coin} is not supported.`)
    }
    const seed = await promiseGetSeed(uint8ToArrayBuf(this.encryptionKey))
    const userKeychain = bgUtil.createKeychain(coin, seed)
    const backupKeychain = bgUtil.createKeychain(coin, seed)
    const req = {
      coin,
      userPub: userKeychain.pub,
      backupPub: backupKeychain.pub
    }
    const response = await this.request('create-wallet', {
      method: 'POST',
      body: JSON.stringify(req)
    })
    if (!response.ok) {
      return
    }
    const resp = await response.json()
    if (!resp.error) {
      const state = this.store().getState()
      const bitgoWallets = state.bitgoWallets || {}
      bitgoWallets[resp.id] = Object.assign(req, resp)
      this.store.updateState({
        bitgoWallets
      })
    }
    return resp
  }

  async getBalance (id) {
    const bitgoWallets = this.store().getState().bitgoWallets
    const bitgoWallet = bitgoWallets[id]
    if (!bitgoWallet) {
      return
    }
    const response = await this.request('get-balance', {
      method: 'GET',
      body: JSON.stringify({
        id,
        coin: bitgoWallet.coin
      })
    })
    if (!response.ok) {
      return
    }
    const resp = await response.json()
    if (!resp.error) {
      Object.assign(bitgoWallet, resp)
      this.store.updateState({
        bitgoWallets
      })
    }
    return resp
  }

  async getTransfers (id) {
    const bitgoWallets = this.store().getState().bitgoWallets
    const bitgoWallet = bitgoWallets[id]
    if (!bitgoWallet) {
      return
    }
    const response = await this.request('get-transaction-history', {
      method: 'GET',
      body: JSON.stringify({
        id,
        coin: bitgoWallet.coin
      })
    })
    if (!response.ok) {
      return
    }
    const resp = await response.json()
    if (!resp.error) {
      bitgoWallet.transfers = response.transfers
      this.store.updateState({
        bitgoWallets
      })
    }
    return resp
  }

  async sendTx (id, amount, destinationAddress) {
    const bitgoWallets = this.store().getState().bitgoWallets
    const bitgoWallet = bitgoWallets[id]
    if (!bitgoWallet) {
      return
    }
    const coin = bitgoWallet.coin
    const response = await this.request('get-tx-prebuild', {
      method: 'GET',
      body: JSON.stringify({
        id,
        coin
      })
    })
    if (!response.ok) {
      return
    }
    const resp = await response.json()
    if (!resp.error) {
      const seed = await promiseGetSeed(uint8ToArrayBuf(this.encryptionKey))
      const userKeychain = bgUtil.createKeychain(coin, seed)
      const backupKeychain = bgUtil.createKeychain(coin, seed)
      const halfSigned = await bgUtil.signTransaction(coin,
        userKeychain, backupKeychain, bitgoWallet.bitgoPub,
        resp, destinationAddress, amount, {
          chain: bitgoWallet.chain,
          index: bitgoWallet.index,
          coinSpecific: {}
        })
      const sendResponse = await this.request('send-tx', {
        method: 'POST',
        body: JSON.stringify({
          id,
          coin,
          halfSigned
        })
      })
      if (!sendResponse.ok) {
        return
      }
      const sendResp = await sendResponse.json()
      return sendResp
    }
  }
}

module.exports = BitGoController
