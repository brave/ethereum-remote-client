import mergeMiddleware from 'json-rpc-engine/src/mergeMiddleware'
import createScaffoldMiddleware from 'json-rpc-engine/src/createScaffoldMiddleware'
import createBlockReRefMiddleware from 'eth-json-rpc-middleware/block-ref'
import createRetryOnEmptyMiddleware from 'eth-json-rpc-middleware/retryOnEmpty'
import createBlockCacheMiddleware from 'eth-json-rpc-middleware/block-cache'
import createInflightMiddleware from 'eth-json-rpc-middleware/inflight-cache'
import createBlockTrackerInspectorMiddleware from 'eth-json-rpc-middleware/block-tracker-inspector'
import providerFromMiddleware from 'eth-json-rpc-middleware/providerFromMiddleware'
import createInfuraMiddleware from 'eth-json-rpc-infura'
import BlockTracker from 'eth-block-tracker'
import * as networkEnums from './enums'

export default function createInfuraClient ({ network }) {
  const infuraMiddleware = createInfuraMiddleware({
    network,
    maxAttempts: 5,
    source: 'metamask',
    dev: process.env.NODE_ENV === 'development',
  })
  const infuraProvider = providerFromMiddleware(infuraMiddleware)
  const blockTracker = new BlockTracker({ provider: infuraProvider })

  const networkMiddleware = mergeMiddleware([
    createNetworkAndChainIdMiddleware({ network }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightMiddleware(),
    createBlockReRefMiddleware({ blockTracker, provider: infuraProvider }),
    createRetryOnEmptyMiddleware({ blockTracker, provider: infuraProvider }),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    infuraMiddleware,
  ])
  return { networkMiddleware, blockTracker }
}

function createNetworkAndChainIdMiddleware ({ network }) {
  let chainId
  let netId

  switch (network) {
    case 'mainnet':
      netId = networkEnums.MAINNET_NETWORK_ID
      chainId = networkEnums.MAINNET_CHAIN_ID
      break
    case 'ropsten':
      netId = networkEnums.ROPSTEN_NETWORK_ID
      chainId = networkEnums.ROPSTEN_CHAIN_ID
      break
    case 'rinkeby':
      netId = networkEnums.RINKEBY_NETWORK_ID
      chainId = networkEnums.RINKEBY_CHAIN_ID
      break
    case 'kovan':
      netId = networkEnums.KOVAN_NETWORK_ID
      chainId = networkEnums.KOVAN_CHAIN_ID
      break
    case 'goerli':
      netId = networkEnums.GOERLI_NETWORK_ID
      chainId = networkEnums.GOERLI_CHAIN_ID
      break
    default:
      throw new Error(`createInfuraClient - unknown network "${network}"`)
  }

  return createScaffoldMiddleware({
    eth_chainId: chainId,
    net_version: netId,
  })
}
