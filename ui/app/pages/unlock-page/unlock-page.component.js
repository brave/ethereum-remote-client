import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TextField from '../../components/ui/text-field'
import { DEFAULT_ROUTE } from '../../helpers/constants/routes'

export default class UnlockPage extends Component {
  static contextTypes = {
    metricsEvent: PropTypes.func,
    t: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    isUnlocked: PropTypes.bool,
    onImport: PropTypes.func,
    onRestore: PropTypes.func,
    onSubmit: PropTypes.func,
    forceUpdateMetamaskState: PropTypes.func,
    showOptInModal: PropTypes.func,
    isNotification: PropTypes.bool,
    rejectAllPermissionsRequests: PropTypes.func,
    isInitialized: PropTypes.bool,
    completedOnboarding: PropTypes.bool,
    setCompletedOnboarding: PropTypes.func,
  }

  state = {
    password: '',
    error: null,
  }

  submitting = false

  UNSAFE_componentWillMount () {
    const { isUnlocked, history } = this.props

    if (isUnlocked) {
      history.push(DEFAULT_ROUTE)
    }
  }

  componentDidMount () {
    const {
      isInitialized,
      isNotification,
      completedOnboarding,
      setCompletedOnboarding,
    } = this.props

    if (isInitialized && !completedOnboarding) {
      setCompletedOnboarding()
    }

    if (isNotification) {
      window.addEventListener('beforeunload', this.beforeUnload)
    }
  }

  beforeUnload = () => {
    const {
      isUnlocked,
      rejectAllPermissionsRequests,
    } = this.props

    // We only want to reject requests in the event that
    // a user closes the popup without unlocking.
    if (!isUnlocked) {
      rejectAllPermissionsRequests()
    }
  }

  removeBeforeUnload = () => {
    window.removeEventListener('beforeunload', this.beforeUnload)
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    const { password } = this.state
    const { onSubmit, forceUpdateMetamaskState, isNotification, showOptInModal } = this.props

    if (password === '' || this.submitting) {
      return
    }

    this.setState({ error: null })
    this.submitting = true

    try {
      await onSubmit(password)
      const newState = await forceUpdateMetamaskState()
      this.context.metricsEvent({
        eventOpts: {
          category: 'Navigation',
          action: 'Unlock',
          name: 'Success',
        },
        isNewVisit: true,
      })

      if (newState.participateInMetaMetrics === null || newState.participateInMetaMetrics === undefined) {
        showOptInModal()
      }

      if (isNotification) {
        this.removeBeforeUnload()
      }
    } catch ({ message }) {
      if (message === 'Incorrect password') {
        const newState = await forceUpdateMetamaskState()
        this.context.metricsEvent({
          eventOpts: {
            category: 'Navigation',
            action: 'Unlock',
            name: 'Incorrect Password',
          },
          customVariables: {
            numberOfTokens: newState.tokens.length,
            numberOfAccounts: Object.keys(newState.accounts).length,
          },
        })
      }

      this.setState({ error: message })
      this.submitting = false
    }
  }

  handleInputChange ({ target }) {
    this.setState({ password: target.value, error: null })
  }

  renderSubmitButton () {
    const style = {
      backgroundColor: '#f7861c',
      color: 'white',
      marginTop: '20px',
      height: '60px',
      fontWeight: '400',
      boxShadow: 'none',
      borderRadius: '4px',
    }

    return (
      <Button
        type="submit"
        style={style}
        disabled={!this.state.password}
        fullWidth
        variant="contained"
        size="large"
        onClick={this.handleSubmit}
        disableRipple
      >
        { this.context.t('unlock') }
      </Button>
    )
  }

  render () {
    const { password, error } = this.state
    const { t } = this.context
    const { onImport, onRestore } = this.props

    return (
      <div className="unlock-page__container">
        <div className="unlock-page">
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
              onChange={(event) => this.handleInputChange(event)}
              error={error}
              autoFocus
              autoComplete="current-password"
              theme="material"
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
          </div>
        </div>
      </div>
    )
  }
}
