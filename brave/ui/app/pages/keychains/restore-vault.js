const RestoreVaultPage = require('../../../../../ui/app/pages/keychains/restore-vault').default.WrappedComponent

import { connect } from 'react-redux'
import {
  createNewVaultAndRestore,
  unMarkPasswordForgotten,
} from '../../store/actions'

class BraveRestoreVaultPage extends RestoreVaultPage {
  handleSeedPhraseChange (seedPhrase) {
    let seedPhraseError = null

    if (seedPhrase && this.parseSeedPhrase(seedPhrase).split(' ').length !== 24) {
      seedPhraseError = this.context.t('seedPhraseReq')
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
