import { connect } from 'react-redux'
import { TOGGLE_COINBASE } from '../../../store/actions'
import BraveAccountDetails from './account-details.component'

function mapStateToProps (state) {
  return {
    viewingCoinbase: state.appState.coinbaseShown,
    // TODO extract from state
    coinbaseName: 'Christopher Cooper',
    coinbaseBalance: 100,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    toggleCoinbase: () => dispatch({ type: TOGGLE_COINBASE }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BraveAccountDetails)
