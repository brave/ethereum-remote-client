import React from 'react'
import PasswordWarning from '../password-warning'
import ImportWithSeedPhrase from '../../../../../../../ui/app/pages/first-time-flow/create-password/import-with-seed-phrase/import-with-seed-phrase.component'
import { validateMnemonic } from 'bip39'
import PropTypes from 'prop-types'

module.exports = class BraveImportWithSeedPhrase extends ImportWithSeedPhrase {
  static contextTypes = {
    t: PropTypes.func,
  }

  componentDidMount () {
    this.setState({ termsChecked: true })
  }

  handleSeedPhraseChange (seedPhrase) {
    let seedPhraseError = ''

    if (seedPhrase) {
      const parsedSeedPhrase = this.parseSeedPhrase(seedPhrase)
      if (parsedSeedPhrase.split(' ').length !== 24 &&
        parsedSeedPhrase.split(' ').length !== 12) {
        seedPhraseError = this.context.t('seedPhraseReq')
      } else if (!validateMnemonic(parsedSeedPhrase)) {
        seedPhraseError = this.context.t('invalidSeedPhrase')
      }
    }

    this.setState({ seedPhrase, seedPhraseError })
  }

  render () {
    const { t } = this.context
    return (
      <div>
        {super.render()}
        <div>{t('metamaskImportSubText')}</div>
        <PasswordWarning />
      </div>
    )
  }
}
