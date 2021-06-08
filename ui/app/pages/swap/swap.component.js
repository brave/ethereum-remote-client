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

  state = {
    customAllowance: null,
  }

  componentWillUnmount () {
    const { resetSwapState } = this.props
    resetSwapState()
  }

  setCustomAllowance = (value) => {
    this.setState({ customAllowance: value })
  }

  render () {
    const { history } = this.props
    const { customAllowance } = this.state

    return (
      <div className="page-container">
        <SwapHeader history={history}/>
        <SwapContent
          customAllowance={customAllowance}
          setCustomAllowance={this.setCustomAllowance}
        />
        <SwapFooter history={history} customAllowance={customAllowance}/>
      </div>
    )
  }
}
