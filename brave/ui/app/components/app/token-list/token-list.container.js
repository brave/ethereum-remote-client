import { connect } from 'react-redux'
import { providerSetSelectedAccount, providerSetView } from '../../../store/actions'
import BraveTokenList from './token-list.component'

function mapStateToProps (state) {
  return {
    viewingProvider: state.appState.providerShown,
    accounts: state.metamask.externalProvider.accounts,
    selectedAccount: state.metamask.externalProvider.selectedAccount,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSelectedAccount: id => {
      dispatch(providerSetSelectedAccount(id))
      dispatch(providerSetView(null))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BraveTokenList)
