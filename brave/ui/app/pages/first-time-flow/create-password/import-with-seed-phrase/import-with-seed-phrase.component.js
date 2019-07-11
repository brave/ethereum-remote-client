import ImportWithSeedPhrase from '../../../../../../../ui/app/pages/first-time-flow/create-password/import-with-seed-phrase/import-with-seed-phrase.component'

module.exports = class BraveImportWithSeedPhrase extends ImportWithSeedPhrase {

  componentDidMount () {
    this.setState({ termsChecked: true })
  }
}
