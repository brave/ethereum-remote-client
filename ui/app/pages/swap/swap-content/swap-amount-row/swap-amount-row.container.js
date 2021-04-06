import { connect } from 'react-redux'
import {
  getSwapConversionRate,
  getGasTotal,
  getSwapPrimaryCurrency,
  getSwapFromToken,
  getSwapToToken,
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
    swapFromToken: getSwapFromToken(state),
    swapToToken: getSwapToToken(state),
    tokenToBalance: getSwapToTokenBalance(state),
    tokenFromBalance: getSwapFromTokenBalance(state),
    maxModeOn: getSwapMaxModeState(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setMaxModeTo: (bool) => dispatch(setMaxModeTo(bool)),
    updateSwapAmount: (newAmount) => dispatch(updateSwapAmount(newAmount)),
    updateGasFeeError: (amountDataObject) => {
      dispatch(updateSwapErrors(getGasFeeErrorObject(amountDataObject)))
    },
    updateSwapAmountError: (amountDataObject) => {
      dispatch(updateSwapErrors(getAmountErrorObject(amountDataObject)))
    },
  }
}
