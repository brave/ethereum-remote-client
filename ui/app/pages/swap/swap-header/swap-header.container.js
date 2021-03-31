import { connect } from 'react-redux'
import { clearSwap } from '../../../store/actions'
import SwapHeader from './swap-header.component'
import { getTitleKey } from '../../../selectors'
import { getMostRecentOverviewPage } from '../../../ducks/history/history'

export default connect(mapStateToProps, mapDispatchToProps)(SwapHeader)

function mapStateToProps (state) {
  return {
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    titleKey: getTitleKey(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    clearSwap: () => dispatch(clearSwap()),
  }
}
