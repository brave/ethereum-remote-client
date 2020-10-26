import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Button from '../../ui/button'
import BitGoLogoIcon from '../../../../../brave/ui/app/components/app/dropdowns/assets/bitgo-logo'
import CreateWalletIcon from '../../ui/icon/create-wallet-icon.component'
import LedgerLogo from '../../../../../brave/ui/app/components/app/dropdowns/assets/ledger-logo'
import TrezorLogo from '../../../../../brave/ui/app/components/app/dropdowns/assets/trezor-logo'

const HARDWARE_TYPES = ['ledger', 'trezor']

export default class ConnectWallet extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    type: PropTypes.string,
    onCreate: PropTypes.func,
    onRestore: PropTypes.func,
  }

  onAction = (func) => {
    func()
  }

  isHardware() {
    return HARDWARE_TYPES.indexOf(this.props.type) >= 0
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
              <BitGoLogoIcon className="bitgo-logo"/>
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
              <LedgerLogo className="ledger-logo" />
            </div>
          ),
          subText: t('ledgerCreateSubText'),
        }
        break
      case 'trezor':
        walletText = {
          title: (
            <div>
              <TrezorLogo className="trezor-logo" />
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
      <div className="wallet-desc">
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

    const innerText = this.isHardware() ? t('connect') : t('createAWallet')
    const createIcon = !this.isHardware()

    return (
      <div className="connect-wallet-container">
        {this.renderWalletText()}
        <div className="controls">
          {
            onCreate
              ? (
                <Button
                  icon={createIcon && <CreateWalletIcon className="create-icon" size={16} />}
                  onClick={this.onAction.bind(this, onCreate)}
                  className="create"
                >
                  {innerText}
                </Button>
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
              : <div />
          }
        </div>
      </div>
    )
  }
}
