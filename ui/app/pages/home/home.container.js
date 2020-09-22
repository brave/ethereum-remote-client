import Home from './home.component'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  unconfirmedTransactionsCountSelector,
  getFirstPermissionRequest,
  getTotalUnapprovedCount,
} from '../../selectors'

import {
  setShowRestorePromptToFalse,
  setConnectedStatusPopoverHasBeenShown,
  setDefaultHomeActiveTabName,
  setHardwareConnect,
} from '../../store/actions'
import { getEnvironmentType } from '../../../../app/scripts/lib/util'
import {
  ENVIRONMENT_TYPE_NOTIFICATION,
  ENVIRONMENT_TYPE_POPUP,
} from '../../../../app/scripts/lib/enums'

const mapStateToProps = (state) => {
  const { metamask, appState } = state
  const {
    suggestedTokens,
    seedPhraseBackedUp,
    showRestorePrompt,
    selectedAddress,
    connectedStatusPopoverHasBeenShown,
    defaultHomeActiveTabName,
    hardwareConnect,
  } = metamask
  const { forgottenPassword } = appState
  const totalUnapprovedCount = getTotalUnapprovedCount(state)

  const envType = getEnvironmentType()
  const isPopup = envType === ENVIRONMENT_TYPE_POPUP
  const isNotification = envType === ENVIRONMENT_TYPE_NOTIFICATION

  const firstPermissionsRequest = getFirstPermissionRequest(state)
  const firstPermissionsRequestId = (firstPermissionsRequest && firstPermissionsRequest.metadata)
    ? firstPermissionsRequest.metadata.id
    : null

  return {
    forgottenPassword,
    suggestedTokens,
    unconfirmedTransactionsCount: unconfirmedTransactionsCountSelector(state),
    shouldShowSeedPhraseReminder: !seedPhraseBackedUp,
    isPopup,
    isNotification,
    showRestorePrompt,
    selectedAddress,
    firstPermissionsRequestId,
    totalUnapprovedCount,
    connectedStatusPopoverHasBeenShown,
    defaultHomeActiveTabName,
    hardwareConnect,
  }
}

const mapDispatchToProps = (dispatch) => ({
  setShowRestorePromptToFalse: () => dispatch(setShowRestorePromptToFalse()),
  setConnectedStatusPopoverHasBeenShown: () => dispatch(setConnectedStatusPopoverHasBeenShown()),
  onTabClick: (name) => dispatch(setDefaultHomeActiveTabName(name)),
  setHardwareConnect: (value) => dispatch(setHardwareConnect(value)),
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Home)
