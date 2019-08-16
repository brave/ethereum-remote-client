import { connect } from 'react-redux'
import { TOGGLE_PROVIDER } from '../../../store/actions'
import BraveAccountDetails from './account-details.component'

function mapStateToProps (state) {
  return {
    viewingProvider: state.appState.providerShown,
    // TODO extract from state
    providerName: 'Christopher Cooper',
    providerBalance: 100,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    toggleProvider: () => dispatch({ type: TOGGLE_PROVIDER }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BraveAccountDetails)
