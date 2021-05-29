import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PageContainerContent from '../../../components/ui/page-container/page-container-content.component'

import SwapAssetRow from './swap-asset-row'
import SwapQuote from './swap-quote'
import SwapFees from './swap-fees'
import { AssetPropTypes } from '../prop-types'
import { decimalToHex } from '../swap.utils'

// Refresh Swap quote every 40 seconds.
const countdownLimit = 40

export default class SwapContent extends Component {
  static propTypes = {
    fromAsset: AssetPropTypes,
    toAsset: AssetPropTypes,
    amount: PropTypes.string,
    fetchSwapQuote: PropTypes.func.isRequired,
    quoteGasPrice: PropTypes.string,
    globalGasPrice: PropTypes.string,
    customAllowance: PropTypes.string,
    setCustomAllowance: PropTypes.func.isRequired,
  }

  state = { seconds: countdownLimit }

  componentDidMount () {
    this.timer = null

    // Start countdown on component initialization.
    this.startTimer()
  }

  componentWillUnmount () {
    this.endTimer()
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate (prevProps, prevState, snapshot) {
    const { globalGasPrice: prevGlobalGasPrice } = prevProps
    const { globalGasPrice, fromAsset, toAsset, amount } = this.props

    if (prevGlobalGasPrice !== null && globalGasPrice === null) {
      const gasPrice = parseInt(prevGlobalGasPrice, 16).toString()
      this.refreshQuote(fromAsset, toAsset, amount, gasPrice, true)
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
    showLoading = true,
  ) => {
    const { fetchSwapQuote } = this.props
    this.endTimer()

    // Fetch live Swap quote if all inputs are valid.
    fromAsset &&
    toAsset &&
    amount !== '0' &&
    fetchSwapQuote(fromAsset, toAsset, amount, gasPrice && decimalToHex(gasPrice), showLoading)

    this.startTimer()
  }

  clock = () => {
    // Remove one second, set state so a re-render happens.
    const seconds = this.state.seconds - 1
    this.setState({ seconds })

    // Check if we're at zero.
    if (seconds < 0) {
      const { fromAsset, toAsset, amount, quoteGasPrice } = this.props
      this.refreshQuote(fromAsset, toAsset, amount, quoteGasPrice, false)
    }
  }

  render () {
    const { seconds } = this.state
    const { customAllowance, setCustomAllowance } = this.props

    return (
      <PageContainerContent>
        <div className="swap-v2__form">
          <SwapAssetRow
            refreshQuote={this.refreshQuote}
            customAllowance={customAllowance}
            setCustomAllowance={setCustomAllowance}
          />
          <SwapQuote seconds={seconds} />
          <SwapFees refreshQuote={this.refreshQuote} />
        </div>
      </PageContainerContent>
    )
  }
}
