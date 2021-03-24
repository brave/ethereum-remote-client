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
  const swapToken = getSwapToken(state)
  return swapToken?.symbol
}

export function getSwapToken (state) {
  return state.metamask.swap.token
}

export function getSwapSwapTokenAddress (state) {
  return getSwapToken(state)?.address
}

export function getSwapTokenContract (state) {
  const swapTokenAddress = getSwapTokenAddress(state)
  return swapTokenAddress
    ? global.eth.contract(abi).at(swapTokenAddress)
    : null
}

export function getSwapAmount (state) {
  return state.metamask.swap.amount
}

export function getSwapHexData (state) {
  return state.metamask.swap.data
}

export function getSwapHexDataFeatureFlagState (state) {
  return state.metamask.featureFlags.swapHexData
}

export function getSwapEditingTransactionId (state) {
  return state.metamask.swap.editingSwapTransactionId
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
  const isToken = Boolean(getSwapToken(state))

  if (!getSwapTo(state)) {
    return 'addRecipient'
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

export function getSwapIsContractAddress (state) {
  const swapTo = getSwapTo(state)
  const swapTokenAddress = getSwapTokenAddress(state)

  if (!swapTokenAddress) {
    return false
  }

  return swapTo.toLowerCase() === swapTokenAddress.toLowerCase()
}
