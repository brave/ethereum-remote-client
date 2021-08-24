import ethAbi from 'ethereumjs-abi'
import { addHexPrefix } from 'ethereumjs-util'
import { TOKEN_TRANSFER_FUNCTION_SIGNATURE } from '../send.constants'

export function addHexPrefixToObjectValues (obj) {
  return Object.keys(obj).reduce((newObj, key) => {
    return { ...newObj, [key]: addHexPrefix(obj[key]) }
  }, {})
}

export function constructTxParams ({ sendToken, data, to, amount, from, gasParams }) {
  const txParams = {
    data,
    from,
    value: '0',
    ...gasParams,
  }

  if (!sendToken) {
    txParams.value = amount
    txParams.to = to
  }

  return addHexPrefixToObjectValues(txParams)
}

export function constructUpdatedTx ({
  amount,
  data,
  editingTransactionId,
  from,
  sendToken,
  to,
  unapprovedTxs,
  gasParams,
}) {
  const unapprovedTx = unapprovedTxs[editingTransactionId]
  const txParamsData = unapprovedTx.txParams.data ? unapprovedTx.txParams.data : data

  const editingTx = {
    ...unapprovedTx,
    txParams: Object.assign(
      unapprovedTx.txParams,
      addHexPrefixToObjectValues({
        data: txParamsData,
        to,
        from,
        value: amount,
        ...gasParams,
      }),
    ),
  }

  if (sendToken) {
    const data = TOKEN_TRANSFER_FUNCTION_SIGNATURE + Array.prototype.map.call(
      ethAbi.rawEncode(['address', 'uint256'], [to, addHexPrefix(amount)]),
      (x) => ('00' + x.toString(16)).slice(-2),
    ).join('')

    Object.assign(editingTx.txParams, addHexPrefixToObjectValues({
      value: '0',
      to: sendToken.address,
      data,
    }))
  }

  if (typeof editingTx.txParams.data === 'undefined') {
    delete editingTx.txParams.data
  }

  return editingTx
}

export function addressIsNew (toAccounts, newAddress) {
  const newAddressNormalized = newAddress.toLowerCase()
  const foundMatching = toAccounts.some(({ address }) => address.toLowerCase() === newAddressNormalized)
  return !foundMatching
}
