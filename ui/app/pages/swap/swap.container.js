import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { resetSwapState } from '../../ducks/swap/swap.duck'
import Swap from './swap.component'
import { getUnapprovedTxs } from '../../selectors'


function mapStateToProps (state) {
  return {
    unapprovedTxs: getUnapprovedTxs(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    resetSwapState: () => dispatch(resetSwapState()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Swap)
