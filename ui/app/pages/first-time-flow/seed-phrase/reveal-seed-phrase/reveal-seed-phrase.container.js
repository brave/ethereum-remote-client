import { connect } from 'react-redux'
import RevealSeedPhrase from '~/brave/ui/app/pages/first-time-flow/seed-phrase/reveal-seed-phrase/reveal-seed-phrase.component'
import {
  setCompletedOnboarding,
  setSeedPhraseBackedUp,
} from '~/brave/ui/app/store/actions'

const mapDispatchToProps = dispatch => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState) => dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
    setCompletedOnboarding: () => dispatch(setCompletedOnboarding()),
  }
}

export default connect(null, mapDispatchToProps)(RevealSeedPhrase)
