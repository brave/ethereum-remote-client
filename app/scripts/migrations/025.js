// next version number
const version = 25

/*

normalizes txParams on unconfirmed txs

*/
import { addHexPrefix } from 'ethereumjs-util'

import { cloneDeep } from 'lodash'

export default {
  version,

  migrate: async function (originalVersionedData) {
    const versionedData = cloneDeep(originalVersionedData)
    versionedData.meta.version = version
    const state = versionedData.data
    const newState = transformState(state)
    versionedData.data = newState
    return versionedData
  },
}

function transformState (state) {
  const newState = state

  if (newState.TransactionController) {
    if (newState.TransactionController.transactions) {
      const transactions = newState.TransactionController.transactions
      newState.TransactionController.transactions = transactions.map((txMeta) => {
        if (txMeta.status !== 'unapproved') {
          return txMeta
        }
        txMeta.txParams = normalizeTxParams(txMeta.txParams)
        return txMeta
      })
    }
  }

  return newState
}

function normalizeTxParams (txParams) {
  // functions that handle normalizing of that key in txParams
  const whiteList = {
    from: (from) => addHexPrefix(from).toLowerCase(),
    to: () => addHexPrefix(txParams.to).toLowerCase(),
    nonce: (nonce) => addHexPrefix(nonce),
    value: (value) => addHexPrefix(value),
    data: (data) => addHexPrefix(data),
    gas: (gas) => addHexPrefix(gas),
    gasPrice: (gasPrice) => addHexPrefix(gasPrice),
  }

  // apply only keys in the whiteList
  const normalizedTxParams = {}
  Object.keys(whiteList).forEach((key) => {
    if (txParams[key]) {
      normalizedTxParams[key] = whiteList[key](txParams[key])
    }
  })

  return normalizedTxParams
}
