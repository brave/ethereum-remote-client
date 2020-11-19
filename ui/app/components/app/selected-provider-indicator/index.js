import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class SelectedProviderIndicator extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    isUnlocked: PropTypes.bool,
  }

  state = {
    isCurrentProvider: true,
  }

  componentDidMount () {
    // Feature check for older, un-updated browsers
    if (!window.chrome.braveWallet.hasOwnProperty('getWeb3Provider')) {
      return
    }

    window.chrome.braveWallet.getWeb3Provider((providerId) => {
      this.setState({
        isCurrentProvider: providerId === window.chrome.runtime.id,
      })
    })
  }

  openSettings (event) {
    event.preventDefault()

    window.chrome.tabs.create({
      url: `chrome://settings/extensions`,
    })
  }

  render () {
    if (!this.props.isUnlocked || this.state.isCurrentProvider) {
      return null
    }

    const { t } = this.context

    return (
      <div className="provider-error-wrapper">
        <span className="message">
          {t('providerErrorMessage')}
        </span>
        <a onClick={this.openSettings} className="settings">
          {t('braveSettings')}
        </a>
      </div>
    )
  }
}
