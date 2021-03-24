import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class AmountMaxButton extends Component {

  static propTypes = {
    balance: PropTypes.string,
    buttonDataLoading: PropTypes.bool,
    clearMaxAmount: PropTypes.func,
    inError: PropTypes.bool,
    gasTotal: PropTypes.string,
    maxModeOn: PropTypes.bool,
    swapToken: PropTypes.object,
    setAmountToMax: PropTypes.func,
    setMaxModeTo: PropTypes.func,
    tokenBalance: PropTypes.string,

  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  setMaxAmount () {
    const {
      balance,
      gasTotal,
      swapToken,
      setAmountToMax,
      tokenBalance,
    } = this.props

    setAmountToMax({
      balance,
      gasTotal,
      swapToken,
      tokenBalance,
    })
  }

  onMaxClick = () => {
    const { setMaxModeTo, clearMaxAmount, maxModeOn } = this.props
    const { metricsEvent } = this.context

    metricsEvent({
      eventOpts: {
        category: 'Transactions',
        action: 'Edit Screen',
        name: 'Clicked "Amount Max"',
      },
    })
    if (!maxModeOn) {
      setMaxModeTo(true)
      this.setMaxAmount()
    } else {
      setMaxModeTo(false)
      clearMaxAmount()
    }
  }

  render () {
    const { maxModeOn, buttonDataLoading, inError } = this.props

    return (
      <div className="swap-v2__amount-max" onClick={buttonDataLoading || inError ? null : this.onMaxClick}>
        <input type="checkbox" checked={maxModeOn} readOnly />
        <div className={classnames('swap-v2__amount-max__button', { 'swap-v2__amount-max__button__disabled': buttonDataLoading || inError })}>
          {this.context.t('max')}
        </div>
      </div>
    )
  }
}
