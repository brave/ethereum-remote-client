import { connect } from 'react-redux'
import { addHexPrefix } from 'ethereumjs-util'

import {
  resetCustomData,
  setCustomGasLimit,
  setCustomPriorityFeePerGas,
  setCustomMaxFeePerGas,
} from '../../../../ducks/gas/gas.duck'
import { hideModal } from '../../../../store/actions'
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
  getCustomMaxFeePerGas,
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
  const baseFeePerGas = maxPriorityFeePerGas // FIXME - use real baseFee
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
    isSpeedUp: transaction.status === 'submitted',
    isRetry: transaction.status === 'failed',
    isEthereumNetwork: isEthereumNetwork(state),
    insufficientBalance,
    gasEstimatesLoading: getGasEstimatesLoadingStatus(state),
    isCustomMaxPriorityFeePerGasSafe: isCustomMaxPriorityFeePerGasSafe(state),
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    cancelAndClose: () => {
      dispatch(resetCustomData())
      dispatch(hideModal())
    },
    hideModal: () => dispatch(hideModal()),
    updateCustomMaxPriorityFeePerGas: (value) => dispatch(setCustomPriorityFeePerGas(addHexPrefix(value))),
    updateCustomMaxFeePerGas: (value) => dispatch(setCustomMaxFeePerGas(addHexPrefix(value))),
    updateCustomGasLimit: (value) => dispatch(setCustomGasLimit(addHexPrefix(value))),
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { gasPriceButtonGroupProps } = stateProps
  const { updateCustomMaxPriorityFeePerGas } = dispatchProps
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    gasPriceButtonGroupProps: {
      ...gasPriceButtonGroupProps,
      handleGasPriceSelection: updateCustomMaxPriorityFeePerGas,
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EIP1559GasControlsModal)
