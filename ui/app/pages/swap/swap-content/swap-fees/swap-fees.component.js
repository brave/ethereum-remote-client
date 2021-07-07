import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip as ReactTippy } from 'react-tippy'

import UserPreferencedCurrencyDisplay from '../../../../components/app/user-preferenced-currency-display'
import { PRIMARY } from '../../../../helpers/constants/common'
import { conversionUtil } from '../../../../helpers/utils/conversion-util'
import { AssetPropTypes } from '../../prop-types'
import CustomizeGasButton from '../swap-gas-customize'
import getConfig from '../../swap.config'

const slippageOptions = [2, 3, 4]

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
    quoteGasPrice: PropTypes.string,
    setSlippage: PropTypes.func.isRequired,
    slippage: PropTypes.number.isRequired,
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

  getSlippageTooltip () {
    const { t } = this.context

    return (
      <ReactTippy
        style={{
          paddingLeft: '5px',
        }}
        html={(
          <p
            style={{
              textAlign: 'left',
              width: '200px',
              fontSize: 'small',
            }}
          >
            { t('swapSlippageDescription') }
          </p>
        )}
        distance={26}
        animation="none"
        position="top"
        arrow
      >
        <i className="fas fa-info-circle" />
      </ReactTippy>
    )
  }

  render () {
    const { t } = this.context

    const {
      fromAsset,
      toAsset,
      estimatedGasCost,
      refreshQuote,
      amount,
      network,
      quoteGasPrice,
      slippage,
      setSlippage,
    } = this.props
    const config = getConfig(network)

    return fromAsset && toAsset && estimatedGasCost ? (
      <div className="swap-v2__form-row-centered">
        <div className="fees">
          <table>
            <tbody>
              <tr>
                <td>
                  {t('slippage')} {this.getSlippageTooltip()}
                </td>
                <td colSpan={2}>
                  {slippageOptions.map((value, index) => (
                    <button
                      key={index}
                      className={`button btn-${
                        value === slippage ? 'primary' : 'secondary'
                      } btn--rounded eth-overview__button`}
                      onClick={() => {
                        setSlippage(value)
                        refreshQuote(fromAsset, toAsset, amount, quoteGasPrice, value)
                      }}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 'normal',
                        width: '40px',
                        height: '0px',
                        padding: '10px',
                        display: 'inline-flex',
                      }}
                    >
                      {value}%
                    </button>
                  ))}
                </td>
              </tr>
              <tr>
                <td>{t('estimatedNetworkFee')}</td>
                <td>
                  <UserPreferencedCurrencyDisplay value={estimatedGasCost} type={PRIMARY} />
                </td>
                <td>{this.weiHexToFiat(estimatedGasCost)}</td>
              </tr>

              <tr>
                <td colSpan={3}>
                  <CustomizeGasButton />
                  <span
                    className="swap-v2__gas-control-btn"
                    onClick={() => refreshQuote(fromAsset, toAsset, amount, null)}
                  >
                    {t('reset')}
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  { t('swapBraveFees', [`${(config.buyTokenPercentageFee * 100).toFixed(3)}%`]) }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ) : null
  }
}
