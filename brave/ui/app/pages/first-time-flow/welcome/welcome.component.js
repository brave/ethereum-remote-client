import React from 'react'
import style from '../assets/styles'
import Welcome from '../../../../../../ui/app/pages/first-time-flow/welcome/welcome.component'
import ConnectWallet from '../../../components/app/connect-wallet'

import {
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE,
} from '../../../../../../ui/app/helpers/constants/routes'

module.exports = class BraveWelcome extends Welcome {

  onCreate = () => {
    this.props.history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
  }

  onRestore = () => {
    this.props.history.push(INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE)
  }

  render () {
    return (
      <div style={style.container}>
        <div style={style.content}>
          <div>
            <div style={style.title}>
              <span>{'Crypto Wallets'}</span>
            </div>
            <div style={style.subText}>
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
