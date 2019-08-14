import { connect } from 'react-redux'
import { coinbaseSetView } from '../../../store/actions'
import BraveTransactionView from './transaction-view.component'

function mapStateToProps (state) {
  return {
    coinbaseView: state.appState.coinbaseShown ? state.appState.coinbaseView : null,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    coinbaseSetView: view => dispatch(coinbaseSetView(view)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BraveTransactionView)
