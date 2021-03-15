import { connect } from 'react-redux'
import { clearSwap } from '../../../store/actions'
import SwapFooter from './swap-footer.component'
import { getMostRecentOverviewPage } from '../../../ducks/history/history'

export default connect(mapStateToProps, mapDispatchToProps)(SwapFooter)

function mapStateToProps (state) {
  return {
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    clearSwap: () => dispatch(clearSwap()),
  }
}
