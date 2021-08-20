import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AdvancedGasInputs from '../advanced-gas-inputs'

export default class AdvancedTabContent extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    updateCustomMaxPriorityFeePerGas: PropTypes.func,
    updateCustomMaxFeePerGas: PropTypes.func,
    updateCustomGasLimit: PropTypes.func,
    customModalMaxPriorityFeePerGasInHex: PropTypes.string,
    customModalMaxFeePerGasInHex: PropTypes.string,
    customModalGasLimitInHex: PropTypes.string,
    maxPriorityFeePerGas: PropTypes.string,
    timeRemaining: PropTypes.string,
    insufficientBalance: PropTypes.bool,
    isCustomMaxPriorityFeePerGasSafe: PropTypes.bool,
    isSpeedUp: PropTypes.bool,
  }

  renderDataSummary (priorityFee, timeRemaining) {
    const { t } = this.context

    return (
      <div className="advanced-tab__transaction-data-summary">
        <div className="advanced-tab__transaction-data-summary__titles">
          <span>{ t('newTransactionFee') }</span>
          <span>~{ t('transactionTime') }</span>
        </div>
        <div className="advanced-tab__transaction-data-summary__container">
          <div className="advanced-tab__transaction-data-summary__fee">
            {priorityFee}
          </div>
          <div className="advanced-tab__transaction-data-summary__time-remaining">{timeRemaining}</div>
        </div>
      </div>
    )
  }

  render () {
    const {
      updateCustomMaxPriorityFeePerGas,
      updateCustomMaxFeePerGas,
      updateCustomGasLimit,
      timeRemaining,
      customModalMaxPriorityFeePerGasInHex,
      customModalMaxFeePerGasInHex,
      customModalGasLimitInHex,
      insufficientBalance,
      isCustomMaxPriorityFeePerGasSafe,
      isSpeedUp,
      maxPriorityFeePerGas,
    } = this.props

    return (
      <div className="advanced-tab">
        { this.renderDataSummary(maxPriorityFeePerGas, timeRemaining) }
        <div className="advanced-tab__fee-chart">
          <div className="advanced-tab__gas-inputs-v2">
            <AdvancedGasInputs
              updateCustomMaxPriorityFeePerGas={updateCustomMaxPriorityFeePerGas}
              updateCustomMaxFeePerGas={updateCustomMaxFeePerGas}
              updateCustomGasLimit={updateCustomGasLimit}
              customMaxPriorityFeePerGas={customModalMaxPriorityFeePerGasInHex}
              customMaxFeePerGas={customModalMaxFeePerGasInHex}
              customGasLimit={customModalGasLimitInHex}
              insufficientBalance={insufficientBalance}
              isCustomMaxPriorityFeePerGasSafe={isCustomMaxPriorityFeePerGasSafe}
              isSpeedUp={isSpeedUp}
            />
          </div>
        </div>
      </div>
    )
  }
}
