import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SwapHeader from './swap-header'
import SwapContent from './swap-content'
import SwapFooter from './swap-footer'

export default class SwapTransactionScreen extends Component {

  static propTypes = {
    history: PropTypes.object,
    resetSwapState: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  componentWillUnmount () {
    const { resetSwapState } = this.props
    resetSwapState()
  }

  render () {
    const { history } = this.props

    return (
      <div className="page-container">
        <SwapHeader history={history} />
        <SwapContent />
        <SwapFooter history={history} />
      </div>
    )
  }
}
