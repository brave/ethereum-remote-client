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
    inError: PropTypes.bool,
    primaryCurrency: PropTypes.string,
    swapToken: PropTypes.object,
    setMaxModeTo: PropTypes.func,
    tokenBalance: PropTypes.string,
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
    const { maxModeOn, amount, gasTotal, swapToken } = this.props

    if (maxModeOn && swapToken && !prevMaxModeOn) {
      this.updateGas(amount)
    }

    if (prevGasTotal !== gasTotal) {
      this.validateAmount(amount)
    }
  }

  updateGas = debounce(this.updateGas.bind(this), 500)

  validateAmount (amount) {
    const {
      balance,
      conversionRate,
      gasTotal,
      primaryCurrency,
      swapToken,
      tokenBalance,
      updateGasFeeError,
      updateSwapAmountError,
    } = this.props

    updateSwapAmountError({
      amount,
      balance,
      conversionRate,
      gasTotal,
      primaryCurrency,
      swapToken,
      tokenBalance,
    })

    if (swapToken) {
      updateGasFeeError({
        balance,
        conversionRate,
        gasTotal,
        primaryCurrency,
        swapToken,
        tokenBalance,
      })
    }
  }

  updateAmount (amount) {
    const { updateSwapAmount, setMaxModeTo } = this.props

    setMaxModeTo(false)
    updateSwapAmount(amount)
  }

  updateGas (amount) {
    const { swapToken, updateGas } = this.props

    if (swapToken) {
      updateGas({ amount })
    }
  }

  handleChange = (newAmount) => {
    this.validateAmount(newAmount)
    this.updateGas(newAmount)
    this.updateAmount(newAmount)
  }

  renderInput () {
    const { amount, inError, swapToken } = this.props

    return swapToken ?
      (
        <UserPreferencedTokenInput
          error={inError}
          onChange={this.handleChange}
          token={swapToken}
          value={amount}
        />
      )
      : (
        <UserPreferencedCurrencyInput
          error={inError}
          onChange={this.handleChange}
          value={amount}
        />
      )
  }

  render () {
    const { gasTotal, inError } = this.props

    return (
      <SwapRowWrapper
        label={`${this.context.t('amount')}:`}
        showError={inError}
        errorType="amount"
      >
        {gasTotal && <AmountMaxButton inError={inError} />}
        { this.renderInput() }
      </SwapRowWrapper>
    )
  }

}
