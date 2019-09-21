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
        className={'hw-connect__get-hw__msg'}
        dangerouslySetInnerHTML={{ __html: response }}
      />
    )
  }
}
