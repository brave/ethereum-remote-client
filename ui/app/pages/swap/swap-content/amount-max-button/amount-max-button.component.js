import React from 'react'
import PropTypes from 'prop-types'
import { useI18nContext } from '../../../../hooks/useI18nContext'
import { useMetricEvent } from '../../../../hooks/useMetricEvent'
import { AssetPropTypes } from '../../prop-types'
import { calcMaxAmount } from './amount-max-button.utils'

export default function AmountMaxButton ({
  account,
  fromAsset,
  toAsset,
  fromTokenAssetBalance,
  estimatedGasCost,
  setAmount,
  refreshQuote,
}) {
  const t = useI18nContext()
  const metricsEvent = useMetricEvent()

  const balance = fromAsset?.address ? fromTokenAssetBalance : account.balance

  const onMaxClick = () => {
    metricsEvent({
      eventOpts: {
        category: 'Swap',
        action: 'Edit Screen',
        name: 'Clicked "Max"',
      },
    })

    const maxAmount = calcMaxAmount({
      balance,
      estimatedGasCost,
      fromAsset,
    })

    setAmount(maxAmount)
    refreshQuote(fromAsset, toAsset, maxAmount)
  }

  // Do not display the Max button for unselected state.
  return fromAsset ? (
    <span className="swap-v2__form-row-header-right" onClick={onMaxClick}>
      {t('max')}
    </span>
  ) : null
}

AmountMaxButton.propTypes = {
  account: PropTypes.object.isRequired,
  fromAsset: AssetPropTypes,
  toAsset: AssetPropTypes,
  fromTokenAssetBalance: PropTypes.string,
  setAmount: PropTypes.func.isRequired,
  estimatedGasCost: PropTypes.string,
  refreshQuote: PropTypes.func.isRequired,
}
