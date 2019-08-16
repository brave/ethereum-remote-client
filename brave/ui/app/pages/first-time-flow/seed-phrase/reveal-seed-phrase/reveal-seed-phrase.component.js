import { exportAsFile } from '../../../../../../../ui/app/helpers/utils/util'
import RevealSeedPhrase from '../../../../../../../ui/app/pages/first-time-flow/seed-phrase/reveal-seed-phrase/reveal-seed-phrase.component'

module.exports = class BraveRevealSeedPhrase extends RevealSeedPhrase {

  handleExport = () => {
    const { t } = this.context
    const { seedPhrase } = this.props

    exportAsFile(t('backupPhraseFileName'), seedPhrase, 'text/plain')
  }
}
