import React from 'react'
import PropTypes from 'prop-types'
import { useI18nContext } from '../../../../hooks/useI18nContext'
import { useMetricEvent } from '../../../../hooks/useMetricEvent'
import { AssetPropTypes } from '../../prop-types'

export default function AmountMaxButton ({
  account,
  fromAsset,
  fromTokenAssetBalance,
  estimatedGasCost,
  setAmountToMax,
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

    setAmountToMax({
      balance,
      estimatedGasCost,
      fromAsset,
    })
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
  fromTokenAssetBalance: PropTypes.string,
  setAmountToMax: PropTypes.func.isRequired,
  estimatedGasCost: PropTypes.string,
}
