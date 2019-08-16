import { connect } from 'react-redux'
import { providerSetView } from '../../../store/actions'
import BraveTransactionViewBalance from './transaction-view-balance.component'

function mapStateToProps (state) {
  const accountId = state.metamask.externalProvider.selectedAccount

  return {
    viewingProvider: state.appState.providerShown,
    accountId,
    account: state.metamask.externalProvider.accounts[accountId],
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showBuySell: () => dispatch(providerSetView('buy')),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BraveTransactionViewBalance)
