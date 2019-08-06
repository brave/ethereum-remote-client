import { connect } from 'react-redux'
import { coinbaseSetSelectedAccount } from '../../../store/actions'
import BraveTokenList from './token-list.component'

function mapStateToProps (state) {
  return {
    viewingCoinbase: state.appState.coinbaseShown,
    accounts: state.metamask.coinbase.accounts,
    selectedAccount: state.metamask.coinbase.selectedAccount,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSelectedAccount: id => dispatch(coinbaseSetSelectedAccount(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BraveTokenList)
