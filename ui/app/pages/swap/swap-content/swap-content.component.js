import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PageContainerContent from '../../../components/ui/page-container/page-container-content.component'

import SwapAssetRow from './swap-asset-row'
import SwapQuote from './swap-quote'
import SwapFees from './swap-fees'


export default class SwapContent extends Component {
  static propTypes = {
    customAllowance: PropTypes.string,
    setCustomAllowance: PropTypes.func.isRequired,
    seconds: PropTypes.number.isRequired,
    refreshQuote: PropTypes.func.isRequired,
  }

  render () {
    const { customAllowance, setCustomAllowance, seconds, refreshQuote } = this.props

    return (
      <PageContainerContent>
        <div className="swap-v2__form">
          <SwapAssetRow
            refreshQuote={refreshQuote}
            customAllowance={customAllowance}
            setCustomAllowance={setCustomAllowance}
          />
          <SwapQuote seconds={seconds} />
          <SwapFees refreshQuote={refreshQuote} />
        </div>
      </PageContainerContent>
    )
  }
}
