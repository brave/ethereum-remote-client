import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { decimalToHex } from '../../swap.utils'

export default class CustomizeGasButton extends Component {

  static propTypes = {
    showCustomizeGasModal: PropTypes.func,
    isMainnet: PropTypes.bool,
    quoteGasPrice: PropTypes.string,
    quoteGasLimit: PropTypes.string,
    setGlobalGasLimit: PropTypes.func.isRequired,
    setGlobalGasPrice: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  render () {
    const { metricsEvent, t } = this.context
    const {
      showCustomizeGasModal,
      isMainnet,
      quoteGasPrice,
      quoteGasLimit,
      setGlobalGasLimit,
      setGlobalGasPrice,
    } = this.props
    // Tests should behave in same way as mainnet, but are using Localhost
    if (!isMainnet && !process.env.IN_TEST) {
      return null
    }

    return (
      <span
        className="swap-v2__gas-control-btn"
        onClick={() => {
          metricsEvent({
            eventOpts: {
              category: 'Transactions',
              action: 'Edit Screen',
              name: 'Clicked "Advanced Options"',
            },
          })

          if (quoteGasLimit) {
            setGlobalGasLimit(decimalToHex(quoteGasLimit))
          }

          if (quoteGasPrice) {
            setGlobalGasPrice(decimalToHex(quoteGasPrice))
          }

          showCustomizeGasModal()
        }}
      >
        {t('customizeGas')}
      </span>
    )
  }
}
