import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from '../../../../components/ui/text-field'
import Dropdown from '../../../../components/ui/dropdown'

export default class SwapFromAssetRow extends Component {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  handleInputChange () {

  }

  getSwappableAssets () {
    return [
      { value: 'BAT' },
      { value: 'BTC' },
      { value: 'ETH' },
      { value: 'ONE' },
      { value: 'ADA' },
      { value: 'BNB' },
      { value: 'USDT' },
      { value: 'DOGE' },
      { value: 'LTC' },
      { value: 'XLM' },
      { value: 'RVN' },
      { value: 'BCH' },
      { value: 'EOS' },
      { value: 'ETC' },
      { value: 'DASH' },
      { value: 'ZRX' },
      { value: 'MANA' },
      { value: 'VET' },
      { value: 'VTHO' },
      { value: 'UNI' },
    ]
  }

  render () {
    const { t } = this.context

    return (
      <div className="swap__asset-dropdown">
        <TextField
          id="swap-amount"
          label={t('fromAmount')}
          type="number"
          onChange={(event) => this.handleInputChange(event)}
          autoFocus
          theme="material"
          fullWidth
        />
        <div className="swap__asset-dropdown-section">
          <div className="swap__asset-dropdown-from">
            <Dropdown
              onChange={() => {}}
              options={this.getSwappableAssets()}
              selectedOption="ETH"
            />
          </div>
          <div className="swap__asset-dropdown-text-to">
            { t('to') }
          </div>
          <div className="swap__asset-dropdown-to">
            <Dropdown
              onChange={() => {}}
              options={this.getSwappableAssets()}
              selectedOption="BAT"
            />
          </div>
        </div>
      </div>
    )
  }
}
