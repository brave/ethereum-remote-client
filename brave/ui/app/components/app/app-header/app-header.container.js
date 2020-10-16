const actions = require('../../../store/actions')
const { showAccountDetail } = actions

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import AppHeader from './app-header.component'
import { getMetaMaskAccounts } from '../../../../../../ui/app/selectors/selectors'

const mapStateToProps = state => {
  const { appState, metamask } = state
  const { networkDropdownOpen } = appState
  const {
    network,
    provider,
    selectedAddress,
    isUnlocked,
    isAccountMenuOpen,
    keyrings,
    identities
  } = metamask

  return {
    networkDropdownOpen,
    network,
    provider,
    selectedAddress,
    isUnlocked,
    isAccountMenuOpen,
    keyrings,
    identities,
    accounts: getMetaMaskAccounts(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showAccountDetail: (address) => dispatch(showAccountDetail(address)),
    showNetworkDropdown: () => dispatch(actions.showNetworkDropdown()),
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
    toggleAccountMenu: () => dispatch(actions.toggleAccountMenu()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(AppHeader)
