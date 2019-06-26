import SecurityTab from '../../../../../../ui/app/pages/settings/security-tab/security-tab.component'

module.exports = class BraveSecurityTab extends SecurityTab {
  constructor (props) {
    super (props)
  }

  renderMetaMetricsOptIn () {
    return null
  }
}