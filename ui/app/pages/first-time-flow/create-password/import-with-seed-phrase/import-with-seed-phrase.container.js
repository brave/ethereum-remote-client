import { connect } from 'react-redux'
import ImportWithSeedPhrase from '~/brave/ui/app/pages/first-time-flow/create-password/import-with-seed-phrase/import-with-seed-phrase.component'
import {
  setSeedPhraseBackedUp,
  initializeThreeBox,
} from '~/brave/ui/app/store/actions'

const mapDispatchToProps = dispatch => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState) => dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
    initializeThreeBox: () => dispatch(initializeThreeBox()),
  }
}

export default connect(null, mapDispatchToProps)(ImportWithSeedPhrase)
