import ObservableStore from 'obs-store'
import BitGoClient from 'brave-bitgo-client'

let supportedCoins = {
  btc: 'Bitcoin',
  ltc: 'Litecoin',
  zec: 'ZCash',
}

function initBitGoEnv () {
  if (process.env.IN_TEST ||
      process.env.METAMASK_DEBUG ||
      process.env.METAMASK_ENV === 'test') {
    supportedCoins = Object.fromEntries(
      Object.entries(supportedCoins).map(([coin, desc]) => [`t${coin}`, `Testnet ${desc}`])
    )
    return 'test'
  }
  return 'prod'
}

const BITGO_ENV = initBitGoEnv()

const uint8ToArrayBuf = (array) => {
  return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
}

class BitGoController {
  constructor (opts = {}) {
    const initState = Object.assign({
      bitgoWallets: [],
    }, opts.initState)

    console.debug('[bitgo]', 'initState', initState)
    this.proxyOrigin = opts.isProduction
      ? 'https://bitgo-proxy.brave.com/'
      : 'http://localhost:3000/'
    this.store = new ObservableStore(initState)
    this.keyringController = opts.keyringController
    this.braveServiceKey = null;
    this.client = new BitGoClient(BITGO_ENV)

    window.chrome.braveWallet.isProviderEnabled('bitgo', (enabled) => {
      console.log('BITGO ENABLED?', enabled)
    })
  }

  _getWallet (id) {
    const { bitgoWallets } = this.store.getState()
    if (!bitgoWallets) {
      return
    }

    if (!bitgoWallets[id]) {
      console.warn('[bitgo]', 'no wallet for', id)
    }

    return bitgoWallets[id]
  }

  _updateWallet (id, wallet) {
    const { bitgoWallets } = this.store.getState()
    const currentWallet = bitgoWallets && bitgoWallets[id]

    this.store.updateState({
      bitgoWallets: Object.assign({}, bitgoWallets, {
        [id]: Object.assign({}, currentWallet, wallet),
      }),
    })
  }

  async _getSeed () {
    const key = await this.keyringController._getSubkey('ethwallet-encryptor')

    return await new Promise((resolve) => {
      // mcu: TODO Brave version check in UI
      window.chrome.braveWallet.getBitGoSeed(uint8ToArrayBuf(key), resolve)
    })
  }

  async _getKeychains (coin) {
    const seed = await this._getSeed()

    // Note "createKeychain" is a local-only function used to create a BitGo keychain, used for signing
    // transactions locally before sending them off to BitGo for their part of the multisig
    return {
      userKeychain: this.client.createKeychain(coin, seed),
      backupKeychain: this.client.createKeychain(coin, seed, true),
    }
  }

  async request (path, opts) {
    const url = `${this.proxyOrigin}${path}`
    const headers = new window.Headers()
    if (!this.braveServiceKey) {
      this.braveServiceKey = await new Promise((resolve) => chrome.braveWallet.getProjectID(resolve));
    }

    headers.append('x-brave-key', this.braveServiceKey)
    headers.append('content-type', 'application/json')

    if (!opts.method) {
      opts.method = 'POST'
    }

    if (opts.body && typeof opts.body === 'object') {
      opts.body = JSON.stringify(opts.body)
    }

    const req = new window.Request(url, Object.assign({ headers }, opts))
    return await window.fetch(req)
  }

  async unlockAndSetKey (password) {
    //await this.keyringController.submitPassword(password)
    //this.encryptionKey = await this.keyringController._getSubkey('ethwallet-encryptor')
  }

  async createWallet (coin) {
    if (!supportedCoins[coin]) {
      throw new Error(`Coin type ${coin} is not supported.`)
    }

    const { userKeychain: { pub: userPub }, backupKeychain: { pub: backupPub } } = await this._getKeychains(coin)
    const req = { coin, userPub, backupPub }
    const response = await this.request('create-wallet', { body: req })
    if (!response.ok) {
      return
    }

    const resp = await response.json()
    if (!resp.error) {
      this._updateWallet(resp.id, Object.assign(req, resp))
    }
    return resp
  }

  async getBalance (id) {
    const bitgoWallet = this._getWallet(id)
    if (!bitgoWallet) {
      return
    }

    const { coin } = bitgoWallet
    const response = await this.request('get-balance', { body: { id, coin } })
    if (!response.ok) {
      return
    }

    const resp = await response.json()
    if (!resp.error) {
      this._updateWallet(id, resp)
    }
    return resp
  }

  async getTransfers (id) {
    const bitgoWallet = this._getWallet(id)
    if (!bitgoWallet) {
      return
    }

    const { coin } = bitgoWallet
    const response = await this.request('get-transaction-history', { body: { id, coin } })
    if (!response.ok) {
      return
    }

    const resp = await response.json()
    if (!resp.error) {
      this._updateWallet(id, {
        transfers: resp.transfers,
      })
    }
    return resp
  }

  async sendTx (id, amount, destinationAddress) {
    const bitgoWallet = this._getWallet(id)
    if (!bitgoWallet) {
      return
    }

    const coin = bitgoWallet.coin
    const response = await this.request('get-tx-prebuild', { body: {
      id,
      coin,
      amount,
      address: destinationAddress,
    }})
    if (!response.ok) {
      return
    }

    const txPrebuild = await response.json()
    if (txPrebuild.error) {
      return
    }

    const { userKeychain, backupKeychain } = await this._getKeychains(coin)
    const { bitgoPub, chain, index } = bitgoWallet
    const addressInfo = { chain, index, coinSpecific: {} }
    const halfSigned = await this.client.signTransaction(
      coin,
      userKeychain,
      backupKeychain,
      bitgoPub,
      txPrebuild,
      destinationAddress,
      amount,
      addressInfo,
    )

    const sendResponse = await this.request('send-tx', { body: {
      id,
      coin,
      halfSigned,
    }})

    if (!sendResponse.ok) {
      return
    }

    return await sendResponse.json()
  }

  verifyAddress (coin, address) {
    return this.client.verifyAddress(coin, address)
  }
}

module.exports = {
  BitGoController,
  supportedCoins,
}
