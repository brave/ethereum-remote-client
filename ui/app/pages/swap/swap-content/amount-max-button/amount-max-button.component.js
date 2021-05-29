import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AssetPropTypes } from '../../prop-types'
import { calcMaxAmount } from './amount-max-button.utils'

export default class AmountMaxButton extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    fromAsset: AssetPropTypes,
    toAsset: AssetPropTypes,
    fromTokenAssetBalance: PropTypes.string,
    setAmount: PropTypes.func.isRequired,
    estimatedGasCost: PropTypes.string,
    refreshQuote: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  onMaxClick = () => {
    const {
      fromAsset,
      toAsset,
      refreshQuote,
      setAmount,
      fromTokenAssetBalance,
      account,
      estimatedGasCost,
    } = this.props
    const { metricsEvent } = this.context

    metricsEvent({
      eventOpts: {
        category: 'Swap',
        action: 'Edit Screen',
        name: 'Clicked "Max"',
      },
    })

    const balance = fromAsset?.address
      ? fromTokenAssetBalance
      : account.balance

    const maxAmount = calcMaxAmount({
      balance,
      estimatedGasCost,
      fromAsset,
    })

    setAmount(maxAmount)
    refreshQuote(fromAsset, toAsset, maxAmount)
  }

  render () {
    const { fromAsset } = this.props
    const { t } = this.context

    // Do not display the Max button for unselected state.
    return fromAsset ? (
      <span
        className="swap-v2__form-row-header-right"
        onClick={this.onMaxClick}
      >
        {t('max')}
      </span>
    ) : null
  }
}
