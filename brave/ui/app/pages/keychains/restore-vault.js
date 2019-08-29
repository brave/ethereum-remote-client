const RestoreVaultPage = require('../../../../../ui/app/pages/keychains/restore-vault').default.WrappedComponent

import { connect } from 'react-redux'
import {
  createNewVaultAndRestore,
  unMarkPasswordForgotten,
} from '../../store/actions'

class BraveRestoreVaultPage extends RestoreVaultPage {
  handleSeedPhraseChange (seedPhrase) {
    let seedPhraseError = null

    if (seedPhrase) {
      const words = this.parseSeedPhrase(seedPhrase).split(' ')
      if (words.length !== 24 && words.length !== 12) {
        seedPhraseError = this.context.t('seedPhraseReq')
      }
    }

    this.setState({ seedPhrase, seedPhraseError })
  }
}

export default connect(
  ({ appState: { warning, isLoading } }) => ({ warning, isLoading }),
  dispatch => ({
    leaveImportSeedScreenState: () => {
      dispatch(unMarkPasswordForgotten())
    },
    createNewVaultAndRestore: (pw, seed) => dispatch(createNewVaultAndRestore(pw, seed)),
  })
)(BraveRestoreVaultPage)
