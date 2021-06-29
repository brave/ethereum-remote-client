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
  getSwapAmount,
  getSwapErrors,
  getSwapFromAsset,
  getSwapQuote,
  getSwapToAsset,
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
    isSwapFromTokenAssetAllowanceEnough: isSwapFromTokenAssetAllowanceEnough(state),
    fromAsset: getSwapFromAsset(state),
    toAsset: getSwapToAsset(state),
    unapprovedTxs: getUnapprovedTxs(state),
    transaction: getSwapTransactionObject(state),
    amount: getSwapAmount(state),
    quote: getSwapQuote(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    sign: (transaction) => dispatch(createTransaction(transaction)),
    approve: async (allowance) => {
      await dispatch(showLoadingIndication())
      await dispatch(approveAllowance(allowance))
    },
    hideLoadingIndication: () => dispatch(hideLoadingIndication()),
    showLoadingIndication: () => dispatch(showLoadingIndication()),
    updateSwapTokenApprovalTxId: (value) => dispatch(updateSwapTokenApprovalTxId(value)),
  }
}


export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SwapFooter)
