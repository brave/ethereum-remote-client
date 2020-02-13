import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ConnectWallet from '../../components/app/connect-wallet'
import {
  BRAVE_CONNECT_WALLETS_ROUTE,
  INITIALIZE_CREATE_PASSWORD_ROUTE
} from '../../helpers/constants/routes'

module.exports = class BraveConnectAccounts extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object,
  }

  onCreate = () => {
    this.props.history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
  }

  onConnectFinish = () => {
    this.props.history.push(BRAVE_CONNECT_WALLETS_ROUTE)
  }

  render () {
    const { t } = this.context

    return (
      <div className="welcome-container">
        <div className="content">
          <div style={{ textAlign: 'left', fontWeight: 'bold' }}>
            {'Wallets'}
          </div>
          <div>
            <ConnectWallet
              type="bitgo"
              onCreate={this.onConnectFinish}
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
