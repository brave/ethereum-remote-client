import assert from 'assert'
import EventEmitter from 'events'
import ObservableStore from 'obs-store'
import ComposedStore from 'obs-store/lib/composed'
import EthQuery from 'eth-query'
import JsonRpcEngine from 'json-rpc-engine'
import providerFromEngine from 'eth-json-rpc-middleware/providerFromEngine'
import log from 'loglevel'
import createMetamaskMiddleware from './createMetamaskMiddleware'
import createInfuraClient from './createInfuraClient'
import createJsonRpcClient from './createJsonRpcClient'
import createLocalhostClient from './createLocalhostClient'
import { createSwappableProxy, createEventEmitterProxy } from 'swappable-obj-proxy'

import {
  RINKEBY,
  MAINNET,
  LOCALHOST,
  INFURA_PROVIDER_TYPES,
  NETWORK_TYPE_TO_ID_MAP,
  NetworkCapabilities,
} from './enums'

const env = process.env.METAMASK_ENV
const METAMASK_DEBUG = process.env.METAMASK_DEBUG

let defaultProviderConfigType
let defaultProviderChainId
if (process.env.IN_TEST === 'true') {
  defaultProviderConfigType = LOCALHOST
  // Decimal 5777, an arbitrary chain ID we use for testing
  defaultProviderChainId = '0x1691'
} else if (METAMASK_DEBUG || env === 'test') {
  defaultProviderConfigType = RINKEBY
} else {
  defaultProviderConfigType = MAINNET
}

const defaultProviderConfig = {
  type: defaultProviderConfigType,
  ticker: 'ETH',
}
if (defaultProviderChainId) {
  defaultProviderConfig.chainId = defaultProviderChainId
}

const defaultNetworkCapabilities = {
  [NetworkCapabilities.EIP1559]: false,
}

export default class NetworkController extends EventEmitter {

  constructor (opts = {}) {
    super()

    // create stores
    this.providerStore = new ObservableStore(
      opts.provider || { ...defaultProviderConfig },
    )
    this.networkStore = new ObservableStore('loading')

    // Keep track of the EVM capabilities active for the current network.
    this.networkCapabilities = new ObservableStore({
      ...defaultNetworkCapabilities,
    })

    this.store = new ComposedStore({
      provider: this.providerStore,
      network: this.networkStore,
      networkCapabilities: this.networkCapabilities,
    })

    // provider and block tracker
    this._provider = null
    this._blockTracker = null

    // provider and block tracker proxies - because the network changes
    this._providerProxy = null
    this._blockTrackerProxy = null

    this.on('networkDidChange', this.lookupNetwork)
  }

  initializeProvider (providerParams) {
    this._baseProviderParams = providerParams
    const { type, rpcUrl, chainId } = this.getProviderConfig()
    this._configureProvider({ type, rpcUrl, chainId })
    this.lookupNetwork()
  }

  // return the proxies so the references will always be good
  getProviderAndBlockTracker () {
    const provider = this._providerProxy
    const blockTracker = this._blockTrackerProxy
    return { provider, blockTracker }
  }

  verifyNetwork () {
    // Check network when restoring connectivity:
    if (this.isNetworkLoading()) {
      this.lookupNetwork()
    }
  }

  getNetworkState () {
    return this.networkStore.getState()
  }

  setNetworkState (network) {
    // Set network capabilities whenever the network is switched. We always
    // revert to default if the network is loading.
    network === 'loading'
      ? this.networkCapabilities.putState({ ...defaultNetworkCapabilities })
      : this.setNetworkCapabilities()

    this.networkStore.putState(network)
  }

  isNetworkLoading () {
    return this.getNetworkState() === 'loading'
  }

  lookupNetwork () {
    // Prevent firing when provider is not defined.
    if (!this._provider) {
      log.warn('NetworkController - lookupNetwork aborted due to missing provider')
      return
    }

    const { type, chainId: configChainId } = this.getProviderConfig()
    const chainId = NETWORK_TYPE_TO_ID_MAP[type]?.chainId || configChainId

    if (!chainId) {
      log.warn('NetworkController - lookupNetwork aborted due to missing chainId')
      this.setNetworkState('loading')
      return
    }

    // Ping the RPC endpoint so we can confirm that it works
    const ethQuery = new EthQuery(this._provider)
    const initialNetwork = this.getNetworkState()
    ethQuery.sendAsync({ method: 'net_version' }, (err, _networkVersion) => {
      const currentNetwork = this.getNetworkState()
      if (initialNetwork === currentNetwork) {
        if (err) {
          this.setNetworkState('loading')
          return
        }

        // Now we set the network state to the chainId computed earlier
        this.setNetworkState(chainId)
      }
    })
  }

  setRpcTarget (rpcUrl, chainId, ticker = 'ETH', nickname = '', rpcPrefs) {
    this.setProviderConfig({
      type: 'rpc',
      rpcUrl,
      chainId,
      ticker,
      nickname,
      rpcPrefs,
    })
  }

