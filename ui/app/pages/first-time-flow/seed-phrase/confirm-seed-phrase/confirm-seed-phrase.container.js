import { connect } from 'react-redux'
import ConfirmSeedPhrase from '~/brave/ui/app/pages/first-time-flow/seed-phrase/confirm-seed-phrase/confirm-seed-phrase.component'
import {
  setSeedPhraseBackedUp,
  hideSeedPhraseBackupAfterOnboarding,
  initializeThreeBox,
} from '~/brave/ui/app/store/actions'
import { getSelectedAddress } from '../../../../selectors/selectors'

const mapStateToProps = state => {
  const { appState: { showingSeedPhraseBackupAfterOnboarding } } = state

  return {
    showingSeedPhraseBackupAfterOnboarding,
    selectedAddress: getSelectedAddress(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState) => dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
    hideSeedPhraseBackupAfterOnboarding: () => dispatch(hideSeedPhraseBackupAfterOnboarding()),
    initializeThreeBox: () => dispatch(initializeThreeBox()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmSeedPhrase)
