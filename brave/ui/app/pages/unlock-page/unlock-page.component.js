import UnlockPage from '../../../../../ui/app/pages/unlock-page/unlock-page.component'

module.exports = class BraveUnlockPage extends UnlockPage {
  componentDidMount () {
    const {
      isInitialized,
      completedOnboarding,
      setCompletedOnboarding,
    } = this.props

    if (isInitialized && !completedOnboarding) {
      setCompletedOnboarding()
    }
  }
}
