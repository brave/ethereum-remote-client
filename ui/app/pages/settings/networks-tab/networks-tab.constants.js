import {
  GOERLI,
  GOERLI_CHAIN_ID,
  KOVAN,
  KOVAN_CHAIN_ID,
  LOCALHOST,
  MAINNET,
  MAINNET_CHAIN_ID,
  RINKEBY,
  RINKEBY_CHAIN_ID,
  ROPSTEN,
  ROPSTEN_CHAIN_ID,
} from '../../../../../app/scripts/controllers/network/enums'

const _defaultNetworksData = [
  {
    labelKey: MAINNET,
    iconColor: '#29B6AF',
    providerType: MAINNET,
    rpcUrl: 'https://api.infura.io/v1/jsonrpc/mainnet',
    chainId: MAINNET_CHAIN_ID,
    ticker: 'ETH',
    blockExplorerUrl: 'https://etherscan.io',
  },
  {
    labelKey: ROPSTEN,
    iconColor: '#FF4A8D',
    providerType: ROPSTEN,
    rpcUrl: 'https://api.infura.io/v1/jsonrpc/ropsten',
    chainId: ROPSTEN_CHAIN_ID,
    ticker: 'ETH',
    blockExplorerUrl: 'https://ropsten.etherscan.io',
  },
  {
    labelKey: RINKEBY,
    iconColor: '#F6C343',
    providerType: RINKEBY,
    rpcUrl: 'https://api.infura.io/v1/jsonrpc/rinkeby',
    chainId: RINKEBY_CHAIN_ID,
    ticker: 'ETH',
    blockExplorerUrl: 'https://rinkeby.etherscan.io',
  },
  {
    labelKey: GOERLI,
    iconColor: '#3099f2',
    providerType: GOERLI,
    rpcUrl: 'https://api.infura.io/v1/jsonrpc/goerli',
    chainId: GOERLI_CHAIN_ID,
    ticker: 'ETH',
    blockExplorerUrl: 'https://goerli.etherscan.io',
  },
  {
    labelKey: KOVAN,
    iconColor: '#9064FF',
    providerType: KOVAN,
    rpcUrl: 'https://api.infura.io/v1/jsonrpc/kovan',
    chainId: KOVAN_CHAIN_ID,
    ticker: 'ETH',
    blockExplorerUrl: 'https://kovan.etherscan.io',
  },
  {
    labelKey: LOCALHOST,
    iconColor: 'white',
    border: '1px solid #6A737D',
    providerType: LOCALHOST,
    rpcUrl: 'http://localhost:8545/',
    blockExplorerUrl: 'https://etherscan.io',
  },
]

const defaultNetworksData = _defaultNetworksData.map((net) => {
  return {
    ...net,
    rpcUrl: `${net.providerType}.infura.io/v3`,
  }
})

export {
  defaultNetworksData,
}
