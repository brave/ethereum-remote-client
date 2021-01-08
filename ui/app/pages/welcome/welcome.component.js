import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ConnectWallet from '../../components/app/connect-wallet'
import BitGoModal from '../../components/app/bitgo-modal'
import BitGoLogoIcon from '../../../../brave/ui/app/components/app/dropdowns/assets/bitgo-logo'

import {
  BRAVE_BITGO_INITIALIZE_ROUTE,
  BRAVE_BITGO_WALLET_INDEX,
  BRAVE_CONNECT_WALLETS_ROUTE,
  CONNECT_HARDWARE_ROUTE,
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE,
} from '../../helpers/constants/routes'

export default class BraveWelcome extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object,
    setHardwareConnect: PropTypes.func,
    setHomeRedirectRoute: PropTypes.func,
    createBitGoWallet: PropTypes.func,
  }

  state = {
    showBitGoModal: false,
  }

  onCreate = ({ hardware = false, homeRedirectRoute }) => {
    if (hardware) {
      this.props.setHardwareConnect(true)
    }

    if (homeRedirectRoute) {
      this.props.setHomeRedirectRoute(homeRedirectRoute)
    }

    this.props.history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
  }

  onConnectFinish = () => {
    this.props.history.push(BRAVE_CONNECT_WALLETS_ROUTE)
  }

  onCreateBitGoWallets = (assets) => {
    /*for (const asset in assets) {
      this.props.createBitGoWallet(asset)
    }

    this.props.history.push(BRAVE_BITGO_WALLET_INDEX)*/
  }

  toggleBitGoModal = () => {
    this.setState({ showBitGoModal: !this.state.showBitGoModal })
  }

  onCreateBitGo = () => {
    return this.onCreate({ homeRedirectRoute: BRAVE_BITGO_INITIALIZE_ROUTE })
  }

  onCreateHardware = () => {
    return this.onCreate({ homeRedirectRoute: CONNECT_HARDWARE_ROUTE })
  }

  onRestore = () => {
    this.props.history.push(INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE)
  }

  render () {
    const { t } = this.context
    const { showBitGoModal } = this.state

    return (
      <div className="welcome-container">
        {/*showBitGoModal && (
          <BitGoModal
            onCreate={this.onCreateBitGoWallets}
            onClose={this.toggleBitGoModal}
          />
        )*/null}
        <div className="content">
          <div>
            <div className="welcome-title">
              <span>{t('cryptoWalletsTitle')}</span>
            </div>
          </div>
          <div>
            <ConnectWallet
              type="browser"
              onCreate={this.onCreate}
              onRestore={this.onRestore}
            />
            <ConnectWallet
              type="bitgo"
              onCreate={this.onCreateBitGo}
            />
            <ConnectWallet
              type="ledger"
              onCreate={this.onCreateHardware}
            />
            <ConnectWallet
              type="trezor"
              onCreate={this.onCreateHardware}
            />
          </div>
        </div>
      </div>
    )
  }
}
