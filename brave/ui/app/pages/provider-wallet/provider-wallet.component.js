import React, { PureComponent } from 'react'

module.exports = class BraveProviderWallet extends PureComponent {

  render () {
    return (
      <div className="provider-wallet">
        <div className="__info-column">
          <div className="__account-balance">
            <div className="__account-info">
              <span className="__value">Total Value</span>
              <span className="__balance">$0.00</span>
            </div>
          </div>
          <div className="__asset-list">
            <div className="__asset active">
              <div className="__logo">
                <img src="https://cryptoicons.org/api/color/btc/50/fabb60" />
              </div>
              <span className="__ticker">{'0 BTC'}</span>
            </div>
            <div className="__asset">
              <div className="__logo">
                <img src="https://cryptoicons.org/api/color/xrp/50/000000" />
              </div>
              <span className="__ticker">{'0 XRP'}</span>
            </div>
          </div>
        </div>
        <div className="__activity-pane">
        </div>
      </div>
    )
  }
}
