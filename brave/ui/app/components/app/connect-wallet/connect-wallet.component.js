import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

module.exports = class ConnectWallet extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    onCreate: PropTypes.func,
    onRestore: PropTypes.func,
  }

  renderWalletText = () => {
    let walletText = {}

    const { type } = this.props
    const hardwareString = (type) => `Connect your ${type} hardware wallet to interact with dApps and make transfers to other connected wallets.`

    switch (type) {
      case 'browser':
        walletText = {
          title: 'New Browser Wallet',
          subText: 'Create a new Brave browser wallet to access dApps and store crypto and collectibles securely. Trade tokens annonymously with no trading fees.',
        }
        break
      case 'ledger':
        walletText = {
          title: (<div>
                    <img className={'hardware-img'} src={'images/ledger-logo.svg'} />
                  </div>),
          subText: hardwareString('Ledger'),
        }
        break
      case 'trezor':
        walletText = {
          title: (<div>
                    <img className={'hardware-img'} src={'images/trezor-logo.svg'} />
                  </div>),
          subText: hardwareString('Trezor'),
        }
        break
      default:
        walletText = { title: '', subText: '' }
        break
    }

    return (
      <div>
        <div className={'title'}>
          <span>{walletText.title}</span>
        </div>
        <div className={'sub-text'}>
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
    const innerText = type === 'browser' ? 'Create' : 'Connect'
    const hwButtonStyle = type !== 'browser' ? { marginRight: '-15px' } : {}

    return (
      <div className={'connect-wallet-container'}>
        <div className={'controls'}>
          {
            onCreate
            ? <button
                style={hwButtonStyle}
                onClick={onCreate}
                className={'create'}
              >
                {innerText}
              </button>
            : null
          }
          {
            onRestore
            ? <span
                onClick={onRestore}
                className={'restore'}
              >
                {'Restore'}
              </span>
            : null
          }
        </div>
        {this.renderWalletText()}
      </div>
    )
  }
}
