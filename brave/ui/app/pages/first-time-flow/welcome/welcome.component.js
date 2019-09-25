import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import WelcomeModal from '../welcome-modal'
import ConnectWallet from '../../../components/app/connect-wallet'

import {
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE,
} from '../../../../../../ui/app/helpers/constants/routes'

module.exports = class BraveWelcome extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
  }

  onCreate = () => {
    this.props.history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
  }

  onRestore = () => {
    this.props.history.push(INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE)
  }

  render () {
    return (
      <div className={'welcome-container'}>
        <WelcomeModal />
        <div className={'content'}>
          <div>
            <div className={'welcome-title'}>
              <span>{'Crypto Wallets'}</span>
            </div>
            <div className={'welcome-sub-text'}>
              <span>{'Choose a type to set up:'}</span>
            </div>
          </div>
          <div>
            <ConnectWallet
              type={'browser'}
              onCreate={this.onCreate}
              onRestore={this.onRestore}
            />
            <ConnectWallet
              type={'ledger'}
              onCreate={this.onCreate}
            />
            <ConnectWallet
              type={'trezor'}
              onCreate={this.onCreate}
            />
          </div>
        </div>
      </div>
    )
  }
}
