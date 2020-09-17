import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ConnectWallet from '../../components/app/connect-wallet'

import {
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
  }

  onCreate = (hardware = false) => {
    if (hardware) {
      this.props.setHardwareConnect(true)
    }

    this.props.history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
  }

  onRestore = () => {
    this.props.history.push(INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE)
  }

  render () {
    const { t } = this.context

    return (
      <div className="welcome-container">
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
              type="ledger"
              onCreate={this.onCreate.bind(this, true)}
            />
            <ConnectWallet
              type="trezor"
              onCreate={this.onCreate.bind(this, true)}
            />
          </div>
        </div>
      </div>
    )
  }
}
