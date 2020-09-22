import { connect } from 'react-redux'
import ConfirmSeedPhrase from './confirm-seed-phrase.component'
import {
  setSeedPhraseBackedUp,
  setCompletedOnboarding,
} from '../../../../store/actions'

const mapDispatchToProps = (dispatch) => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState) => dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
    completeOnboarding: () => dispatch(setCompletedOnboarding()),
  }
}

export default connect(null, mapDispatchToProps)(ConfirmSeedPhrase)
