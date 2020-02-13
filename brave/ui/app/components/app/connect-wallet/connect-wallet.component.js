import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import BitGoLogoIcon from '../dropdowns/assets/bitgo-logo'

module.exports = class ConnectWallet extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    type: PropTypes.string,
    onCreate: PropTypes.func,
    onRestore: PropTypes.func,
    setHardwareConnect: PropTypes.func,
  }

  onAction = (func) => {
    const { type } = this.props

    if (type !== 'browser') {
      this.props.setHardwareConnect(true)
    }

    func()
  }

  renderWalletText = () => {
    let walletText = {}
    const { t } = this.context
    const { type } = this.props

    switch (type) {
      case 'bitgo':
        walletText = {
          title: (
            <div>
              <BitGoLogoIcon className="hardware-img"/>
            </div>
          ),
          subText: 'Use BitGo to purchase and manage non-Ethereum assets within Brave Crypto Wallets.'
        }
        break
      case 'browser':
        walletText = {
          title: t('newLocalWallet'),
          subText: t('newLocalWalletSubText'),
        }
        break
      case 'ledger':
        walletText = {
          title: (
            <div>
              <img className="hardware-img" src="images/ledger-logo.svg" />
            </div>
          ),
          subText: t('ledgerCreateSubText'),
        }
        break
      case 'trezor':
        walletText = {
          title: (
            <div>
              <img className="hardware-img" src="images/trezor-logo.svg" />
            </div>
          ),
          subText: t('trezorCreateSubText'),
        }
        break
      default:
        walletText = { title: '', subText: '' }
        break
    }

    return (
      <div>
        <div className="wallet-title">
          <span>{walletText.title}</span>
        </div>
        <div className="wallet-sub-text">
          <span>{walletText.subText}</span>
        </div>
      </div>
    )
  }

  render () {
    const {
      type,
      onCreate,
      onRestore,
    } = this.props
    const { t } = this.context
    const innerText = type === 'browser' ? t('create') : 'Create Wallet'
    const hwButtonStyle = type !== 'browser' ? { marginRight: '-15px' } : {}

    return (
      <div className="connect-wallet-container">
        <div className="controls">
          {
            onCreate
              ? (
                <button
                  style={hwButtonStyle}
                  onClick={this.onAction.bind(this, onCreate)}
                  className="create"
                >
                  {innerText}
                </button>
              )
              : null
          }
          {
            onRestore
              ? (
                <span
                  onClick={this.onAction.bind(this, onRestore)}
                  className="restore"
                >
                  {t('restore')}
                </span>
              )
              : null
          }
        </div>
        {this.renderWalletText()}
      </div>
    )
  }
}
