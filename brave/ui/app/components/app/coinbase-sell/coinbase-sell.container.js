import { connect } from 'react-redux'
import { coinbaseSetSelectedAccount } from '../../../store/actions'
import CoinbaseSell from './coinbase-sell.component'

function mapStateToProps (state) {
  const { accounts, selectedAccount } = state.metamask.coinbase
  return { accounts, selectedAccount }
}

function mapDispatchToProps (dispatch) {
  return {
    selectAccount: id => dispatch(coinbaseSetSelectedAccount(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoinbaseSell)
