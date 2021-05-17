import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'

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
    setMaxModeTo: PropTypes.func,
    tokenFromBalance: PropTypes.string,
    tokenToBalance: PropTypes.string,
    updateGasFeeError: PropTypes.func,
    updateSwapAmount: PropTypes.func,
    updateSwapAmountError: PropTypes.func,
    updateGas: PropTypes.func,
    maxModeOn: PropTypes.bool,
    refreshQuote: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
  }


  componentDidUpdate (prevProps) {
    const { maxModeOn: prevMaxModeOn, gasTotal: prevGasTotal } = prevProps
    const { maxModeOn, amount, gasTotal, fromAsset } = this.props

    if (maxModeOn && fromAsset && !prevMaxModeOn) {
      this.updateGas(amount)
    }

    // if (prevGasTotal !== gasTotal) {
    //   this.validateAmount(amount)
    // }
  }

  updateGas = debounce(this.updateGas.bind(this), 500)

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
    const { updateSwapAmount, setMaxModeTo } = this.props

    setMaxModeTo(false)
    updateSwapAmount(amount)
  }

  updateGas (amount) {
    const { fromAsset, updateGas } = this.props

    if (fromAsset) {
      updateGas({ amount })
    }
  }

  handleChange = (newAmount) => {
    const { fromAsset, toAsset, refreshQuote } = this.props

    /**
     * TODO: enable amount validation.
     * this.validateAmount(newAmount)
     **/
    this.updateGas(newAmount)
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
