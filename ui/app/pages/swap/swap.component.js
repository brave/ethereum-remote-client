import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SwapHeader from './swap-header'
import SwapContent from './swap-content'
import SwapFooter from './swap-footer'

export default class SwapScreen extends Component {
  static propTypes = {
    history: PropTypes.object,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  renderSwapContent () {
    const { history } = this.props

    return [
      <SwapContent key="swap-content" />,
      <SwapFooter key="swap-footer" history={history} />,
    ]
  }

  render () {
    const { history } = this.props
    return (
      <div className="page-container">
        <SwapHeader history={history} />
        { this.renderSwapContent() }
      </div>
    )
  }
}
