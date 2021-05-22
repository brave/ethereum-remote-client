import { connect } from 'react-redux'
import {
  getSwapConversionRate,
  getGasTotal,
  getSwapPrimaryCurrency,
  getSwapFromAsset,
  getSwapToAsset,
  getSwapAmount,
  getSwapFromBalance,
  getSwapToTokenBalance,
  getSwapFromTokenBalance,
  getSwapMaxModeState,
  swapAmountIsInError,
} from '../../../../selectors'
import { getAmountErrorObject, getGasFeeErrorObject } from '../../swap.utils'
import {
  setMaxModeTo,
  updateSwapAmount,
} from '../../../../store/actions'
import {
  updateSwapErrors,
} from '../../../../ducks/swap/swap.duck'
import SwapAmountRow from './swap-amount-row.component'

export default connect(mapStateToProps, mapDispatchToProps)(SwapAmountRow)

function mapStateToProps (state) {
  return {
    amount: getSwapAmount(state),
    balance: getSwapFromBalance(state),
    conversionRate: getSwapConversionRate(state),
    gasTotal: getGasTotal(state),
    inError: swapAmountIsInError(state),
    primaryCurrency: getSwapPrimaryCurrency(state),
    fromAsset: getSwapFromAsset(state),
    toAsset: getSwapToAsset(state),
    tokenToBalance: getSwapToTokenBalance(state),
    tokenFromBalance: getSwapFromTokenBalance(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateSwapAmount: (newAmount) => dispatch(updateSwapAmount(newAmount)),
    updateGasFeeError: (amountDataObject) => {
      dispatch(updateSwapErrors(getGasFeeErrorObject(amountDataObject)))
    },
    updateSwapAmountError: (amountDataObject) => {
      dispatch(updateSwapErrors(getAmountErrorObject(amountDataObject)))
    },
  }
}
