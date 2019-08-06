import RestoreVaultPage from '../../../../../ui/app/pages/keychains/restore-vault'

module.exports = class BraveRestoreVaultPage extends RestoreVaultPage {
  handleSeedPhraseChange (seedPhrase) {
    let seedPhraseError = null

    if (seedPhrase && this.parseSeedPhrase(seedPhrase).split(' ').length !== 24) {
      seedPhraseError = this.context.t('seedPhraseReq')
    }

    this.setState({ seedPhrase, seedPhraseError })
  }
}
