import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '../../../../../ui/app/components/ui/text-field'
import UnlockPage from '../../../../../ui/app/pages/unlock-page/unlock-page.component'

module.exports = class BraveUnlockPage extends UnlockPage {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      resetErr: false,
      canReset: false,
      isResetting: false,
      confirmationPhrase: '',
    }
  }

  componentDidMount () {
    const {
      isInitialized,
      completedOnboarding,
      setCompletedOnboarding,
    } = this.props

    if (isInitialized && !completedOnboarding) {
      setCompletedOnboarding()
    }

    window.addEventListener('beforeunload', (_e) => {
      if (this.state.isResetting) {
        chrome.braveWallet.resetWallet()
      }
    })
  }

  onResetPrompt = () => {
    this.setState({ isResetting: true })
  }

  handleReset = (event) => {
    event.preventDefault()
    event.stopPropagation()
    chrome.tabs.getCurrent(({ id }) => {
      chrome.tabs.remove(id, () => {})
    })
  }

  cancelReset = () => {
    this.setState({ isResetting: false })
  }

  handleInputUpdate = ({ target }) => {
    const confirmationPhrase = target.value
    const canReset = confirmationPhrase === this.context.t('resetConfirmationPhrase')
    this.setState({ canReset, confirmationPhrase })
  }

  renderResetView () {
    const { t } = this.context
    const { canReset, confirmationPhrase } = this.state

    return (
      <div>
        <span className="reset-title">
          { t('resetCryptoWallets') }
        </span>
        <div className="reset-disclaimer">
          <p>{ t('resetDisclaimer') }</p>
        </div>
        <div className="reset-form">
          <form
            className="unlock-page__form"
            onSubmit={this.handleReset}
          >
            <TextField
              id="reset-confirmation"
              label={t('resetPlaceholder')}
              type="text"
              value={confirmationPhrase}
              onChange={event => this.handleInputUpdate(event)}
              error={''}
              autoFocus
              material
              fullWidth
            />
          </form>
          <Button
            type="submit"
            className="reset-button"
            disabled={!canReset}
            fullWidth
            variant="raised"
            size="large"
            onClick={this.handleReset}
            disableRipple
          >
            { this.context.t('resetButtonText') }
          </Button>
          <div className="reset-cancel">
            <span onClick={this.cancelReset}>
              { t('cancel') }
            </span>
          </div>
        </div>
      </div>      
    )
  }

  renderUnlockView () {
    const { t } = this.context
    const { onImport, onRestore } = this.props
    const { password, error } = this.state
    const resetSupported = chrome.braveWallet.hasOwnProperty('resetWallet')

    return (
      <div>
        <h1 className="unlock-page__title">
          { t('welcomeBack') }
        </h1>
        <div>{ t('unlockMessage') }</div>
        <form
          className="unlock-page__form"
          onSubmit={this.handleSubmit}
        >
          <TextField
            id="password"
            label={t('password')}
            type="password"
            value={password}
            onChange={event => this.handleInputChange(event)}
            error={error}
            autoFocus
            autoComplete="current-password"
            material
            fullWidth
          />
        </form>
        { this.renderSubmitButton() }
        <div className="unlock-page__links">
          <div
            className="unlock-page__link"
            onClick={() => onRestore()}
          >
            { t('restoreFromSeed') }
          </div>
          <div
            className="unlock-page__link unlock-page__link--import"
            onClick={() => onImport()}
          >
            { t('importUsingSeed') }
          </div>
          {
            resetSupported
            ? <div
                className="unlock-page__link unlock-page__link--import"
                onClick={this.onResetPrompt}
              >
                { t('resetCryptoWallets') }
              </div>
            : null
          }
        </div>
      </div>
    )
  }

  render () {
    const isResetting = this.state.isResetting
    const className = `unlock-page ${isResetting ? 'reset': ''}`

    return (
      <div className="unlock-page__container">
        <div className={className}>
          {
            isResetting
            ? this.renderResetView()
            : this.renderUnlockView()
          }
        </div>
      </div>
    )
  }
}
