import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './assets/styles'

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
                    <img style={styles.hardwareImg} src={'images/ledger-logo.svg'} />
                  </div>),
          subText: hardwareString('Ledger'),
        }
        break
      case 'trezor':
        walletText = {
          title: (<div>
                    <img style={styles.hardwareImg} src={'images/trezor-logo.svg'} />
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
        <div style={styles.title}>
          <span>{walletText.title}</span>
        </div>
        <div style={styles.subText}>
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
      <div style={styles.container}>
        <div style={styles.controls}>
          {
            onCreate
            ? <button
                style={
                  {
                    ...styles.create,
                    ...hwButtonStyle,
                  }
                }
                onClick={onCreate}
              >
                {innerText}
              </button>
            : null
          }
          {
            onRestore
            ? <span
                style={styles.restore}
                onClick={onRestore}
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
