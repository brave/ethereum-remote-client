import { getSelectedAccount, getSelectedAddress, getTargetAccount } from '.'
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

export function getSwapFrom (state) {
  return state.metamask.swap.from
}

export function getSwapFromTokenAssetBalance (state) {
  return state.metamask.swap.fromTokenAssetBalance
}

export function getSwapFromTokenAssetAllowance (state) {
  return state.metamask.swap.fromTokenAssetAllowance
}

export function getSwapFromObject (state) {
  const fromAddress = getSwapFrom(state)
  return fromAddress
    ? getTargetAccount(state, fromAddress)
    : getSelectedAccount(state)
}

export function getSwapTo (state) {
  return state.metamask.swap.to
}

export function getSwapToNickname (state) {
  return state.metamask.swap.toNickname
}

export function getSwapTokenBalance (state) {
  return state.metamask.swap.tokenBalance
}

export function getSwapFromTokenBalance (state) {
  return state.metamask.swap.tokenFromBalance
}

export function getSwapToTokenBalance (state) {
  return state.metamask.swap.tokenToBalance
}


export function getSwapEnsResolution (state) {
  return state.metamask.swap.ensResolution
}

export function getSwapEnsResolutionError (state) {
  return state.metamask.swap.ensResolutionError
}

export function getSwapUnapprovedTxs (state) {
  return state.metamask.unapprovedTxs
}

export function getQrSwapsCodeData (state) {
  return state.appState.qrCodeData
}

export function getSwapGasLoadingError (state) {
  return state.swap.errors.gasLoading
}

export function gasSwapFeeIsInError (state) {
  return Boolean(state.swap.errors.gasFee)
}

export function getSwapGasButtonGroupShown (state) {
  return state.swap.gasButtonGroupShown
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
