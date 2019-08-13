import React from 'react'
import PasswordWarning from '../password-warning'
import ImportWithSeedPhrase from '../../../../../../../ui/app/pages/first-time-flow/create-password/import-with-seed-phrase/import-with-seed-phrase.component'
import { validateMnemonic } from 'bip39'

module.exports = class BraveImportWithSeedPhrase extends ImportWithSeedPhrase {
  componentDidMount () {
    this.setState({ termsChecked: true })
  }

  handleSeedPhraseChange (seedPhrase) {
    let seedPhraseError = ''

    if (seedPhrase) {
      const parsedSeedPhrase = this.parseSeedPhrase(seedPhrase)
      if (parsedSeedPhrase.split(' ').length !== 24) {
        seedPhraseError = this.context.t('seedPhraseReq')
      } else if (!validateMnemonic(parsedSeedPhrase)) {
        seedPhraseError = this.context.t('invalidSeedPhrase')
      }
    }

    this.setState({ seedPhrase, seedPhraseError })
  }

  render () {
    return (
      <div>
        {super.render()}
        <PasswordWarning />
      </div>
    )
  }
}
