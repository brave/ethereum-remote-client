export function getHeaderTitle () {
  return 'swapTokens'
}

import abi from 'human-standard-token-abi'
import {
  accountsWithSwapEtherInfoSelector,
  getAddressBook,
  getSelectedAccount,
  getTargetAccount,
  getAveragePriceEstimateInHexWEI,
} from '.'
import { calcGasTotal } from '../pages/swap/swap.utils'

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

export function getSwapGasLimit (state) {
  return state.metamask.swap.gasLimit || '0'
}

export function getSwapGasPrice (state) {
  return state.metamask.swap.gasPrice || getAveragePriceEstimateInHexWEI(state)
}

export function getSwapGasTotal (state) {
  return calcGasTotal(getSwapGasLimit(state), getSwapGasPrice(state))
}

export function getSwapPrimaryCurrency (state) {
  const swapFromToken = getSwapFromToken(state)
  return swapFromToken?.symbol
}

export function getSwapToken (state) {
  return state.metamask.swap.token
}

export function getSwapFromToken (state) {
  return state.metamask.swap.tokenFrom
}

export function getSwapToToken (state) {
  return state.metamask.swap.tokenTo
}

export function getSwapAmount (state) {
  return state.metamask.swap.amount
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

export function getSwapTitleKey (state) {
  const isEditing = Boolean(getSwapEditingTransactionId(state))
  const isToken = Boolean(getSwapFromToken(state))

  if (!getSwapTo(state)) {
    return 'swapTokens'
  }

  if (isEditing) {
    return 'edit'
  } else if (isToken) {
    return 'swapTokens'
  } else {
    return 'swapETH'
  }
}

export function isSwapFormInError (state) {
  return Object.values(getSwapErrors(state)).some((n) => n)
}

export function getSwapTokenAddress (state) {
  return getSwapToken(state)?.address
}

export function getSwapFromTokenAddress (state) {
  return getSwapFromToken(state)?.address
}

export function getSwapToTokenAddress (state) {
  return getSwapToToken(state)?.address
}

export function getSwapIsContractAddress (state) {
  const swapTo = getSwapTo(state)
  const swapFromTokenAddress = getSwapFromTokenAddress(state)

  if (!swapFromTokenAddress) {
    return false
  }

  return swapTo.toLowerCase() === swapFromTokenAddress.toLowerCase()
}

export async function getQuote (state) {
  const qs = _createQueryString({
    sellAmount: state.swap.amount,
    buyToken: state.swap.buyToken,
    sellToken: state.swap.sellToken,
    buyTokenPercentageFee: buyTokenPercentageFee,
    slippagePercentage: slippagePercentage,
    takerAddress: taker,
    feeRecipient: feeAddress,
  })
  const quoteUrl = `${API_QUOTE_URL}?${qs}`
  console.log(quoteUrl)
  const response = await fetch(quoteUrl)
  console.log(response)
  return response
}