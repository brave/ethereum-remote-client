import { connect } from 'react-redux'
import BraveBalance from './balance.component'

function mapStateToProps (state) {
  return {
    viewingCoinbase: state.appState.coinbaseShown,
  }
}

export default connect(mapStateToProps)(BraveBalance)
