import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'

import {
  approveAllowance,
  clearSwap,
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
import { resetSwapState } from '../../../ducks/swap/swap.duck'

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
    clearSwap: () => {
      dispatch(clearSwap())
      dispatch(resetSwapState())
    },
  }
}


export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SwapFooter)
