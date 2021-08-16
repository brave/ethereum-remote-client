import { connect } from 'react-redux'
import GasModalPageContainer from './gas-modal-page-container.component'
import { captureException } from '@sentry/browser'
import {
  hideModal,
  setGasLimit,
  setGasPrice,
  createRetryTransaction,
  createSpeedUpTransaction,
  hideSidebar,
  updateSendAmount,
  setGasTotal,
  updateTransaction,
} from '../../../../store/actions'
import {
  setCustomGasPrice,
  setCustomGasLimit,
  resetCustomData,
  fetchGasEstimates,
  fetchBasicGasAndTimeEstimates,
} from '../../../../ducks/gas/gas.duck'
import {
  hideGasButtonGroup,
  updateSendErrors,
} from '../../../../ducks/send/send.duck'
import {
  conversionRateSelector as getConversionRate,
  getCurrentCurrency,
  getCurrentEthBalance,
  getIsMainnet,
  getSendToken,
  isEthereumNetwork,
  getPreferences,
  getBasicGasEstimateLoadingStatus,
  getGasEstimatesLoadingStatus,
  getCustomGasLimit,
  getCustomGasPrice,
  getDefaultActiveButtonIndex,
  getEstimatedGasPrices,
  getEstimatedGasTimes,
  getRenderableBasicEstimateData,
  getBasicGasEstimateBlockTime,
  isCustomPriceSafe,
  getTokenBalance,
  getSendMaxModeState,
  getFastPriceEstimateInHexWEI,
} from '../../../../selectors'

import {
  formatCurrency,
} from '../../../../helpers/utils/confirm-tx.util'
import {
  addHexWEIsToDec,
  subtractHexWEIsToDec,
  decEthToConvertedCurrency as ethTotalToConvertedCurrency,
  hexWEIToDecGWEI,
} from '../../../../helpers/utils/conversions.util'
import { getRenderableTimeEstimate } from '../../../../helpers/utils/gas-time-estimates.util'
import {
  formatETHFee,
} from '../../../../helpers/utils/formatters'
import {
  calcGasTotal,
  isBalanceSufficient,
} from '../../../../pages/send/send.utils'
import { addHexPrefix } from 'ethereumjs-util'
import { calcMaxAmount } from '../../../../pages/send/send-content/send-amount-row/amount-max-button/amount-max-button.utils'

