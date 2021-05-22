import { connect } from 'react-redux'
import {
  getSwapConversionRate,
  getGasTotal,
  getSwapGasPrice,
  getSwapGasLimit,
  getSwapAmount,
  getSwapFromBalance,
  getSwapToTokenBalance,
  getSwapFromTokenBalance,
  getSwapMaxModeState,
  getSwapGasLoadingError,
  gasSwapFeeIsInError,
  getSwapGasButtonGroupShown,
  getAdvancedInlineGasShown,
  getCurrentEthBalance,
  getSwapToken,
  getBasicGasEstimateLoadingStatus,
  getRenderableEstimateDataForSmallButtonsFromGWEI,
  getDefaultActiveButtonIndex,
  getIsMainnet,
} from '../../../../selectors'
import {
  // isBalanceSufficient,
  calcGasTotal,
} from '../../swap.utils.js'
import { calcMaxAmount } from '../amount-max-button/amount-max-button.utils'
import {
  showGasButtonGroup,
  updateSwapErrors,
} from '../../../../ducks/swap/swap.duck'
import {
  resetCustomData,
  setCustomGasPrice,
  setCustomGasLimit,
} from '../../../../ducks/gas/gas.duck'
import { showModal, setGasPrice, setGasLimit, setGasTotal, updateSwapAmount } from '../../../../store/actions'
import SwapGasRow from './swap-gas-row.component'


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SwapGasRow)

function mapStateToProps (state) {
  const gasButtonInfo = getRenderableEstimateDataForSmallButtonsFromGWEI(state)
  const gasPrice = getSwapGasPrice(state)
  const gasLimit = getSwapGasLimit(state)
  const activeButtonIndex = getDefaultActiveButtonIndex(gasButtonInfo, gasPrice)

  const gasTotal = getGasTotal(state)
  const conversionRate = getSwapConversionRate(state)
  const balance = getCurrentEthBalance(state)

  // const insufficientBalance = !isBalanceSufficient({
  //   amount: getSwapToken(state) ? '0x0' : getSwapAmount(state),
  //   gasTotal,
  //   balance,
  //   conversionRate,
  // })

  return {
    balance: getSwapFromBalance(state),
    gasTotal,
    gasFeeError: gasSwapFeeIsInError(state),
    gasLoadingError: getSwapGasLoadingError(state),
    gasPriceButtonGroupProps: {
      buttonDataLoading: getBasicGasEstimateLoadingStatus(state),
      defaultActiveButtonIndex: 1,
      newActiveButtonIndex: activeButtonIndex > -1 ? activeButtonIndex : null,
      gasButtonInfo,
    },
    gasButtonGroupShown: getSwapGasButtonGroupShown(state),
    advancedInlineGasShown: getAdvancedInlineGasShown(state),
    gasPrice,
    gasLimit,
    // insufficientBalance,
    maxModeOn: getSwapMaxModeState(state),
    swapFromToken: getSwapToken(state),
    tokenFromBalance: getSwapFromTokenBalance(state),
    isMainnet: getIsMainnet(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showCustomizeGasModal: () => dispatch(showModal({ name: 'CUSTOMIZE_GAS', hideBasic: true })),
    setGasPrice: (newPrice, gasLimit) => {
      dispatch(setGasPrice(newPrice))
      dispatch(setCustomGasPrice(newPrice))
      if (gasLimit) {
        dispatch(setGasTotal(calcGasTotal(gasLimit, newPrice)))
      }
    },
    setGasLimit: (newLimit, gasPrice) => {
      dispatch(setGasLimit(newLimit))
      dispatch(setCustomGasLimit(newLimit))
      if (gasPrice) {
        dispatch(setGasTotal(calcGasTotal(newLimit, gasPrice)))
      }
    },
    setAmountToMax: (maxAmountDataObject) => {
      dispatch(updateSwapErrors({ amount: null }))
      dispatch(updateSwapAmount(calcMaxAmount(maxAmountDataObject)))
    },
    showGasButtonGroup: () => dispatch(showGasButtonGroup()),
    resetCustomData: () => dispatch(resetCustomData()),
  }
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { gasPriceButtonGroupProps } = stateProps
  const { gasButtonInfo } = gasPriceButtonGroupProps
  const {
    setGasPrice: dispatchSetGasPrice,
    showGasButtonGroup: dispatchShowGasButtonGroup,
    resetCustomData: dispatchResetCustomData,
    ...otherDispatchProps
  } = dispatchProps

  return {
    ...stateProps,
    ...otherDispatchProps,
    ...ownProps,
    gasPriceButtonGroupProps: {
      ...gasPriceButtonGroupProps,
      handleGasPriceSelection: dispatchSetGasPrice,
    },
    resetGasButtons: () => {
      dispatchResetCustomData()
      dispatchSetGasPrice(gasButtonInfo[1].priceInHexWei)
      dispatchShowGasButtonGroup()
    },
    setGasPrice: dispatchSetGasPrice,
  }
}
