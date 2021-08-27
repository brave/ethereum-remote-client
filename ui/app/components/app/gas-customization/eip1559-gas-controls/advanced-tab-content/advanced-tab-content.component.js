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
    insufficientBalance: PropTypes.bool,
    isCustomMaxPriorityFeePerGasSafe: PropTypes.bool,
    isSpeedUp: PropTypes.bool,
  }

  render () {
    const {
      updateCustomMaxPriorityFeePerGas,
      updateCustomMaxFeePerGas,
      updateCustomGasLimit,
      customModalMaxPriorityFeePerGasInHex,
      customModalMaxFeePerGasInHex,
      customModalGasLimitInHex,
      insufficientBalance,
      isCustomMaxPriorityFeePerGasSafe,
      isSpeedUp,
    } = this.props

    return (
      <div className="advanced-tab">
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
