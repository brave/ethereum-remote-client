import React from 'react'
const AffiliateLinks = require('../../../helpers/constants/affliliate-links')
const ConnectScreen = require('../../../../../../ui/app/pages/create-account/connect-hardware/connect-screen')

module.exports = class BraveConnectScreen extends ConnectScreen {

  getAffiliateLinks () {
    const links = {
      trezor: `<a class='hw-connect__get-hw__link' href='${AffiliateLinks.trezor}' target='_blank'>Trezor</a>`,
      ledger: `<a class='hw-connect__get-hw__link' href='${AffiliateLinks.ledger}' target='_blank'>Ledger</a>`,
    }
    const response = this.context.t('orderOneHere')
      .replace('Trezor', links.trezor)
      .replace('Ledger', links.ledger)

    return (
      <div
        className="hw-connect__get-hw__msg"
        dangerouslySetInnerHTML={{ __html: response }}
      />
    )
  }

  renderFooter () {
    return (
      <div className="hw-connect__footer">
        <h3 className="hw-connect__footer__title">{this.context.t('readyToConnect')}</h3>
        {this.renderButtons()}
        <p className="hw-connect__footer__msg">
          {this.context.t('havingTroubleConnecting')}
          <a className="hw-connect__footer__link" href="https://support.brave.com/hc/en-us/articles/360034535452-How-can-I-add-my-other-Crypto-Wallets-to-Brave-" target="_blank" rel="noopener noreferrer">
            {this.context.t('getHelp')}
          </a>
        </p>
      </div>
    )
  }
}
