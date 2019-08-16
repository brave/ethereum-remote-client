import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import ProviderBuy from '../provider-buy'
import ProviderSell from '../provider-sell'
import TransactionView from '../../../../../../ui/app/components/app/transaction-view'


export default class BraveTransactionViewBalance extends PureComponent {
  static propTypes = {
    providerView: PropTypes.string,
    providerSetView: PropTypes.func.isRequired,
  }

  renderBuySell (view) {
    switch (view) {
      case 'buy':
        return <ProviderBuy />

      case 'sell':
        return <ProviderSell />
    }
  }

  render () {
    const {
      providerView,
      providerSetView,
      ...metamaskProps
    } = this.props

    if (!providerView) {
      return <TransactionView {...metamaskProps} />
    }

    return (
      <div className="transaction-view">
        <div className="provider-buy-sell">
          <span
            className={classnames({
              'provider-buy-sell__tab': true,
              'provider-buy-sell__tab-active': providerView === 'buy',
            })}
            onClick={() => providerSetView('buy')}
          >
            Buy
          </span>
          <span
            className={classnames({
              'provider-buy-sell__tab': true,
              'provider-buy-sell__tab-active': providerView === 'sell',
            })}
            onClick={() => providerSetView('sell')}
          >
            Sell
          </span>
          <div
            className="provider-buy-sell__close"
            onClick={() => providerSetView(null)}
          >
          </div>
          { this.renderBuySell(providerView) }
        </div>
      </div>
    )
  }
}
