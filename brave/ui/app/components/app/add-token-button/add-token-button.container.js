import { connect } from 'react-redux'
import BraveAddTokenButton from './add-token-button.component'

function mapStateToProps (state) {
  return {
    viewingCoinbase: state.appState.coinbaseShown,
  }
}

export default connect(mapStateToProps)(BraveAddTokenButton)
