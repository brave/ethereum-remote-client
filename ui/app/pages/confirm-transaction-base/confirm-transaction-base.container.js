import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import contractMap from '@metamask/contract-metadata'
import ConfirmTransactionBase from './confirm-transaction-base.component'
import {
  clearConfirmTransaction,
} from '../../ducks/confirm-transaction/confirm-transaction.duck'

import {
  updateCustomNonce,
  cancelTx,
  cancelTxs,
  clearSwap,
  updateAndApproveTx,
  showModal,
  setMetaMetricsSendCount,
  updateTransaction,
  getNextNonce,
  tryReverseResolveAddress,
  updateSwapTokenApprovalTxId,
} from '../../store/actions'
import {
  INSUFFICIENT_FUNDS_ERROR_KEY,
  GAS_LIMIT_TOO_LOW_ERROR_KEY,
} from '../../helpers/constants/error-keys'
import { getHexGasTotal } from '../../helpers/utils/confirm-tx.util'
import { isBalanceSufficient, calcGasTotal } from '../send/send.utils'
import { conversionGreaterThan } from '../../helpers/utils/conversion-util'
import { MIN_GAS_LIMIT_DEC } from '../send/send.constants'
import { checksumAddress, shortenAddress, valuesFor } from '../../helpers/utils/util'
import {
  getAdvancedInlineGasShown,
  getCustomNonceValue,
  getIsMainnet,
  getKnownMethodData,
  getMetaMaskAccounts,
  getUseNonceField,
  getPreferences,
  transactionFeeSelector, isEIP1559Active,
} from '../../selectors'
import { getMostRecentOverviewPage } from '../../ducks/history/history'
import { resetSwapState } from '../../ducks/swap/swap.duck'

const casedContractMap = Object.keys(contractMap).reduce((acc, base) => {
  return {
    ...acc,
    [base.toLowerCase()]: contractMap[base],
  }
}, {})

let customNonceValue = ''
const customNonceMerge = (txData) => (customNonceValue ? ({
  ...txData,
  customNonceValue,
}) : txData)

const mapStateToProps = (state, ownProps) => {
  const { toAddress: propsToAddress, customTxParamsData, match: { params = {} } } = ownProps
  const { id: paramsTransactionId } = params
  const { showFiatInTestnets } = getPreferences(state)
  const isMainnet = getIsMainnet(state)
  const { confirmTransaction, metamask } = state
  const {
    ensResolutionsByAddress,
    conversionRate,
    currentCurrency,
    identities,
    addressBook,
    assetImages,
    network,
    unapprovedTxs,
    metaMetricsSendCount,
    nextNonce,
  } = metamask
  const {
    tokenData,
    txData,
    tokenProps,
    nonce,
  } = confirmTransaction
  const { txParams = {}, lastGasPrice, id: transactionId, transactionCategory } = txData
  const transaction = Object.values(unapprovedTxs).find(
    ({ id }) => id === (transactionId || Number(paramsTransactionId)),
  ) || {}
  const {
    from: fromAddress,
    to: txParamsToAddress,
    gasPrice,
    gas: gasLimit,
    value: amount,
    data,
  } = (transaction && transaction.txParams) || txParams
  const accounts = getMetaMaskAccounts(state)
  const assetImage = assetImages[txParamsToAddress]

  const { balance } = accounts[fromAddress]
  const { name: fromName } = identities[fromAddress]
  const toAddress = propsToAddress || txParamsToAddress
  const toName = identities[toAddress]
    ? identities[toAddress].name
    : (
      casedContractMap[toAddress]
        ? casedContractMap[toAddress].name
        : shortenAddress(checksumAddress(toAddress))
    )

  const checksummedAddress = checksumAddress(toAddress)
  const addressBookObject = addressBook[checksummedAddress]
  const toEns = ensResolutionsByAddress[checksummedAddress] || ''
  const toNickname = addressBookObject ? addressBookObject.name : ''
  const isTxReprice = Boolean(lastGasPrice)
  const transactionStatus = transaction ? transaction.status : ''

  const {
    hexTransactionAmount,
    hexTransactionFee,
    hexTransactionTotal,
  } = transactionFeeSelector(state, transaction)

  if (transaction && transaction.simulationFails) {
    txData.simulationFails = transaction.simulationFails
  }

  const currentNetworkUnapprovedTxs = Object.keys(unapprovedTxs)
    .filter((key) => unapprovedTxs[key].metamaskNetworkId === network)
    .reduce((acc, key) => ({ ...acc, [key]: unapprovedTxs[key] }), {})
  const unapprovedTxCount = valuesFor(currentNetworkUnapprovedTxs).length

  const insufficientBalance = !isBalanceSufficient({
    amount,
    gasTotal: calcGasTotal(gasLimit, gasPrice),
    balance,
    conversionRate,
  })

  const methodData = getKnownMethodData(state, data) || {}

  let fullTxData = { ...txData, ...transaction }
  if (customTxParamsData) {
    fullTxData = {
      ...fullTxData,
      txParams: {
        ...fullTxData.txParams,
        data: customTxParamsData,
      },
    }
  }

  return {
    balance,
    fromAddress,
    fromName,
    toAddress,
    toEns,
    toName,
    toNickname,
    hexTransactionAmount,
    hexTransactionFee,
    hexTransactionTotal,
    txData: fullTxData,
    tokenData,
    methodData,
    tokenProps,
    isTxReprice,
    conversionRate,
    currentCurrency,
    transactionStatus,
    nonce,
    assetImage,
    unapprovedTxs,
    unapprovedTxCount,
    currentNetworkUnapprovedTxs,
    customGas: {
      gasLimit,
      gasPrice,
    },
    advancedInlineGasShown: getAdvancedInlineGasShown(state),
    useNonceField: getUseNonceField(state),
    customNonceValue: getCustomNonceValue(state),
    insufficientBalance,
    hideSubtitle: (!isMainnet && !showFiatInTestnets),
    hideFiatConversion: (!isMainnet && !showFiatInTestnets),
    metaMetricsSendCount,
    transactionCategory,
    nextNonce,
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    isMainnet,
    isEIP1559Active: isEIP1559Active(state),
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    tryReverseResolveAddress: (address) => {
      return dispatch(tryReverseResolveAddress(address))
    },
    updateCustomNonce: (value) => {
      customNonceValue = value
      dispatch(updateCustomNonce(value))
    },
    clearConfirmTransaction: () => dispatch(clearConfirmTransaction()),
    showTransactionConfirmedModal: ({ onSubmit }) => {
      return dispatch(showModal({ name: 'TRANSACTION_CONFIRMED', onSubmit }))
    },
    showCustomizeGasModal: ({ txData, onSubmit, validate }) => {
      return dispatch(showModal({ name: 'CUSTOMIZE_GAS', txData, onSubmit, validate }))
    },
    showCustomizeEIP1559GasModal: () => {
      return dispatch(showModal({ name: 'CUSTOMIZE_EIP1559_GAS' }))
    },
    updateGasAndCalculate: (updatedTx) => {
      return dispatch(updateTransaction(updatedTx))
    },
    showRejectTransactionsConfirmationModal: ({ onSubmit, unapprovedTxCount }) => {
      return dispatch(showModal({ name: 'REJECT_TRANSACTIONS', onSubmit, unapprovedTxCount }))
    },
    cancelTransaction: ({ id }) => dispatch(cancelTx({ id })),
    cancelAllTransactions: (txList) => dispatch(cancelTxs(txList)),
    sendTransaction: (txData) => dispatch(updateAndApproveTx(customNonceMerge(txData))),
    setMetaMetricsSendCount: (val) => dispatch(setMetaMetricsSendCount(val)),
    getNextNonce: () => dispatch(getNextNonce()),
    cleanSwap: () => {
      dispatch(updateSwapTokenApprovalTxId(null))
      dispatch(clearSwap())
      dispatch(resetSwapState())
    },
  }
}

