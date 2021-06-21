import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SwapHeader from './swap-header'
import SwapContent from './swap-content'
import SwapFooter from './swap-footer'
import { decimalToHex } from './swap.utils'
import { AssetPropTypes } from './prop-types'

// Refresh Swap quote every 40 seconds.
const countdownLimit = 40

export default class SwapTransactionScreen extends Component {
  static propTypes = {
    history: PropTypes.object,
    resetSwapState: PropTypes.func.isRequired,
    fromAsset: AssetPropTypes,
    toAsset: AssetPropTypes,
    amount: PropTypes.string,
    fetchSwapQuote: PropTypes.func.isRequired,
    quoteGasPrice: PropTypes.string,
    globalGasPrice: PropTypes.string,
    slippage: PropTypes.number.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  state = {
    customAllowance: null,
    seconds: countdownLimit,
  }

  componentDidMount () {
    this.timer = null

    // Start countdown on component initialization.
    this.startTimer()
  }

  componentWillUnmount () {
    const { resetSwapState } = this.props
    resetSwapState()

    this.endTimer()
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate (prevProps, prevState, snapshot) {
    const { globalGasPrice: prevGlobalGasPrice } = prevProps
    const { globalGasPrice, fromAsset, toAsset, amount, slippage } = this.props

    if (prevGlobalGasPrice !== null && globalGasPrice === null) {
      const gasPrice = parseInt(prevGlobalGasPrice, 16).toString()
      this.refreshQuote(fromAsset, toAsset, amount, gasPrice, slippage, true)
    }
  }

  startTimer = () => {
    if (this.timer === null) {
      this.setState({ seconds: countdownLimit })
      this.timer = setInterval(this.clock, 1000)
    }
  }

  endTimer = () => {
    clearInterval(this.timer)
    this.timer = null
  }

  refreshQuote = (
    fromAsset,
    toAsset,
    amount = this.props.amount,
    gasPrice = this.props.quoteGasPrice,
    slippage = this.props.slippage,
    showLoading = true,
    full = false,
  ) => {
    const { fetchSwapQuote } = this.props
    this.endTimer()

    // Fetch live Swap quote if all inputs are valid.
    fromAsset &&
      toAsset &&
      amount !== '0' &&
      fetchSwapQuote(
        fromAsset,
        toAsset,
        amount,
        gasPrice && decimalToHex(gasPrice),
        slippage,
        showLoading,
        full,
      )

    this.startTimer()
  }

  clock = () => {
    // Remove one second, set state so a re-render happens.
    const seconds = this.state.seconds - 1
    this.setState({ seconds })

    // Check if we're at zero.
    if (seconds < 0) {
      const { fromAsset, toAsset, amount, quoteGasPrice, slippage } = this.props
      this.refreshQuote(fromAsset, toAsset, amount, quoteGasPrice, slippage, false)
    }
  }

  setCustomAllowance = (value) => {
    this.setState({ customAllowance: value })
  }

  render () {
    const { history, fromAsset, toAsset, amount, quoteGasPrice, slippage } = this.props
    const { customAllowance, seconds } = this.state

    return (
      <div className="page-container">
        <SwapHeader history={history} />
        <SwapContent
          customAllowance={customAllowance}
          setCustomAllowance={this.setCustomAllowance}
          seconds={seconds}
          refreshQuote={this.refreshQuote}
        />
        <SwapFooter
          history={history}
          customAllowance={customAllowance}
          refreshQuote={() =>
            this.refreshQuote(fromAsset, toAsset, amount, quoteGasPrice, slippage, false, true)
          }
        />
      </div>
    )
  }
}
