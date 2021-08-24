import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import {
  getNetworkIdentifier,
  hasPermissionRequests,
  getPreferences,
  submittedPendingTransactionsSelector,
  isEIP1559Active,
} from '../../selectors'
import Routes from './routes.component'
import {
  hideSidebar,
  lockMetamask,
  setCurrentCurrency,
  setLastActiveTime,
  setMouseUserState,
} from '../../store/actions'
import { pageChanged } from '../../ducks/history/history'

function mapStateToProps (state) {
  const { appState } = state
  const {
    sidebar,
    alertOpen,
    alertMessage,
    isLoading,
    loadingMessage,
  } = appState
  const { autoLockTimeLimit = 0 } = getPreferences(state)

  return {
    sidebar,
    alertOpen,
    alertMessage,
    textDirection: state.metamask.textDirection,
    isLoading,
    loadingMessage,
    isUnlocked: state.metamask.isUnlocked,
    submittedPendingTransactions: submittedPendingTransactionsSelector(state),
    network: state.metamask.network,
    provider: state.metamask.provider,
    frequentRpcListDetail: state.metamask.frequentRpcListDetail || [],
    currentCurrency: state.metamask.currentCurrency,
    isMouseUser: state.appState.isMouseUser,
    providerId: getNetworkIdentifier(state),
    autoLockTimeLimit,
    hasPermissionsRequests: hasPermissionRequests(state),
    isEIP1559Active: isEIP1559Active(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    lockMetaMask: () => dispatch(lockMetamask(false)),
    hideSidebar: () => dispatch(hideSidebar()),
    setCurrentCurrencyToUSD: () => dispatch(setCurrentCurrency('usd')),
    setMouseUserState: (isMouseUser) => dispatch(setMouseUserState(isMouseUser)),
    setLastActiveTime: () => dispatch(setLastActiveTime()),
    pageChanged: (path) => dispatch(pageChanged(path)),
  }
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Routes)
