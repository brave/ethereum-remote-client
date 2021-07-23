import {
  NETWORK_TYPE_TO_ID_MAP,
  ROPSTEN_CHAIN_ID,
  RINKEBY_CHAIN_ID,
  KOVAN_CHAIN_ID,
  GOERLI_CHAIN_ID,
  MAINNET_CHAIN_ID,
  NETWORK_TO_NAME_MAP,
} from '../controllers/network/enums'

const MAX_SAFE_CHAIN_ID = 4503599627370476

/**
 * Checks whether the given number primitive chain ID is safe.
 * Because some cryptographic libraries we use expect the chain ID to be a
 * number primitive, it must not exceed a certain size.
 *
 * @param {number} chainId - The chain ID to check for safety.
 * @returns {boolean} Whether the given chain ID is safe.
 */
function isSafeChainId (chainId) {
  return (
    Number.isSafeInteger(chainId) && chainId > 0 && chainId <= MAX_SAFE_CHAIN_ID
  )
}

/**
 * Checks whether the given value is a 0x-prefixed, non-zero, non-zero-padded,
 * hexadecimal string.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} True if the value is a correctly formatted hex string,
 * false otherwise.
 */
function isPrefixedFormattedHexString (value) {
  if (typeof value !== 'string') {
    return false
  }
  return /^0x[1-9a-f]+[0-9a-f]*$/iu.test(value)
}

export const CHAIN_ID_TO_TYPE_MAP = Object.entries(
  NETWORK_TYPE_TO_ID_MAP,
).reduce((chainIdToTypeMap, [networkType, { chainId }]) => {
  chainIdToTypeMap[chainId] = networkType
  return chainIdToTypeMap
}, {})

const CHAIN_ID_TO_NETWORK_ID_MAP = Object.values(
  NETWORK_TYPE_TO_ID_MAP,
).reduce((chainIdToNetworkIdMap, { chainId, networkId }) => {
  chainIdToNetworkIdMap[chainId] = networkId
  return chainIdToNetworkIdMap
}, {})

export async function getValidChainId (chainId) {
  const _chainId = typeof chainId === 'string' && chainId.toLowerCase()

  if (!isPrefixedFormattedHexString(_chainId)) {
    return {
      message: `Expected 0x-prefixed, unpadded, non-zero hexadecimal string 'chainId'. Received:\n${chainId}`,
    }
  }

  if (!isSafeChainId(parseInt(_chainId, 16))) {
    return {
      message: `Invalid chain ID "${_chainId}": numerical value greater than max safe value. Received:\n${chainId}`,
    }
  }

  if (CHAIN_ID_TO_NETWORK_ID_MAP[_chainId]) {
    return {
      message: `May not specify default MetaMask chain.`,
    }
  }

  return _chainId
}

const ETH_SYMBOL = 'ETH'

const infuraProjectId = process.env.INFURA_PROJECT_ID
const getRpcUrl = (network) =>
  `https://${network}.infura.io/v3/${infuraProjectId}`

const CHAIN_ID_TO_RPC_URL_MAP = {
  [ROPSTEN_CHAIN_ID]: getRpcUrl('ropsten'),
  [RINKEBY_CHAIN_ID]: getRpcUrl('rinkeby'),
  [KOVAN_CHAIN_ID]: getRpcUrl('kovan'),
  [GOERLI_CHAIN_ID]: getRpcUrl('goerli'),
  [MAINNET_CHAIN_ID]: getRpcUrl('mainnet'),
}

export function IsKnownChainId (chainId) {
  return (chainId in CHAIN_ID_TO_TYPE_MAP)
}
export function findExistingNetwork (chainId, findCustomRpcBy) {
  if (chainId in CHAIN_ID_TO_TYPE_MAP) {
    return {
      chainId,
      ticker: ETH_SYMBOL,
      nickname: NETWORK_TO_NAME_MAP[chainId],
      rpcUrl: CHAIN_ID_TO_RPC_URL_MAP[chainId],
      type: CHAIN_ID_TO_TYPE_MAP[chainId],
    }
  }

  return findCustomRpcBy({ chainId })
}
