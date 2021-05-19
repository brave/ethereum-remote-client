import ethUtil from 'ethereumjs-util'

export function addHexPrefixToObjectValues (obj) {
  return Object.keys(obj).reduce((newObj, key) => {
    return { ...newObj, [key]: ethUtil.addHexPrefix(obj[key]) }
  }, {})
}

export function constructTxParams ({ fromAsset, data, to, amount, from, gas, gasPrice }) {
  const txParams = {
    data,
    from,
    value: '0',
    gas,
    gasPrice,
  }

  if (!fromAsset.address) {
    txParams.value = amount
    txParams.to = to
  }

  return addHexPrefixToObjectValues(txParams)
}

export function addressIsNew (toAccounts, newAddress) {
  const newAddressNormalized = newAddress.toLowerCase()
  const foundMatching = toAccounts.some(({ address }) => address.toLowerCase() === newAddressNormalized)
  return !foundMatching
}
