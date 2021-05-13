import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import SwapRowWrapper from '../swap-row-wrapper'
import AmountMaxButton from './amount-max-button'
import UserPreferencedCurrencyInput from '../../../../components/app/user-preferenced-currency-input'
import UserPreferencedTokenInput from '../../../../components/app/user-preferenced-token-input'

export default class SwapAmountRow extends Component {

  static propTypes = {
    amount: PropTypes.string,
    balance: PropTypes.string,
    conversionRate: PropTypes.number,
    gasTotal: PropTypes.string,
    primaryCurrency: PropTypes.string,
    swapFromToken: PropTypes.object,
    setMaxModeTo: PropTypes.func,
    tokenFromBalance: PropTypes.string,
    tokenToBalance: PropTypes.string,
    updateGasFeeError: PropTypes.func,
    updateSwapAmount: PropTypes.func,
    updateSwapAmountError: PropTypes.func,
    updateGas: PropTypes.func,
    maxModeOn: PropTypes.bool,
  }

  static contextTypes = {
    t: PropTypes.func,
  }


  componentDidUpdate (prevProps) {
    const { maxModeOn: prevMaxModeOn, gasTotal: prevGasTotal } = prevProps
    const { maxModeOn, amount, gasTotal, swapFromToken } = this.props
    console.log(`The Amount in swap amount component is :  ${amount})`)

    if (maxModeOn && swapFromToken && !prevMaxModeOn) {
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
      swapFromToken,
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
      swapFromToken,
      tokenFromBalance,
      tokenToBalance,
    })

    if (swapFromToken) {
      updateGasFeeError({
        balance,
        conversionRate,
        gasTotal,
        primaryCurrency,
        swapFromToken,
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
    const { swapFromToken, updateGas } = this.props

    if (swapFromToken) {
      updateGas({ amount })
    }
  }

  handleChange = (newAmount) => {
    // this.validateAmount(newAmount)
    this.updateGas(newAmount)
    this.updateAmount(newAmount)
  }

  render () {
    const { amount, swapFromToken } = this.props

    return swapFromToken ?
      (
        <UserPreferencedTokenInput
          onChange={this.handleChange}
          token={swapFromToken}
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
