import mergeMiddleware from 'json-rpc-engine/src/mergeMiddleware'
import {
  createFetchMiddleware,
  createBlockRefRewriteMiddleware,
  createBlockCacheMiddleware,
  createInflightCacheMiddleware,
  createBlockTrackerInspectorMiddleware,
  providerFromMiddleware,
} from 'eth-json-rpc-middleware'
import BlockTracker from 'eth-block-tracker'

export default function createJsonRpcClient ({ rpcUrl, chainId }) {
  const fetchMiddleware = createFetchMiddleware({ rpcUrl })
  const blockProvider = providerFromMiddleware(fetchMiddleware)
  const blockTracker = new BlockTracker({ provider: blockProvider, pollingInterval: (30 * 1000) })

  const networkMiddleware = mergeMiddleware([
    createChainIdMiddleware(chainId),
    createBlockRefRewriteMiddleware({ blockTracker }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightCacheMiddleware(),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    fetchMiddleware,
  ])
  return { networkMiddleware, blockTracker }
}

function createChainIdMiddleware (chainId) {
  return (req, res, next, end) => {
    if (req.method === 'eth_chainId') {
      res.result = chainId
      return end()
    }
    return next()
  }
}
