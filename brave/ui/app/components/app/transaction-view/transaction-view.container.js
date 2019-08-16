import { connect } from 'react-redux'
import { providerSetView } from '../../../store/actions'
import BraveTransactionView from './transaction-view.component'

function mapStateToProps (state) {
  return {
    providerView: state.appState.providerShown ? state.appState.providerView : null,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    providerSetView: view => dispatch(providerSetView(view)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BraveTransactionView)
