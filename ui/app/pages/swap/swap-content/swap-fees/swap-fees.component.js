import React, { Component } from 'react'
import PropTypes from 'prop-types'

import UserPreferencedCurrencyDisplay from '../../../../components/app/user-preferenced-currency-display'
import { PRIMARY } from '../../../../helpers/constants/common'
import { conversionUtil } from '../../../../helpers/utils/conversion-util'
import { AssetPropTypes } from '../../prop-types'
import CustomizeGasButton from '../swap-gas-customize'
import getConfig from '../../swap.config'

export default class SwapFees extends Component {
  static propTypes = {
    fromAsset: AssetPropTypes,
    toAsset: AssetPropTypes,
    estimatedGasCost: PropTypes.string,
    currentCurrency: PropTypes.string,
    conversionRate: PropTypes.number,
    refreshQuote: PropTypes.func.isRequired,
    amount: PropTypes.string,
    network: PropTypes.string.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
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
    const { fromAsset, toAsset, estimatedGasCost, refreshQuote, amount, network } = this.props
    const config = getConfig(network)

    return fromAsset && toAsset && estimatedGasCost ? (
      <div className="swap-v2__form-row-centered">
        <div className="fees">
          <table>
            <tbody>
              <tr>
                <td>Estimated network fee</td>
                <td>
                  <UserPreferencedCurrencyDisplay
                    value={estimatedGasCost}
                    type={PRIMARY}
                  />
                </td>
                <td>
                  {this.weiHexToFiat(estimatedGasCost)}
                </td>
              </tr>

              <tr>
                <td colSpan={3}>
                  <CustomizeGasButton />
                  <span
                    className="swap-v2__gas-control-btn"
                    onClick={() => refreshQuote(fromAsset, toAsset, amount, null)}
                  >Reset
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan="3">Quote includes a {config.buyTokenPercentageFee}% Brave fee</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ) : null
  }
}
