import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'

import { approveAllowance, createTransaction, showLoadingIndication } from '../../../store/actions'
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
    sign: async (transaction) => {
      await dispatch(showLoadingIndication())
      await dispatch(createTransaction(transaction))
    },
    approve: async (allowance) => {
      await dispatch(showLoadingIndication())
      await dispatch(approveAllowance(allowance))
    },
  }
}


export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SwapFooter)
