import abi from 'human-standard-token-abi'

export function makeContract (tokenAsset) {
  return global.eth.contract(abi).at(tokenAsset.address)
}
