import { getSelectedAddress } from '.'
import { conversionGTE } from '../helpers/utils/conversion-util'
import { decimalToHex } from '../pages/swap/swap.utils'


export function getSwapFromAsset (state) {
  return state.metamask.swap.fromAsset
}

export function getSwapToAsset (state) {
  return state.metamask.swap.toAsset
}

export function getSwapAmount (state) {
  return state.metamask.swap.amount
}

export function getSwapQuote (state) {
  return state.metamask.swap.quote
}

export function getSwapQuoteGasPrice (state) {
  return state.metamask.swap.quote?.gasPrice
}

export function getSwapQuoteGas (state) {
  return state.metamask.swap.quote?.gas
}

export function getSwapQuoteEstimatedGasCost (state) {
  const gasLimit = getSwapQuoteGas(state)
  const estimatedGasPrice = getSwapQuoteGasPrice(state)

  if (!gasLimit || !estimatedGasPrice) {
    return
  }

  const gasCost = parseInt(gasLimit) * parseInt(estimatedGasPrice)
  return gasCost.toString(16)
}

export function getSwapErrors (state) {
  return state.swap.errors
}

export function getSwapFromTokenAssetBalance (state) {
  return state.metamask.swap.fromTokenAssetBalance
}

export function getSwapFromTokenAssetAllowance (state) {
  return state.metamask.swap.fromTokenAssetAllowance
}

export function isSwapFormInError (state) {
  return Object.values(getSwapErrors(state)).some((n) => n)
}

export function getSwapTransactionObject (state) {
  const quote = getSwapQuote(state)
  if (!quote) {
    return
  }

  return {
    from: getSelectedAddress(state),
    to: quote.to,
    value: decimalToHex(quote.value),
    gas: decimalToHex(quote.gas),
    gasPrice: decimalToHex(quote.gasPrice),
    data: quote.data,
  }
}

export function isSwapFromTokenAssetAllowanceEnough (state) {
  const amount = getSwapAmount(state)
  const fromTokenAssetAllowance = getSwapFromTokenAssetAllowance(state)

  if (!amount || !fromTokenAssetAllowance) {
    return true
  }

  const hasSufficientAllowance = conversionGTE(
    {
      value: fromTokenAssetAllowance,
      fromNumericBase: 'hex',
    },
    {
      value: amount,
      fromNumericBase: 'hex',
    },
  )

  return fromTokenAssetAllowance !== '0' && hasSufficientAllowance
}

export function getSwapTokenApprovalTxId (state) {
  return state.metamask.swap.tokenApprovalTxId
}
