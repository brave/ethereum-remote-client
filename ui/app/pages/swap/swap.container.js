import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { resetSwapState } from '../../ducks/swap/swap.duck'
import Swap from './swap.component'
import { getUnapprovedTxs } from '../../selectors'
import { hideLoadingIndication } from '../../store/actions'


function mapStateToProps (state) {
  return {
    unapprovedTxs: getUnapprovedTxs(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    resetSwapState: () => dispatch(resetSwapState()),
    hideLoadingIndication: () => dispatch(hideLoadingIndication()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Swap)
