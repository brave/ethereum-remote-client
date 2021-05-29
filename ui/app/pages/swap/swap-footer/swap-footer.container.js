import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'

import { approveAllowance, clearSwap, signTx } from '../../../store/actions'
import {
  getSwapErrors,
  getSwapFromAsset,
  getSwapTransactionObject,
  isSwapFormInError,
  isSwapFromTokenAssetAllowanceEnough,
} from '../../../selectors'
import SwapFooter from './swap-footer.component'

function mapStateToProps (state) {
  return {
    swapErrors: getSwapErrors(state),
    inError: isSwapFormInError(state),
    transaction: getSwapTransactionObject(state),
    isSwapFromTokenAssetAllowanceEnough: isSwapFromTokenAssetAllowanceEnough(state),
    fromAsset: getSwapFromAsset(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    clearSwap: () => dispatch(clearSwap()),
    sign: (transaction) => dispatch(signTx(transaction)),
    approve: (allowance) => dispatch(approveAllowance(allowance)),
  }
}


export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SwapFooter)