const mapStateToProps = (state, ownProps) => {
  const { currentNetworkTxList, send } = state.metamask
  const { modalState: { props: modalProps } = {} } = state.appState.modal || {}
  const { txData = {} } = modalProps || {}
  const { transaction = {} } = ownProps
  const selectedTransaction = currentNetworkTxList.find(({ id }) => id === (transaction.id || txData.id))

  const buttonDataLoading = getBasicGasEstimateLoadingStatus(state)
  const gasEstimatesLoading = getGasEstimatesLoadingStatus(state)
  const sendToken = getSendToken(state)

  // a "default" txParams is used during the send flow, since the transaction doesn't exist yet in that case
  const txParams = selectedTransaction?.txParams
    ? selectedTransaction.txParams
    : {
      gas: send.gasLimit || '0x5208',
      gasPrice: send.gasPrice || getFastPriceEstimateInHexWEI(state, true),
      value: sendToken ? '0x0' : send.amount,
    }

  const { gasPrice: currentGasPrice, gas: currentGasLimit, value } = txParams
  const customModalGasPriceInHex = getCustomGasPrice(state) || currentGasPrice
  const customModalGasLimitInHex = getCustomGasLimit(state) || currentGasLimit || '0x5208'
  const customGasTotal = calcGasTotal(customModalGasLimitInHex, customModalGasPriceInHex)

  const gasButtonInfo = getRenderableBasicEstimateData(state, customModalGasLimitInHex)

  const currentCurrency = getCurrentCurrency(state)
  const conversionRate = getConversionRate(state)

  const newTotalFiat = addHexWEIsToRenderableFiat(value, customGasTotal, currentCurrency, conversionRate)

  const hideBasic = state.appState.modal.modalState.props.hideBasic

  const customGasPrice = calcCustomGasPrice(customModalGasPriceInHex)

  const maxModeOn = getSendMaxModeState(state)

  const gasPrices = getEstimatedGasPrices(state)
  const estimatedTimes = getEstimatedGasTimes(state)
  const balance = getCurrentEthBalance(state)

  const { showFiatInTestnets } = getPreferences(state)
  const isMainnet = getIsMainnet(state)
  const showFiat = Boolean(isMainnet || showFiatInTestnets)

  const isSendTokenSet = Boolean(sendToken)

  const newTotalEth = maxModeOn && !isSendTokenSet ? addHexWEIsToRenderableEth(balance, '0x0') : addHexWEIsToRenderableEth(value, customGasTotal)

  const sendAmount = maxModeOn && !isSendTokenSet ? subtractHexWEIsFromRenderableEth(balance, customGasTotal) : addHexWEIsToRenderableEth(value, '0x0')

  const insufficientBalance = maxModeOn ? false : !isBalanceSufficient({
    amount: value,
    gasTotal: customGasTotal,
    balance,
    conversionRate,
  })

  let currentTimeEstimate = ''
  try {
    currentTimeEstimate = getRenderableTimeEstimate(customGasPrice, gasPrices, estimatedTimes)
  } catch (error) {
    captureException(error)
  }

  return {
    hideBasic,
    isConfirm: isConfirm(state),
    customModalGasPriceInHex,
    customModalGasLimitInHex,
    customGasPrice,
    customGasLimit: calcCustomGasLimit(customModalGasLimitInHex),
    customGasTotal,
    newTotalFiat,
    currentTimeEstimate,
    blockTime: getBasicGasEstimateBlockTime(state),
    customPriceIsSafe: isCustomPriceSafe(state),
    maxModeOn,
    gasPriceButtonGroupProps: {
      buttonDataLoading,
      defaultActiveButtonIndex: getDefaultActiveButtonIndex(gasButtonInfo, customModalGasPriceInHex),
      gasButtonInfo,
    },
    gasChartProps: {
      currentPrice: customGasPrice,
      gasPrices,
      estimatedTimes,
      gasPricesMax: gasPrices[gasPrices.length - 1],
      estimatedTimesMax: estimatedTimes[0],
    },
    infoRowProps: {
      originalTotalFiat: addHexWEIsToRenderableFiat(value, customGasTotal, currentCurrency, conversionRate),
      originalTotalEth: addHexWEIsToRenderableEth(value, customGasTotal),
      newTotalFiat: showFiat ? newTotalFiat : '',
      newTotalEth,
      transactionFee: addHexWEIsToRenderableEth('0x0', customGasTotal),
      sendAmount,
    },
    transaction: txData || transaction,
    isSpeedUp: transaction.status === 'submitted',
    isRetry: transaction.status === 'failed',
    txId: transaction.id,
    insufficientBalance,
    gasEstimatesLoading,
    isMainnet,
    isEthereumNetwork: isEthereumNetwork(state),
    sendToken,
    balance,
    tokenBalance: getTokenBalance(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  const updateCustomGasPrice = (newPrice) => dispatch(setCustomGasPrice(addHexPrefix(newPrice)))

  return {
    cancelAndClose: () => {
      dispatch(resetCustomData())
      dispatch(hideModal())
    },
    hideModal: () => dispatch(hideModal()),
    updateCustomGasPrice,
    updateCustomGasLimit: (newLimit) => dispatch(setCustomGasLimit(addHexPrefix(newLimit))),
    setGasData: (gasParams) => {
      const { gasLimit, gasPrice } = gasParams

      dispatch(setGasLimit(gasLimit))
      dispatch(setGasPrice(gasPrice))
    },
    updateConfirmTxGasAndCalculate: (gasParams, updatedTx) => {
      const { gasLimit, gasPrice } = gasParams

      updateCustomGasPrice(gasPrice)
      dispatch(setCustomGasLimit(addHexPrefix(gasLimit.toString(16))))
      return dispatch(updateTransaction(updatedTx))
    },
    createRetryTransaction: (txId, customGasParams) => {
      return dispatch(createRetryTransaction(txId, customGasParams))
    },
    createSpeedUpTransaction: (txId, customGasParams) => {
      return dispatch(createSpeedUpTransaction(txId, customGasParams))
    },
    hideGasButtonGroup: () => dispatch(hideGasButtonGroup()),
    hideSidebar: () => dispatch(hideSidebar()),
    fetchGasEstimates: (blockTime) => dispatch(fetchGasEstimates(blockTime)),
    fetchBasicGasAndTimeEstimates: () => dispatch(fetchBasicGasAndTimeEstimates()),
    setGasTotal: (total) => dispatch(setGasTotal(total)),
    setAmountToMax: (maxAmountDataObject) => {
      dispatch(updateSendErrors({ amount: null }))
      dispatch(updateSendAmount(calcMaxAmount(maxAmountDataObject)))
    },
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    gasPriceButtonGroupProps,
    isConfirm,
    txId,
    isSpeedUp,
    isRetry,
    insufficientBalance,
    maxModeOn,
    customGasPrice,
    customGasTotal,
    balance,
    sendToken,
    tokenBalance,
    customGasLimit,
    transaction,
  } = stateProps
  const {
    hideGasButtonGroup: dispatchHideGasButtonGroup,
    setGasData: dispatchSetGasData,
    updateConfirmTxGasAndCalculate: dispatchUpdateConfirmTxGasAndCalculate,
    createSpeedUpTransaction: dispatchCreateSpeedUpTransaction,
    createRetryTransaction: dispatchCreateRetryTransaction,
    hideSidebar: dispatchHideSidebar,
    cancelAndClose: dispatchCancelAndClose,
    hideModal: dispatchHideModal,
    setAmountToMax: dispatchSetAmountToMax,
    ...otherDispatchProps
  } = dispatchProps

  return {
    ...stateProps,
    ...otherDispatchProps,
    ...ownProps,
    onSubmit: (gasParams = {}) => {
      const { gasLimit, gasPrice } = gasParams

      if (isConfirm) {
        const updatedTx = {
          ...transaction,
          txParams: {
            ...transaction.txParams,
            gas: gasLimit,
            gasPrice,
          },
        }
        dispatchUpdateConfirmTxGasAndCalculate(gasParams, updatedTx)
        dispatchHideModal()
      } else if (isSpeedUp) {
        dispatchCreateSpeedUpTransaction(txId, gasParams)
        dispatchHideSidebar()
        dispatchCancelAndClose()
      } else if (isRetry) {
        dispatchCreateRetryTransaction(txId, gasParams)
        dispatchHideSidebar()
        dispatchCancelAndClose()
      } else {
        dispatchSetGasData(gasParams)
        dispatchHideGasButtonGroup()
        dispatchCancelAndClose()
      }
      if (maxModeOn) {
        dispatchSetAmountToMax({
          balance,
          gasTotal: customGasTotal,
          sendToken,
          tokenBalance,
        })
      }
    },
    gasPriceButtonGroupProps: {
      ...gasPriceButtonGroupProps,
      handleGasPriceSelection: otherDispatchProps.updateCustomGasPrice,
    },
    cancelAndClose: () => {
      dispatchCancelAndClose()
      if (isSpeedUp || isRetry) {
        dispatchHideSidebar()
      }
    },
    disableSave: insufficientBalance || (isSpeedUp && customGasPrice === 0) || customGasLimit < 21000,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(GasModalPageContainer)

function isConfirm (state) {
  return Boolean(Object.keys(state.confirmTransaction.txData).length)
}

function calcCustomGasPrice (customGasPriceInHex) {
  return Number(hexWEIToDecGWEI(customGasPriceInHex))
}

function calcCustomGasLimit (customGasLimitInHex) {
  return parseInt(customGasLimitInHex, 16)
}

function addHexWEIsToRenderableEth (aHexWEI, bHexWEI) {
  return formatETHFee(addHexWEIsToDec(aHexWEI, bHexWEI))
}

function subtractHexWEIsFromRenderableEth (aHexWEI, bHexWEI) {
  return formatETHFee(subtractHexWEIsToDec(aHexWEI, bHexWEI))
}

function addHexWEIsToRenderableFiat (aHexWEI, bHexWEI, convertedCurrency, conversionRate) {
  const ethTotal = ethTotalToConvertedCurrency(
    addHexWEIsToDec(aHexWEI, bHexWEI),
    convertedCurrency,
    conversionRate,
  )
  return formatCurrency(ethTotal, convertedCurrency)
}
