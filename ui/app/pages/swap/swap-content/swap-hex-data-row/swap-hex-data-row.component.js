import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SwapRowWrapper from '../swap-row-wrapper'

export default class SwapHexDataRow extends Component {
  static propTypes = {
    inError: PropTypes.bool,
    updateSwapHexData: PropTypes.func.isRequired,
    updateGas: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  onInput = (event) => {
    const { updateSwapHexData, updateGas } = this.props
    const data = event.target.value.replace(/\n/g, '') || null
    updateSwapHexData(data)
    updateGas({ data })
  }

  render () {
    const { inError } = this.props
    const { t } = this.context

    return (
      <SwapRowWrapper
        label={`${t('hexData')}:`}
        showError={inError}
        errorType="amount"
      >
        <textarea
          onInput={this.onInput}
          placeholder="Optional"
          className="swap-v2__hex-data__input"
        />
      </SwapRowWrapper>
    )
  }
}
