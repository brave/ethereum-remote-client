import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Tooltip as ReactTippy } from 'react-tippy'

const countdownLimit = 40

export default class SwapQuotes extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {}

  constructor () {
    super()
    this.state = { seconds: countdownLimit }
    this.timer = null
    this.startTimer = this.startTimer.bind(this)
    this.closeTimer = this.endTimer.bind(this)
    this.clock = this.clock.bind(this)

    // Start countdown on component initialization.
    this.startTimer()
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

  clock (hook) {
    // Remove one second, set state so a re-render happens.
    const seconds = this.state.seconds - 1
    this.setState({ seconds })

    // Check if we're at zero.
    if (seconds < 0) {
      this.endTimer()

      // Call hook if provided
      hook && hook()

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
    return (
      <>
        <div className="swap-v2__form-row-centered">
          <div className="rate">1 ETH = 10000 USD</div>
        </div>
        <div className="swap-v2__form-row-centered">
          <div className="quote">
            New quote in{' '}
            <span
              className="countdown"
              style={{ color: this.state.seconds < 30 ? '#d73a49' : undefined }}
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
