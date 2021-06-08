import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'

import { hideLoadingIndication, showLoadingIndication, updateSwapTokenApprovalTxId } from '../../../store/actions'
import {
  currentNetworkTxListSelector,
  getLoadingIndication,
  getNetworkIdentifier,
  getRpcPrefsForCurrentProvider,
} from '../../../selectors'
import WaitForComponent from './component'

function mapStateToProps (state, ownProps) {
  const txs = currentNetworkTxListSelector(state)
  const { id } = ownProps

  const transaction = txs.filter((tx) => tx.id === id)[0]

  return {
    transaction,
    isLoading: getLoadingIndication(state),
    network: getNetworkIdentifier(state),
    rpcPrefs: getRpcPrefsForCurrentProvider(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    hideLoadingIndication: () => dispatch(hideLoadingIndication()),
    showLoadingIndication: (message) => dispatch(showLoadingIndication(message)),
    updateSwapTokenApprovalTxId: (value) => dispatch(updateSwapTokenApprovalTxId(value)),
  }
}


export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(WaitForComponent)
