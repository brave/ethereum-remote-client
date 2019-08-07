import { connect } from 'react-redux'
import BraveTransactionViewBalance from './transaction-view-balance.component'

function mapStateToProps (state) {
  const accountId = state.metamask.coinbase.selectedAccount

  return {
    viewingCoinbase: state.appState.coinbaseShown,
    accountId,
    account: state.metamask.coinbase.accounts[accountId],
  }
}

export default connect(mapStateToProps)(BraveTransactionViewBalance)
