import { connect } from 'react-redux'
import { addHexPrefix } from 'ethereumjs-util'

import {
  resetCustomData,
  setCustomGasLimit,
  setCustomMaxPriorityFeePerGas,
  setCustomMaxFeePerGas,
} from '../../../../ducks/gas/gas.duck'
import {
  createRetryTransaction,
  createSpeedUpTransaction,
  hideModal,
  hideSidebar,
  setGasLimit,
  setMaxFeePerGas,
  setMaxPriorityFeePerGas,
  updateSendAmount,
  updateTransaction,
} from '../../../../store/actions'
import {
  getDefaultActiveButtonIndex,
  getBasicGasEstimateLoadingStatus,
  getCustomGasLimit,
  getRenderableBasicEstimateData,
  getFastPriceEstimateInHexWEI,
  getSendToken,
  getCustomMaxPriorityFeePerGas,
  getCurrentCurrency,
  conversionRateSelector as getConversionRate,
  getSendMaxModeState,
  getCurrentEthBalance,
  isEthereumNetwork,
  getGasEstimatesLoadingStatus,
  isCustomMaxPriorityFeePerGasSafe,
  getCustomMaxFeePerGas, getBaseFeePerGas, getTokenBalance,
} from '../../../../selectors'
import {
  addHexWEIsToRenderableFiat,
  addHexWEIsToRenderableEth,
  subtractHexWEIsFromRenderableEth,
  calcCustomMaxPriorityFeePerGasInDec,
  calcCustomMaxFeePerGasInDec,
} from './utils'
import { calcEIP1559GasTotal, isBalanceSufficient } from '../../../../pages/send/send.utils'
import { addCurrencies, multiplyCurrencies } from '../../../../helpers/utils/conversion-util'

import { hideGasButtonGroup, updateSendErrors } from '../../../../ducks/send/send.duck'
import { calcMaxAmount } from '../../../../pages/send/send-content/send-amount-row/amount-max-button/amount-max-button.utils'
import EIP1559GasControlsModal from './component'

const mapStateToProps = (state, ownProps) => {
  const { currentNetworkTxList, send } = state.metamask
  const { modalState: { props: modalProps } = {} } = state.appState.modal || {}
  const { txData = {} } = modalProps || {}
  const { transaction = {} } = ownProps

  const currentCurrency = getCurrentCurrency(state)
  const conversionRate = getConversionRate(state)

  const selectedTransaction = currentNetworkTxList.find(({ id }) => id === (transaction.id || txData.id))
  const sendToken = getSendToken(state)

  const maxPriorityFeePerGas = send.maxPriorityFeePerGas || getFastPriceEstimateInHexWEI(state, true)
  const baseFeePerGas = getBaseFeePerGas(state)
  const maxFeePerGas = send.maxFeePerGas || addCurrencies(baseFeePerGas, maxPriorityFeePerGas, {
    aBase: 16,
    bBase: 16,
    toNumericBase: 'hex',
  })

  const defaultTxParams = {
    gas: send.gasLimit || '0x5208',
    value: sendToken ? '0x0' : send.amount,
    maxPriorityFeePerGas,
    maxFeePerGas,
  }

  const txParams = selectedTransaction?.txParams ?? defaultTxParams

  const { gas: currentGasLimit, value } = txParams

  const customModalMaxPriorityFeePerGasInHex = getCustomMaxPriorityFeePerGas(state) || maxPriorityFeePerGas
  const customModalMaxPriorityFeePerGasInDec = calcCustomMaxPriorityFeePerGasInDec(customModalMaxPriorityFeePerGasInHex)

  const customModalMaxFeePerGasInHex = getCustomMaxFeePerGas(state) || maxFeePerGas
  const customModalMaxFeePerGasInDec = calcCustomMaxFeePerGasInDec(customModalMaxFeePerGasInHex)

  const customModalGasLimitInHex = getCustomGasLimit(state) || currentGasLimit || '0x5208'

  const gasButtonInfo = getRenderableBasicEstimateData(state, customModalGasLimitInHex)

  const maxModeOn = getSendMaxModeState(state)
  const isSendTokenSet = Boolean(sendToken)
  const balance = getCurrentEthBalance(state)

  const maxPriorityFee = multiplyCurrencies(customModalGasLimitInHex, customModalMaxPriorityFeePerGasInHex, {
    toNumericBase: 'hex',
    multiplicandBase: 16,
    multiplierBase: 16,
  })
  const customGasTotal = calcEIP1559GasTotal(customModalGasLimitInHex, baseFeePerGas, customModalMaxPriorityFeePerGasInHex)

  const insufficientBalance = maxModeOn ? false : !isBalanceSufficient({
    amount: value,
    gasTotal: customGasTotal,
    balance,
    conversionRate,
  })

  const newTotalFiat = addHexWEIsToRenderableFiat(value, customGasTotal, currentCurrency, conversionRate)
  const newTotalEth = maxModeOn && !isSendTokenSet
    ? addHexWEIsToRenderableEth(balance, '0x0')
    : addHexWEIsToRenderableEth(value, customGasTotal)
  const sendAmount = maxModeOn && !isSendTokenSet
    ? subtractHexWEIsFromRenderableEth(balance, customGasTotal)
    : addHexWEIsToRenderableEth(value, '0x0')

  return {
    gasPriceButtonGroupProps: {
      buttonDataLoading: getBasicGasEstimateLoadingStatus(state),
      defaultActiveButtonIndex: getDefaultActiveButtonIndex(gasButtonInfo, customModalMaxPriorityFeePerGasInHex),
      gasButtonInfo,
    },
    infoRowProps: {
      originalTotalFiat: addHexWEIsToRenderableFiat(value, customGasTotal, currentCurrency, conversionRate),
      originalTotalEth: addHexWEIsToRenderableEth(value, customGasTotal),
      newTotalFiat: newTotalFiat,
      newTotalEth,
      maxPriorityFee: addHexWEIsToRenderableEth('0x0', maxPriorityFee),
      maxFee: addHexWEIsToRenderableEth('0x0', customGasTotal),
      sendAmount,
    },
    customModalMaxPriorityFeePerGasInHex,
    customModalMaxPriorityFeePerGasInDec,
    customModalMaxFeePerGasInHex,
    customModalMaxFeePerGasInDec,
    customModalGasLimitInHex,
    customGasLimit: parseInt(customModalGasLimitInHex, 16),
    isSpeedUp: transaction.status === 'submitted',
    isRetry: transaction.status === 'failed',
    isConfirm: Boolean(Object.keys(state.confirmTransaction.txData).length),
    isEthereumNetwork: isEthereumNetwork(state),
    insufficientBalance,
    gasEstimatesLoading: getGasEstimatesLoadingStatus(state),
    isCustomMaxPriorityFeePerGasSafe: isCustomMaxPriorityFeePerGasSafe(state),
    transaction: txData || transaction,
    txId: transaction.id,
    maxModeOn: getSendMaxModeState(state),
    sendToken,
    balance,
    tokenBalance: getTokenBalance(state),
    customGasTotal,
  }
}


