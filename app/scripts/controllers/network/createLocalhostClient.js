import mergeMiddleware from 'json-rpc-engine/src/mergeMiddleware'
import {
  createFetchMiddleware,
  createBlockRefRewriteMiddleware,
  createBlockTrackerInspectorMiddleware,
  providerFromMiddleware,
} from 'eth-json-rpc-middleware'
import createAsyncMiddleware from 'json-rpc-engine/src/createAsyncMiddleware'
import BlockTracker from 'eth-block-tracker'

const inTest = process.env.IN_TEST === 'true'

export default function createLocalhostClient () {
  const fetchMiddleware = createFetchMiddleware({ rpcUrl: 'http://localhost:8545/' })
  const blockProvider = providerFromMiddleware(fetchMiddleware)
  const blockTracker = new BlockTracker({ provider: blockProvider, pollingInterval: 1000 })

  const networkMiddleware = mergeMiddleware([
    createEstimateGasMiddleware(),
    createBlockRefRewriteMiddleware({ blockTracker }),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    fetchMiddleware,
  ])
  return { networkMiddleware, blockTracker, provider: blockProvider }
}

function delay (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}


function createEstimateGasMiddleware () {
  return createAsyncMiddleware(async (req, _, next) => {
    if (req.method === 'eth_estimateGas' && inTest) {
      await delay(2000)
    }
    return next()
  })
}
