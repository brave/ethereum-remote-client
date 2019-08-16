import { connect } from 'react-redux'
import BraveAddTokenButton from './add-token-button.component'

function mapStateToProps (state) {
  return {
    viewingProvider: state.appState.providerShown,
  }
}

export default connect(mapStateToProps)(BraveAddTokenButton)
