import { connect } from 'react-redux'
import { providerSetSelectedAccount } from '../../../store/actions'
import ProviderBuy from './provider-buy.component'

function mapStateToProps (state) {
  const { accounts, selectedAccount } = state.metamask.externalProvider
  return { accounts, selectedAccount }
}

function mapDispatchToProps (dispatch) {
  return {
    selectAccount: id => dispatch(providerSetSelectedAccount(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderBuy)
