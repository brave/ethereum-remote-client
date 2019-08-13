import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import CurrencyInput from '../../ui/currency-input'

export default class CoinbaseAmount extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['buy', 'sell']).isRequired,
    currency: PropTypes.string.isRequired,
    exchangeRate: PropTypes.number.isRequired,
  }

  render () {
    const { type, currency, exchangeRate } = this.props

    return (
      <div>
        <div className="coinbase-amount__label">Amount</div>
        <CurrencyInput
          onChange={() => null}
          exchangeRate={exchangeRate}
          leftExtra={{
            button: type === 'buy',
            text: type === 'buy' ? 'Buy Max' : 'USD',
          }}
          rightExtra={{
            button: false,
            text: currency,
          }}
        />
      </div>
    )
  }
}
