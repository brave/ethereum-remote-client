import { connect } from 'react-redux'
import { getSwapAmount, getSwapFromAsset, getSwapQuoteEstimatedGasCost, getSwapToAsset } from '../../../../selectors'
import { computeSwapErrors, updateSwapAmount } from '../../../../store/actions'
import SwapAmountRow from './swap-amount-row.component'

function mapStateToProps (state) {
  return {
    amount: getSwapAmount(state),
    fromAsset: getSwapFromAsset(state),
    toAsset: getSwapToAsset(state),
    estimatedGasCost: getSwapQuoteEstimatedGasCost(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateSwapAmount: (newAmount) => dispatch(updateSwapAmount(newAmount)),
    computeSwapErrors: (overrides) => dispatch(computeSwapErrors(overrides)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SwapAmountRow)