const getValidateEditGas = ({ balance, conversionRate, txData }) => {
  const { txParams: { value: amount } = {} } = txData

  return ({ gasLimit, gasPrice }) => {
    const gasTotal = getHexGasTotal({ gasLimit, gasPrice })
    const hasSufficientBalance = isBalanceSufficient({
      amount,
      gasTotal,
      balance,
      conversionRate,
    })

    if (!hasSufficientBalance) {
      return {
        valid: false,
        errorKey: INSUFFICIENT_FUNDS_ERROR_KEY,
      }
    }

    const gasLimitTooLow = gasLimit && conversionGreaterThan(
      {
        value: MIN_GAS_LIMIT_DEC,
        fromNumericBase: 'dec',
        conversionRate,
      },
      {
        value: gasLimit,
        fromNumericBase: 'hex',
      },
    )

    if (gasLimitTooLow) {
      return {
        valid: false,
        errorKey: GAS_LIMIT_TOO_LOW_ERROR_KEY,
      }
    }

    return {
      valid: true,
    }
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { balance, conversionRate, txData, unapprovedTxs } = stateProps
  const {
    cancelAllTransactions: dispatchCancelAllTransactions,
    showCustomizeGasModal: dispatchShowCustomizeGasModal,
    updateGasAndCalculate: dispatchUpdateGasAndCalculate,
    ...otherDispatchProps
  } = dispatchProps

  const validateEditGas = getValidateEditGas({ balance, conversionRate, txData })

  return {
    ...stateProps,
    ...otherDispatchProps,
    ...ownProps,
    showCustomizeGasModal: () => dispatchShowCustomizeGasModal({
      txData,
      onSubmit: (customGas) => dispatchUpdateGasAndCalculate(customGas),
      validate: validateEditGas,
    }),
    cancelAllTransactions: () => dispatchCancelAllTransactions(valuesFor(unapprovedTxs)),
    updateGasAndCalculate: ({ gasLimit, gasPrice }) => {
      const updatedTx = {
        ...txData,
        txParams: {
          ...txData.txParams,
          gas: gasLimit,
          gasPrice,
        },
      }
      dispatchUpdateGasAndCalculate(updatedTx)
    },
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
)(ConfirmTransactionBase)
