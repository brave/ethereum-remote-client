import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'

import {
  approveAllowance,
  createTransaction,
  hideLoadingIndication,
  showLoadingIndication,
  updateSwapTokenApprovalTxId,
} from '../../../store/actions'
import {
  getSwapErrors,
  getSwapFromAsset,
  getSwapTransactionObject,
  getUnapprovedTxs,
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
    unapprovedTxs: getUnapprovedTxs(state),
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
    hideLoadingIndication: () => dispatch(hideLoadingIndication()),
    updateSwapTokenApprovalTxId: (value) => dispatch(updateSwapTokenApprovalTxId(value)),
  }
}


export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SwapFooter)