const mapDispatchToProps = (dispatch) => {
  const updateCustomMaxPriorityFeePerGas = (value) => dispatch(setCustomMaxPriorityFeePerGas(addHexPrefix(value)))
  const updateCustomMaxFeePerGas = (value) => dispatch(setCustomMaxFeePerGas(addHexPrefix(value)))

  return {
    cancelAndClose: () => {
      dispatch(resetCustomData())
      dispatch(hideModal())
    },
    hideModal: () => dispatch(hideModal()),
    hideSidebar: () => dispatch(hideSidebar()),
    updateCustomMaxPriorityFeePerGas,
    updateCustomMaxFeePerGas,
    updateCustomGasLimit: (value) => dispatch(setCustomGasLimit(addHexPrefix(value))),
    updateConfirmTxGasAndCalculate: (gasParams, updatedTx) => {
      const { gasLimit, maxPriorityFeePerGas, maxFeePerGas } = gasParams

      updateCustomMaxPriorityFeePerGas(maxPriorityFeePerGas)
      updateCustomMaxFeePerGas(maxFeePerGas)
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
    setGasData: (gasParams) => {
      const { gasLimit, maxFeePerGas, maxPriorityFeePerGas } = gasParams

      dispatch(setGasLimit(gasLimit))
      dispatch(setMaxFeePerGas(maxFeePerGas))
      dispatch(setMaxPriorityFeePerGas(maxPriorityFeePerGas))
    },
    setAmountToMax: (maxAmountDataObject) => {
      dispatch(updateSendErrors({ amount: null }))
      dispatch(updateSendAmount(calcMaxAmount(maxAmountDataObject)))
    },
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    gasPriceButtonGroupProps,
    isSpeedUp,
    isRetry,
    isConfirm,
    customModalMaxPriorityFeePerGasInDec,
    customModalMaxFeePerGasInDec,
    customGasLimit,
    insufficientBalance,
    transaction,
    txId,
    maxModeOn,
    sendToken,
    balance,
    tokenBalance,
    customGasTotal,
  } = stateProps
  const {
    updateConfirmTxGasAndCalculate,
    updateCustomMaxPriorityFeePerGas,
    cancelAndClose,
    hideSidebar,
    hideModal,
    createRetryTransaction,
    createSpeedupTransaction,
    hideGasButtonGroup,
    setGasData,
    setAmountToMax,
  } = dispatchProps
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    gasPriceButtonGroupProps: {
      ...gasPriceButtonGroupProps,
      handleGasPriceSelection: updateCustomMaxPriorityFeePerGas,
    },
    cancelAndClose: () => {
      cancelAndClose()
      if (isSpeedUp || isRetry) {
        hideSidebar()
      }
    },
    onSubmit: (gasParams = {}) => {
      const {
        gasLimit,
        maxPriorityFeePerGas,
        maxFeePerGas,
      } = gasParams

      if (isConfirm) {
        const updatedTx = {
          ...transaction,
          txParams: {
            ...transaction.txParams,
            gas: gasLimit,
            maxPriorityFeePerGas,
            maxFeePerGas,
          },
        }

        updateConfirmTxGasAndCalculate(gasParams, updatedTx)
        hideModal()
      } else if (isSpeedUp) {
        createSpeedupTransaction(txId, gasParams)
        hideSidebar()
        cancelAndClose()
      } else if (isRetry) {
        createRetryTransaction(txId, gasParams)
        hideSidebar()
        cancelAndClose()
      } else {
        setGasData(gasParams)
        hideGasButtonGroup()
        cancelAndClose()
      }
      if (maxModeOn) {
        setAmountToMax({
          balance,
          gasTotal: customGasTotal,
          sendToken,
          tokenBalance,
        })
      }
    },
    disableSave:
      insufficientBalance ||
      (isSpeedUp && customModalMaxPriorityFeePerGasInDec === 0) ||
      (isSpeedUp && customModalMaxFeePerGasInDec === 0) ||
      customGasLimit < 21000,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EIP1559GasControlsModal)
