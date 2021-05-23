import abi from 'human-standard-token-abi'
import { accountsWithSwapEtherInfoSelector, getAddressBook, getSelectedAccount, getTargetAccount } from '.'
import { multiplyCurrencies } from '../helpers/utils/conversion-util'

export function getSwapBlockGasLimit (state) {
  return state.metamask.currentBlockGasLimit
}

export function getSwapConversionRate (state) {
  return state.metamask.conversionRate
}

export function getSwapNativeCurrency (state) {
  return state.metamask.nativeCurrency
}

export function getSwapCurrentNetwork (state) {
  return state.metamask.network
}

export function getSwapQuoteGasLimit (state) {
  return state.metamask.swap.quote?.gas || '0'
}

export function getSwapGasPrice (state) {
  return state.metamask.swap.gasPrice
}

export function getSwapGasLimit (state) {
  return state.metamask.swap.gasLimit
}

export function getSwapGasCost (state) {
  const gasLimit = getSwapQuoteGas(state)
  const gasPrice = getSwapGasPrice(state)

  if (!gasLimit || !gasPrice) {
    return
  }

  return multiplyCurrencies(gasLimit, gasPrice, {
    toNumericBase: 'hex',
    multiplicandBase: 10,
    multiplierBase: 16,
  })
}

export function getSwapPrimaryCurrency (state) {
  const swapFromAsset = getSwapFromAsset(state)
  return swapFromAsset?.symbol
}

export function getSwapToken (state) {
  return state.metamask.swap.token
}

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

export function getSwapQuoteData (state) {
  return state.metamask.swap.quote?.data
}

export function getSwapQuoteTo (state) {
  return state.metamask.swap.quote?.to
}

export function getSwapQuoteValue (state) {
  return state.metamask.swap.quote?.value
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


export function getSwapFromTokenContract (state) {
  const swapFromTokenAddress = getSwapFromTokenAddress(state)
  return swapFromTokenAddress
    ? global.eth.contract(abi).at(swapFromTokenAddress)
    : null
}

export function getSwapToTokenContract (state) {
  const swapToTokenAddress = getSwapToTokenAddress(state)
  return swapToTokenAddress
    ? global.eth.contract(abi).at(swapToTokenAddress)
    : null
}

export function getSwapHexData (state) {
  return state.metamask.swap.data
}

export function getSwapHexDataFeatureFlagState (state) {
  return state.metamask.featureFlags.swapHexData
}

export function getSwapEditingTransactionId (state) {
  return state.metamask.swap.editingTransactionId
}

export function getSwapErrors (state) {
  return state.swap.errors
}

export function swapAmountIsInError (state) {
  return Boolean(state.swap.errors.amount)
}

export function getSwapFrom (state) {
  return state.metamask.swap.from
}

export function getSwapFromTokenAssetBalance (state) {
  return state.metamask.swap.fromTokenAssetBalance
}

// TODO: remove this
export function getSwapFromBalance (state) {
  const fromAccount = getSwapFromObject(state)
  return fromAccount.balance
}

export function getSwapFromObject (state) {
  const fromAddress = getSwapFrom(state)
  return fromAddress
    ? getTargetAccount(state, fromAddress)
    : getSelectedAccount(state)
}

export function getSwapMaxModeState (state) {
  return state.metamask.swap.maxModeOn
}

export function getSwapTo (state) {
  return state.metamask.swap.to
}

export function getSwapToNickname (state) {
  return state.metamask.swap.toNickname
}

export function getSwapToAccounts (state) {
  const fromAccounts = accountsWithSwapEtherInfoSelector(state)
  const addressBookAccounts = getAddressBook(state)
  return [...fromAccounts, ...addressBookAccounts]
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

export function getSwapTokenAddress (state) {
  return getSwapToken(state)?.address
}

export function getSwapFromTokenAddress (state) {
  return getSwapFromAsset(state)?.address
}

export function getSwapFromAssetSymbol (state) {
  return getSwapFromAsset(state)?.symbol
}

export function getSwapToTokenAddress (state) {
  return getSwapToAsset(state)?.address
}

export function getSwapToAssetSymbol (state) {
  return getSwapToAsset(state)?.symbol
}

export function getSwapIsContractAddress (state) {
  const swapTo = getSwapTo(state)
  const swapFromTokenAddress = getSwapFromTokenAddress(state)

  if (!swapFromTokenAddress) {
    return false
  }

  return swapTo.toLowerCase() === swapFromTokenAddress.toLowerCase()
}
