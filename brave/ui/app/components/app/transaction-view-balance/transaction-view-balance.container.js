import { connect } from 'react-redux'
import { coinbaseSetView } from '../../../store/actions'
import BraveTransactionViewBalance from './transaction-view-balance.component'

function mapStateToProps (state) {
  const accountId = state.metamask.coinbase.selectedAccount

  return {
    viewingCoinbase: state.appState.coinbaseShown,
    accountId,
    account: state.metamask.coinbase.accounts[accountId],
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showBuySell: () => dispatch(coinbaseSetView('buy')),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BraveTransactionViewBalance)
