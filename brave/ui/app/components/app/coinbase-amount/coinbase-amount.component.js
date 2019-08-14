import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import CurrencyInput from '../../ui/currency-input'

export default class CoinbaseAmount extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['buy', 'sell']).isRequired,
    currency: PropTypes.string.isRequired,
    exchangeRate: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
    }).isRequired,
    limit: PropTypes.shape({
      label: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      used: PropTypes.number.isRequired,
    }),
    onChange: PropTypes.func,
  }

  state = {
    fiat: 0,
  }

  onChange (values) {
    const { limit, onChange } = this.props
    onChange && onChange({
      fiat: values.left,
      crypto: values.right,
    })
    this.setState({
      fiat: values.left,
    })
    if (!limit) {
      return {}
    }
    return {
      left: (limit.amount - limit.used - values.left) >= 0,
    }
  }

  render () {
    const {
      type,
      currency,
      exchangeRate,
      limit,
    } = this.props
    const { fiat } = this.state

    const fractionUsed = limit && Math.min((limit.used + fiat) / limit.amount, 1)
    // fractionUsed = 0 is width: 6px, fractionUsed = 1 is width: 100%
    const fractionWidthCss = `calc(6px + ${fractionUsed} * (100% - 6px))`

    const remaining = limit && (limit.amount - limit.used - fiat)
    const remainingString = remaining && new Intl.NumberFormat(
      window.navigator.language,
      {
        style: 'currency',
        currency: exchangeRate.currency,
      }).format(remaining)

    return (
      <div>
        <div className="coinbase-amount__label">Amount</div>
        {
          limit
            ? <div className="coinbase-amount__remaining">
              <div>
                { limit.label }
              </div>
              <div>
                { `${remainingString} remaining. `}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://coinbase.com.something"
                >
                  View Limits
                </a>
              </div>
            </div>
            : null
        }
        {
          limit
            ? <div className="coinbase-amount__bar">
              {
                fractionUsed !== 0
                  ? <div
                    className="coinbase-amount__bar__used"
                    style={{width: fractionWidthCss}}
                  ></div>
                  : null
              }
            </div>
            : null
        }
        <CurrencyInput
          onChange={values => this.onChange(values)}
          exchangeRate={exchangeRate.amount}
          leftExtra={{
            button: type === 'buy',
            text: type === 'buy' ? 'Buy Max' : exchangeRate.currency,
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
