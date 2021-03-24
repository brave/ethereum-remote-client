import { connect } from 'react-redux'
import {
  getGasTotal,
  getSwapToken,
  getSwapFromBalance,
  getSwapTokenBalance,
  getSwapMaxModeState,
  getBasicGasEstimateLoadingStatus,
} from '../../../../../selectors'
import { calcMaxAmount } from './amount-max-button.utils.js'
import {
  updateSwapAmount,
  setMaxModeTo,
} from '../../../../../store/actions'
import AmountMaxButton from './amount-max-button.component'
import {
  updateSwapErrors,
} from '../../../../../ducks/swap/swap.duck'

export default connect(mapStateToProps, mapDispatchToProps)(AmountMaxButton)

function mapStateToProps (state) {

  return {
    balance: getSwapFromBalance(state),
    buttonDataLoading: getBasicGasEstimateLoadingStatus(state),
    gasTotal: getGasTotal(state),
    maxModeOn: getSwapMaxModeState(state),
    swapToken: getSwapToken(state),
    tokenBalance: getSwapTokenBalance(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setAmountToMax: (maxAmountDataObject) => {
      dispatch(updateSwapErrors({ amount: null }))
      dispatch(updateSwapAmount(calcMaxAmount(maxAmountDataObject)))
    },
    clearMaxAmount: () => {
      dispatch(updateSwapAmount('0'))
    },
    setMaxModeTo: (bool) => dispatch(setMaxModeTo(bool)),
  }
}
