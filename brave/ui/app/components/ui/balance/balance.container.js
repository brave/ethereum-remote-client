import { connect } from 'react-redux'
import BraveBalance from './balance.component'

function mapStateToProps (state) {
  return {
    viewingProvider: state.appState.providerShown,
  }
}

export default connect(mapStateToProps)(BraveBalance)
