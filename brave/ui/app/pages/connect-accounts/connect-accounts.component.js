import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import BitGoLogoIcon from '../../components/app/dropdowns/assets/bitgo-logo'
import ConnectWallet from '../../components/app/connect-wallet'
import CloseIcon from '../first-time-flow/welcome-modal/assets/close-icon'
import CloseIconDark from '../first-time-flow/welcome-modal/assets/close-icon-dark'
import {
  BRAVE_CONNECT_WALLETS_ROUTE,
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  BRAVE_BITGO_WALLET_INDEX
} from '../../helpers/constants/routes'
const { supportedCoins } = require('../../../../app/scripts/controllers/bitgo')

module.exports = class BraveConnectAccounts extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object,
  }

  constructor (props) {
    super(props)

    this.bitGoCurrencies = Object.keys(supportedCoins).map((coin) => {
      return supportedCoins[coin]
    })

    const checkedAssets = {}
    this.bitGoCurrencies.map((asset) => {
      checkedAssets[asset] = false
    })

    this.state = {
      checkedAssets,
      showBitGoModal: false
    }
  }

  onCreate = () => {
    this.props.history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
  }

  onConnectFinish = () => {
    this.props.history.push(BRAVE_CONNECT_WALLETS_ROUTE)
  }

  onCreateBitGoWallets = () => {
    this.props.history.push(BRAVE_BITGO_WALLET_INDEX)
  }

  onConnectBitGoWallets = () => {
    this.setState({ showBitGoModal: !this.state.showBitGoModal })
  }

  checkAsset = (asset) => {
    const { checkedAssets } = this.state
    checkedAssets[asset] = !checkedAssets[asset]
    this.setState({ checkedAssets })
  }

  getCryptoImage = (asset) => {
    return (
      <img src="" />
    )
  }

  renderBitGoModal () {
    const { checkedAssets } = this.state

    return (
      <div className="welcome-modal">
        <div className="__modal">
          <div className="__close" onClick={this.onConnectBitGoWallets}>
            <div className="close-light">
              <CloseIcon />
            </div>
            <div className="close-dark">
              <CloseIconDark />
            </div>
          </div>
          <div className="__content __bitgo" style={{ textAlign: 'left' }}>
            <BitGoLogoIcon />
            <h3>
              {'Select all crypto assets you would like to interact with.'}
            </h3>
            <p>{'A new wallet will be generated for each coin checked. Two of three private keys are stored on BitGo. The third key will be stored securely on Brave.'}</p>
            <div className="__wallets-area">
              {this.bitGoCurrencies.map((asset) => {
                const isChecked = checkedAssets[asset]

                return (
                  <div
                    key={`${asset}-wallet`}
                    className={'__bitgo-wallet-item'}
                    onClick={this.checkAsset.bind(this, asset)}>
                      <div className="__left-info">
                        <div className={`__checkmark ${isChecked ? 'checked' : ''}`}>
                        </div>
                        <div className="__asset-icon">
                          {this.getCryptoImage(asset)}
                        </div>
                        <div className="__asset-name">
                          {asset}
                        </div>
                      </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="__button-container">
            <button type="__button-create" onClick={this.onCreateBitGoWallets}>
              {'Create Wallets'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { showBitGoModal } = this.state

    return (
      <div className="welcome-container" style={{ width: '62vw' }}>
        {
          showBitGoModal
          ? this.renderBitGoModal()
          : null
        }
        <div className="content">
          <div style={{ textAlign: 'left', fontWeight: 'bold' }}>
            {'Wallets'}
          </div>
          <div>
            <ConnectWallet
              type="bitgo"
              onCreate={this.onConnectBitGoWallets}
              onRestore={this.onConnectFinish}
            />
            <ConnectWallet
              type="ledger"
              onCreate={this.onCreate}
            />
            <ConnectWallet
              type="trezor"
              onCreate={this.onCreate}
            />
          </div>
        </div>
      </div>
    )
  }
}
