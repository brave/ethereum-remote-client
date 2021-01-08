const actions = require('../../../../../../ui/app/store/actions')
const {
  createBitGoWallet,
  setHardwareConnect,
  showAccountDetail,
} = actions

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import AppHeader from './app-header.component'
import { getMetaMaskAccounts } from '../../../../../../ui/app/selectors/selectors'

const mapStateToProps = state => {
  const { appState, metamask, brave } = state
  const { networkDropdownOpen } = appState
  const {
    network,
    provider,
    selectedAddress,
    isUnlocked,
    isAccountMenuOpen,
    keyrings,
    identities,
    BitGoController: {
      bitgoWallets,
    },
  } = metamask

  const {
    bitGoCreatedWallets,
  } = brave

  return {
    networkDropdownOpen,
    network,
    provider,
    selectedAddress,
    isUnlocked,
    isAccountMenuOpen,
    keyrings,
    identities,
    accounts: getMetaMaskAccounts(state),
    bitGoCreatedWallets,
    bitgoWallets,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showAccountDetail: (address) => dispatch(showAccountDetail(address)),
    showNetworkDropdown: () => dispatch(actions.showNetworkDropdown()),
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
    toggleAccountMenu: () => dispatch(actions.toggleAccountMenu()),
    createBitGoWallet: (coin) => dispatch(createBitGoWallet(coin)),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(AppHeader)
