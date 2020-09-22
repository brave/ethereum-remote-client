import { connect } from 'react-redux'
import ImportWithSeedPhrase from './import-with-seed-phrase.component'
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

export default connect(null, mapDispatchToProps)(ImportWithSeedPhrase)
