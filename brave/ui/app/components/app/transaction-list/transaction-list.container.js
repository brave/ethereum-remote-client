import { connect } from 'react-redux'
import BraveTransactionList from './transaction-list.component'

function mapStateToProps (state) {
  return {
    viewingProvider: state.appState.providerShown,
    account: state.metamask.externalProvider.accounts[state.metamask.externalProvider.selectedAccount],
  }
}

export default connect(mapStateToProps)(BraveTransactionList)
