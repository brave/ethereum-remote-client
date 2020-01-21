const Routes = require('../../../../../ui/app/pages/routes')

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'

import {
  getNetworkIdentifier,
  preferencesSelector,
} from '../../../../../ui/app/selectors/selectors'
import BraveHeader from '../../components/app/header'
import {
  submittedPendingTransactionsSelector,
} from '../../../../../ui/app/selectors/transactions'

import actions from '../../store/actions'

function mapStateToProps (state) {
  const { appState } = state
  const {
    sidebar,
    alertOpen,
    alertMessage,
    isLoading,
    loadingMessage,
  } = appState

  const { autoLogoutTimeLimit = 0 } = preferencesSelector(state)

  return {
    // state from plugin
    sidebar,
    alertOpen,
    alertMessage,
    textDirection: state.metamask.textDirection,
    isLoading,
    loadingMessage,
    isUnlocked: state.metamask.isUnlocked,
    currentView: state.appState.currentView,
    submittedPendingTransactions: submittedPendingTransactionsSelector(state),
    network: state.metamask.network,
    provider: state.metamask.provider,
    selectedAddress: state.metamask.selectedAddress,
    frequentRpcListDetail: state.metamask.frequentRpcListDetail || [],
    currentCurrency: state.metamask.currentCurrency,
    isMouseUser: state.appState.isMouseUser,
    providerId: getNetworkIdentifier(state),
    autoLogoutTimeLimit,
    batTokenAdded: state.metamask.batTokenAdded,
    rewardsDisclosureAccepted: state.metamask.rewardsDisclosureAccepted,
    hardwareConnect: state.metamask.hardwareConnect,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    lockMetaMask: () => dispatch(actions.lockMetamask(false)),
    hideSidebar: () => dispatch(actions.hideSidebar()),
    setCurrentCurrencyToUSD: () => dispatch(actions.setCurrentCurrency('usd')),
    setMouseUserState: (isMouseUser) => dispatch(actions.setMouseUserState(isMouseUser)),
    setLastActiveTime: () => dispatch(actions.setLastActiveTime()),
    showAccountDetail: address => dispatch(actions.showAccountDetail(address)),
  }
}

Routes.propTypes.batTokenAdded = PropTypes.bool

class BraveRoutes extends Component {
  componentDidMount () {
    const container = document.querySelector('#app-content')

    if (!container) {
      return
    }

    const setTheme = (t) => {
      container.className += ` ${t.toLowerCase()}`
    }

    if (chrome.hasOwnProperty('braveTheme')) {
      chrome.braveTheme.getBraveThemeType((type) => setTheme(type))
      chrome.braveTheme.onBraveThemeTypeChanged.addListener((type) => setTheme(type))
    }
  }

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
