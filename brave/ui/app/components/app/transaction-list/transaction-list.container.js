import { connect } from 'react-redux'
import BraveTransactionList from './transaction-list.component'

function mapStateToProps (state) {
  return {
    viewingCoinbase: state.appState.coinbaseShown,
    account: state.metamask.coinbase.accounts[state.metamask.coinbase.selectedAccount],
  }
}

export default connect(mapStateToProps)(BraveTransactionList)
