import React, { Component } from 'react'
import PropTypes from 'prop-types'

import UserPreferencedCurrencyInput from '../../../../components/app/user-preferenced-currency-input'
import UserPreferencedTokenInput from '../../../../components/app/user-preferenced-token-input'
import { AssetPropTypes } from '../../prop-types'

export default class SwapAmountRow extends Component {

  static propTypes = {
    amount: PropTypes.string,
    estimatedGasCost: PropTypes.string,
    fromAsset: AssetPropTypes,
    toAsset: AssetPropTypes,
    updateSwapAmount: PropTypes.func,
    refreshQuote: PropTypes.func.isRequired,
    computeSwapErrors: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
  }


  // eslint-disable-next-line no-unused-vars
  componentDidUpdate (prevProps, prevState, snapshot) {
    const { estimatedGasCost: prevEstimatedGasCost, amount: prevAmount } = prevProps
    const { estimatedGasCost, amount, computeSwapErrors } = this.props

    if (prevEstimatedGasCost !== estimatedGasCost) {
      computeSwapErrors({ estimatedGasCost })
    }

    if (prevAmount !== amount) {
      computeSwapErrors({ amount })
    }
  }

  handleChange = (newAmount) => {
    const { fromAsset, toAsset, refreshQuote, updateSwapAmount, computeSwapErrors } = this.props

    computeSwapErrors({ amount: newAmount })
    updateSwapAmount(newAmount)
    refreshQuote(fromAsset, toAsset, newAmount)
  }

  render () {
    const { amount, fromAsset } = this.props

    // Handle case when the From asset field is unselected.
    if (!fromAsset) {
      return null
    }

    return fromAsset.address ?
      (
        <UserPreferencedTokenInput
          onChange={this.handleChange}
          token={fromAsset}
          value={amount}
        />
      )
      : (
        <UserPreferencedCurrencyInput
          onChange={this.handleChange}
          value={amount}
        />
      )
  }
}
