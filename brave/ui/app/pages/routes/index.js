const Routes = require('../../../../../ui/app/pages/routes')

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'

import {
  getMetaMaskAccounts,
  getNetworkIdentifier,
  preferencesSelector,
} from '../../../../../ui/app/selectors/selectors'
import BraveHeader from '../../components/app/header'
import {
  submittedPendingTransactionsSelector,
} from '../../../../../ui/app/selectors/transactions'

import actions from '../../store/actions'

function mapStateToProps (state) {
  const { appState, metamask } = state
  const {
    networkDropdownOpen,
    sidebar,
    alertOpen,
    alertMessage,
    isLoading,
    loadingMessage,
  } = appState

  const accounts = getMetaMaskAccounts(state)
  const { autoLogoutTimeLimit = 0 } = preferencesSelector(state)

  const {
    identities,
    address,
    keyrings,
    isInitialized,
    seedWords,
    unapprovedTxs,
    lostAccounts,
    unapprovedMsgCount,
    unapprovedPersonalMsgCount,
    unapprovedTypedMessagesCount,
    providerRequests,
    batTokenAdded,
  } = metamask
  const selected = address || Object.keys(accounts)[0]

  return {
    // state from plugin
    networkDropdownOpen,
    sidebar,
    alertOpen,
    alertMessage,
    isLoading,
    loadingMessage,
    isInitialized,
    isUnlocked: state.metamask.isUnlocked,
    selectedAddress: state.metamask.selectedAddress,
    currentView: state.appState.currentView,
    activeAddress: state.appState.activeAddress,
    transForward: state.appState.transForward,
    isOnboarding: Boolean(seedWords || !isInitialized),
    isPopup: state.metamask.isPopup,
    seedWords: state.metamask.seedWords,
    submittedPendingTransactions: submittedPendingTransactionsSelector(state),
    unapprovedTxs,
    unapprovedMsgs: state.metamask.unapprovedMsgs,
    unapprovedMsgCount,
    unapprovedPersonalMsgCount,
    unapprovedTypedMessagesCount,
    menuOpen: state.appState.menuOpen,
    network: state.metamask.network,
    provider: state.metamask.provider,
    forgottenPassword: state.appState.forgottenPassword,
    lostAccounts,
    frequentRpcListDetail: state.metamask.frequentRpcListDetail || [],
    currentCurrency: state.metamask.currentCurrency,
    isMouseUser: state.appState.isMouseUser,
    isRevealingSeedWords: state.metamask.isRevealingSeedWords,
    Qr: state.appState.Qr,
    welcomeScreenSeen: state.metamask.welcomeScreenSeen,
    providerId: getNetworkIdentifier(state),
    autoLogoutTimeLimit,

    identities,
    selected,
    keyrings,
    providerRequests,
    batTokenAdded,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dispatch,
    hideSidebar: () => dispatch(actions.hideSidebar()),
    showNetworkDropdown: () => dispatch(actions.showNetworkDropdown()),
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
    setCurrentCurrencyToUSD: () => dispatch(actions.setCurrentCurrency('usd')),
    toggleAccountMenu: () => dispatch(actions.toggleAccountMenu()),
    setMouseUserState: (isMouseUser) => dispatch(actions.setMouseUserState(isMouseUser)),
    setLastActiveTime: () => dispatch(actions.setLastActiveTime()),
  }
}

Routes.propTypes.batTokenAdded = PropTypes.bool

class BraveRoutes extends Component {

  render () {
    return (
      <div>
        <BraveHeader />
        <Routes />
      </div>
    )
  }
}

module.exports = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(BraveRoutes)
