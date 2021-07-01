import { connect } from 'react-redux'
import { clearSwap } from '../../../store/actions'
import { getMostRecentOverviewPage } from '../../../ducks/history/history'
import { resetSwapState } from '../../../ducks/swap/swap.duck'
import SwapHeader from './swap-header.component'


function mapStateToProps (state) {
  return {
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    clearSwap: () => {
      dispatch(clearSwap())
      dispatch(resetSwapState())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SwapHeader)
