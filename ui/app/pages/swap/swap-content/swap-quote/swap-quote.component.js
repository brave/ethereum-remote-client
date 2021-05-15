import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip as ReactTippy } from 'react-tippy'

import { AssetPropTypes, QuotePropTypes } from '../../prop-types'

// Refresh Swap quote every 40 seconds.
const countdownLimit = 40

export default class SwapQuote extends Component {
  static propTypes = {
    fromAsset: AssetPropTypes,
    toAsset: AssetPropTypes,
    amount: PropTypes.string,
    quote: QuotePropTypes,
    fetchSwapQuote: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  state = { seconds: countdownLimit }

  componentDidMount () {
    this.timer = null
    this.startTimer = this.startTimer.bind(this)
    this.closeTimer = this.endTimer.bind(this)
    this.clock = this.clock.bind(this)

    // Start countdown on component initialization.
    this.startTimer()
  }

  componentWillUnmount () {
    this.endTimer()
  }

  startTimer () {
    if (this.timer === null) {
      this.setState({ seconds: countdownLimit })
      this.timer = setInterval(this.clock, 1000)
    }
  }

  endTimer () {
    clearInterval(this.timer)
    this.timer = null
  }

  shouldFetchQuote () {
    const { fromAsset, toAsset, amount } = this.props

    return fromAsset && toAsset && amount !== '0'
  }

  hook () {
    const { fromAsset, toAsset, amount, fetchSwapQuote } = this.props

    this.shouldFetchQuote() && fetchSwapQuote(fromAsset, toAsset, amount)
  }

  clock () {
    // Remove one second, set state so a re-render happens.
    const seconds = this.state.seconds - 1
    this.setState({ seconds })

    // Check if we're at zero.
    if (seconds < 0) {
      this.endTimer()
      this.hook()
      this.startTimer()
    }
  }

  getTooltip () {
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
            Quotes are refreshed often to reflect current market conditions.
          </p>
        )}
        distance={26}
        animation="none"
        position="top"
        arrow
      >
        <i className="fas fa-info-circle"></i>
      </ReactTippy>
    )
  }

  render () {
    const { fromAsset, toAsset, quote } = this.props

    return fromAsset && toAsset && quote && (
      <>
        <div className="swap-v2__form-row-centered">
          <div className="rate">
            {`1 ${fromAsset.symbol} = ${parseFloat(quote.price).toFixed(4)} ${toAsset.symbol}`}
          </div>
        </div>
        <div className="swap-v2__form-row-centered">
          <div className="quote">
            New quote in{' '}
            <span
              className="countdown"
              style={{ color: this.state.seconds < 20 ? '#d73a49' : undefined }}
            >
              0:{this.state.seconds.toString().padStart(2, '0')}
            </span>
            {this.getTooltip()}
          </div>
        </div>
      </>
    )
  }
}
