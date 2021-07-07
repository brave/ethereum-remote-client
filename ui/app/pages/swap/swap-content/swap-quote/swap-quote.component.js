import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip as ReactTippy } from 'react-tippy'

import { AssetPropTypes, QuotePropTypes } from '../../prop-types'

export default class SwapQuote extends Component {
  static propTypes = {
    fromAsset: AssetPropTypes,
    toAsset: AssetPropTypes,
    quote: QuotePropTypes,
    seconds: PropTypes.number.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  getTooltip () {
    const { t } = this.context

    return (
      <ReactTippy
        style={{
          paddingLeft: '5px',
        }}
        html={(
          <p
            style={{
              textAlign: 'left',
              width: '200px',
              fontSize: 'small',
            }}
          >
            { t('swapQuoteRefresh') }
          </p>
        )}
        distance={26}
        animation="none"
        position="top"
        arrow
      >
        <i className="fas fa-info-circle" />
      </ReactTippy>
    )
  }

  render () {
    const { fromAsset, toAsset, quote, seconds } = this.props
    const displayQuote = fromAsset && toAsset && quote

    return displayQuote ? (
      <>
        <div className="swap-v2__form-row-centered">
          <div className="rate">
            {`1 ${fromAsset.symbol} = ${parseFloat(quote.price).toFixed(4)} ${
              toAsset.symbol
            }`}
          </div>
        </div>
        <div className="swap-v2__form-row-centered">
          <div className="quote">
              New quote in{' '}
            <span
              className="countdown"
              style={{ color: seconds < 20 ? '#d73a49' : undefined }}
            >
                0:{seconds.toString().padStart(2, '0')}
            </span>
            {this.getTooltip()}
          </div>
        </div>
      </>
    ) : null
  }
}
