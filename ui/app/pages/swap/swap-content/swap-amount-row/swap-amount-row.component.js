import React, { Component } from 'react'
import PropTypes from 'prop-types'

import UserPreferencedCurrencyInput from '../../../../components/app/user-preferenced-currency-input'
import UserPreferencedTokenInput from '../../../../components/app/user-preferenced-token-input'
import { AssetPropTypes } from '../../prop-types'

export default class SwapAmountRow extends Component {

  static propTypes = {
    amount: PropTypes.string,
    balance: PropTypes.string,
    conversionRate: PropTypes.number,
    gasTotal: PropTypes.string,
    primaryCurrency: PropTypes.string,
    fromAsset: AssetPropTypes,
    toAsset: AssetPropTypes,
    tokenFromBalance: PropTypes.string,
    tokenToBalance: PropTypes.string,
    updateGasFeeError: PropTypes.func,
    updateSwapAmount: PropTypes.func,
    updateSwapAmountError: PropTypes.func,
    refreshQuote: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
  }


  componentDidUpdate (prevProps) {
    // if (prevGasTotal !== gasTotal) {
    //   this.validateAmount(amount)
    // }
  }

  validateAmount (amount) {
    const {
      balance,
      conversionRate,
      gasTotal,
      primaryCurrency,
      fromAsset,
      tokenToBalance,
      tokenFromBalance,
      updateGasFeeError,
      updateSwapAmountError,
    } = this.props

    updateSwapAmountError({
      amount,
      balance,
      conversionRate,
      gasTotal,
      primaryCurrency,
      fromAsset,
      tokenFromBalance,
      tokenToBalance,
    })

    if (fromAsset) {
      updateGasFeeError({
        balance,
        conversionRate,
        gasTotal,
        primaryCurrency,
        fromAsset,
        tokenFromBalance,
        tokenToBalance,
      })
    }
  }

  updateAmount (amount) {
    const { updateSwapAmount } = this.props
    updateSwapAmount(amount)
  }

  handleChange = (newAmount) => {
    const { fromAsset, toAsset, refreshQuote } = this.props

    /**
     * TODO: enable amount validation.
     * this.validateAmount(newAmount)
     **/
    this.updateAmount(newAmount)
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