  async setProviderType (type, rpcUrl = '', ticker = 'ETH', nickname = '') {
    assert.notEqual(type, 'rpc', `NetworkController - cannot call "setProviderType" with type 'rpc'. use "setRpcTarget"`)
    assert(INFURA_PROVIDER_TYPES.includes(type) || type === LOCALHOST, `NetworkController - Unknown rpc type "${type}"`)
    const { chainId } = NETWORK_TYPE_TO_ID_MAP[type]
    this.setProviderConfig({ type, rpcUrl, chainId, ticker, nickname })
  }

  resetConnection () {
    this.setProviderConfig(this.getProviderConfig())
  }

  /**
   * Sets the provider config and switches the network.
   */
  setProviderConfig (config) {
    this.providerStore.updateState(config)
    this._switchNetwork(config)
  }

  getProviderConfig () {
    return this.providerStore.getState()
  }

  //
  // Methods to detect network capabilities
  //

  /**
   * Get the headers of the latest block for the current network.
   *
   * @returns {Promise<Object>} Returns a promise of the latest block header.
   */
  getLatestBlock () {
    const { provider } = this.getProviderAndBlockTracker()
    const ethQuery = new EthQuery(provider)

    return new Promise((resolve, reject) => {
      ethQuery.sendAsync(
        {
          method: 'eth_getBlockByNumber',
          params: [
            'latest', // tag representing latest block number
            false, // boolean flag to prevent returning full transaction objects
          ],
        },
        (err, block) => {
          if (err) {
            return reject(err)
          }
          return resolve(block)
        },
      )
    })
  }

  /**
   * Method to detect network capabilities and update the networkCapabilities
   * store.
   */
  async setNetworkCapabilities () {
    // Avoid querying for network capabilities if already set.
    const { [NetworkCapabilities.EIP1559]: hasEIP1559 } = this.networkCapabilities.getState()
    if (hasEIP1559) {
      return
    }

    const latestBlock = await this.getLatestBlock()

    // Detect if network supports EIP-1559.
    //
    // We consider EIP-1559 activated if baseFeePerGas is available in the
    // block headers.
    const { baseFeePerGas } = latestBlock
    this.networkCapabilities.updateState({
      [NetworkCapabilities.EIP1559]: baseFeePerGas !== undefined,
    })
  }

  getNetworkCapabilities () {
    return this.networkCapabilities.getState()
  }

  hasNetworkCapability (networkCapability) {
    const { [networkCapability]: value } = this.networkCapabilities.getState()
    return value === true
  }

  //
  // Private
  //

  _switchNetwork (opts) {
    this.setNetworkState('loading')
    this._configureProvider(opts)
    this.emit('networkDidChange', opts.type)
  }

  _configureProvider (opts) {
    const { type, rpcUrl, chainId } = opts
    // infura type-based endpoints
    const isInfura = INFURA_PROVIDER_TYPES.includes(type)
    if (isInfura) {
      this._configureInfuraProvider(opts)
    // other type-based rpc endpoints
    } else if (type === LOCALHOST) {
      this._configureLocalhostProvider()
    // url-based rpc endpoints
    } else if (type === 'rpc') {
      this._configureStandardProvider(rpcUrl, chainId)
    } else {
      throw new Error(`NetworkController - _configureProvider - unknown type "${type}"`)
    }
  }

  _configureInfuraProvider ({ type }) {
    log.info('NetworkController - configureInfuraProvider', type)
    const networkClient = createInfuraClient({
      network: type,
    })
    this._setNetworkClient(networkClient)
  }

  _configureLocalhostProvider () {
    log.info('NetworkController - configureLocalhostProvider')
    const networkClient = createLocalhostClient()
    this._setNetworkClient(networkClient)
  }

  _configureStandardProvider (rpcUrl, chainId) {
    log.info('NetworkController - configureStandardProvider', rpcUrl)
    const networkClient = createJsonRpcClient({ rpcUrl, chainId })
    this._setNetworkClient(networkClient)
  }

  _setNetworkClient ({ networkMiddleware, blockTracker }) {
    const metamaskMiddleware = createMetamaskMiddleware(this._baseProviderParams)
    const engine = new JsonRpcEngine()
    engine.push(metamaskMiddleware)
    engine.push(networkMiddleware)
    const provider = providerFromEngine(engine)
    this._setProviderAndBlockTracker({ provider, blockTracker })
  }

  _setProviderAndBlockTracker ({ provider, blockTracker }) {
    // update or intialize proxies
    if (this._providerProxy) {
      this._providerProxy.setTarget(provider)
    } else {
      this._providerProxy = createSwappableProxy(provider)
    }
    if (this._blockTrackerProxy) {
      this._blockTrackerProxy.setTarget(blockTracker)
    } else {
      this._blockTrackerProxy = createEventEmitterProxy(blockTracker, { eventFilter: 'skipInternal' })
    }
    // set new provider and blockTracker
    this._provider = provider
    this._blockTracker = blockTracker
  }
}
