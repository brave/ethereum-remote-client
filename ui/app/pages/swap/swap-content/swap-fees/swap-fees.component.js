import React, { Component } from 'react'
import PropTypes from 'prop-types'

import UserPreferencedCurrencyDisplay from '../../../../components/app/user-preferenced-currency-display'
import { PRIMARY } from '../../../../helpers/constants/common'
import { conversionUtil } from '../../../../helpers/utils/conversion-util'


export default class SwapFees extends Component {
  static propTypes = {
    gasLimit: PropTypes.string,
    estimatedGasPrice: PropTypes.string,
    currentCurrency: PropTypes.string,
    conversionRate: PropTypes.number,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  getEstimatedGasCost () {
    const { gasLimit, estimatedGasPrice } = this.props

    if (!gasLimit || !estimatedGasPrice) {
      return
    }

    const gasCost = parseInt(gasLimit) * parseInt(estimatedGasPrice)
    return gasCost.toString(16)
  }

  weiHexToFiat (value) {
    const { currentCurrency, conversionRate } = this.props

    const fiatValue = conversionUtil(value, {
      fromNumericBase: 'hex',
      toNumericBase: 'dec',
      fromDenomination: 'WEI',
      toCurrency: currentCurrency,
      conversionRate,
      numberOfDecimals: 2,
    })
    return `${fiatValue} ${currentCurrency.toUpperCase()}`
  }

  render () {
    const estimatedGasCost = this.getEstimatedGasCost()

    return (
      <div className="swap-v2__form-row-centered">
        <div className="fees">
          <table>
            <tbody>
              <tr>
                <td>Estimated network fee</td>
                <td>
                  {estimatedGasCost && (
                    <UserPreferencedCurrencyDisplay
                      value={estimatedGasCost}
                      type={PRIMARY}
                    />
                  )}
                </td>
                <td>
                  {estimatedGasCost && this.weiHexToFiat(estimatedGasCost)}
                </td>
              </tr>

              <tr>
                <td>Max network fee</td>
                <td>-</td>
                <td>-</td>
              </tr>
              <tr>
                <td colSpan="3">Quote includes a 1% Brave fee</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
