import Home from './home.component'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { unconfirmedTransactionsCountSelector } from '../../../../../ui/app/selectors/confirm-transaction'
import { getCurrentEthBalance, getDaiV1Token } from '../../../../../ui/app/selectors/selectors'
import {
  addTokens,
  setHardwareConnect,
  restoreFromThreeBox,
  turnThreeBoxSyncingOn,
  getThreeBoxLastUpdated,
  setShowRestorePromptToFalse,
  unsetMigratedPrivacyMode,
} from '../../store/actions'
import batToken from '../../store/bat-token'
import { setThreeBoxLastUpdated } from '../../../../../ui/app/ducks/app/app'
import { getEnvironmentType } from '../../../../../app/scripts/lib/util'
import { ENVIRONMENT_TYPE_POPUP } from '../../../../../app/scripts/lib/enums'

const mapStateToProps = state => {
  const { activeTab, metamask, appState } = state
  const {
    suggestedTokens,
    seedPhraseBackedUp,
    tokens,
    threeBoxSynced,
    showRestorePrompt,
    selectedAddress,
    batTokenAdded,
    hardwareConnect,
    providerRequests,
    migratedPrivacyMode,
  } = metamask
  const accountBalance = getCurrentEthBalance(state)
  const { forgottenPassword, threeBoxLastUpdated } = appState

  const isPopup = getEnvironmentType(window.location.href) === ENVIRONMENT_TYPE_POPUP

  return {
    forgottenPassword,
    suggestedTokens,
    unconfirmedTransactionsCount: unconfirmedTransactionsCountSelector(state),
    activeTab,
    shouldShowSeedPhraseReminder: !seedPhraseBackedUp && (parseInt(accountBalance, 16) > 0 || tokens.length > 0),
    isPopup,
    threeBoxSynced,
    showRestorePrompt,
    selectedAddress,
    threeBoxLastUpdated,
    hasDaiV1Token: Boolean(getDaiV1Token(state)),
    batTokenAdded,
    hardwareConnect,
    providerRequests,
    showPrivacyModeNotification: migratedPrivacyMode,
  }
}

const mapDispatchToProps = (dispatch) => ({
  unsetMigratedPrivacyMode: () => dispatch(unsetMigratedPrivacyMode()),
  turnThreeBoxSyncingOn: () => dispatch(turnThreeBoxSyncingOn()),
  setupThreeBox: () => {
    dispatch(getThreeBoxLastUpdated())
      .then(lastUpdated => {
        if (lastUpdated) {
          dispatch(setThreeBoxLastUpdated(lastUpdated))
        } else {
          dispatch(setShowRestorePromptToFalse())
          dispatch(turnThreeBoxSyncingOn())
        }
      })
  },
  restoreFromThreeBox: (address) => dispatch(restoreFromThreeBox(address)),
  setShowRestorePromptToFalse: () => dispatch(setShowRestorePromptToFalse()),
  addBatToken: () => dispatch(addTokens(batToken)),
  setHardwareConnect: (value) => dispatch(setHardwareConnect(value)),
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Home)
