import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import CoinbaseBuy from '../coinbase-buy'
import CoinbaseSell from '../coinbase-sell'
import TransactionView from '../../../../../../ui/app/components/app/transaction-view'


export default class BraveTransactionViewBalance extends PureComponent {
  static propTypes = {
    coinbaseView: PropTypes.string,
    coinbaseSetView: PropTypes.func.isRequired,
  }

  renderBuySell (view) {
    switch (view) {
      case 'buy':
        return <CoinbaseBuy />

      case 'sell':
        return <CoinbaseSell />
    }
  }

  render () {
    const {
      coinbaseView,
      coinbaseSetView,
      ...metamaskProps
    } = this.props

    if (!coinbaseView) {
      return <TransactionView {...metamaskProps} />
    }

    return (
      <div className="transaction-view">
        <div className="coinbase-buy-sell">
          <span
            className={classnames({
                'coinbase-buy-sell__tab': true,
                'coinbase-buy-sell__tab-active': coinbaseView === 'buy',
            })}
            onClick={() => coinbaseSetView('buy')}
          >
            Buy
          </span>
          <span
            className={classnames({
                'coinbase-buy-sell__tab': true,
                'coinbase-buy-sell__tab-active': coinbaseView === 'sell',
            })}
            onClick={() => coinbaseSetView('sell')}
          >
            Sell
          </span>
          <div
            className="coinbase-buy-sell__close"
            onClick={() => coinbaseSetView(null)}
          >
          </div>
          { this.renderBuySell(coinbaseView) }
        </div>
      </div>
    )
  }
}
