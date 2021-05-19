import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PageContainerContent from '../../../components/ui/page-container/page-container-content.component'

import SwapAssetRow from './swap-asset-row'
import SwapQuote from './swap-quote'
import SwapFees from './swap-fees'
import { AssetPropTypes } from '../prop-types'

// Refresh Swap quote every 40 seconds.
const countdownLimit = 40

export default class SwapContent extends Component {
  static propTypes = {
    fromAsset: AssetPropTypes,
    toAsset: AssetPropTypes,
    amount: PropTypes.string,
    fetchSwapQuote: PropTypes.func.isRequired,
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
    showLoading = true,
  ) => {
    const { fetchSwapQuote } = this.props
    this.endTimer()

    // Fetch live Swap quote if all inputs are valid.
    fromAsset &&
      toAsset &&
      amount !== '0' &&
      fetchSwapQuote(fromAsset, toAsset, amount, showLoading)

    this.startTimer()
  }

  clock = () => {
    // Remove one second, set state so a re-render happens.
    const seconds = this.state.seconds - 1
    this.setState({ seconds })

    // Check if we're at zero.
    if (seconds < 0) {
      const { fromAsset, toAsset, amount } = this.props
      this.refreshQuote(fromAsset, toAsset, amount, false)
    }
  }

  render () {
    const { seconds } = this.state

    return (
      <PageContainerContent>
        <div className="swap-v2__form">
          <SwapAssetRow refreshQuote={this.refreshQuote} />
          <SwapQuote seconds={seconds} />
          <SwapFees />
        </div>
      </PageContainerContent>
    )
  }
}
