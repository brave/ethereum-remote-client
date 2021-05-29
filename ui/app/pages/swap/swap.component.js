import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SwapHeader from './swap-header'
import SwapContent from './swap-content'
import SwapFooter from './swap-footer'
import { CONFIRM_TRANSACTION_ROUTE } from '../../helpers/constants/routes'

export default class SwapTransactionScreen extends Component {
  static propTypes = {
    history: PropTypes.object,
    unapprovedTxs: PropTypes.object.isRequired,
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

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate (prevProps, prevState, snapshot) {
    const { unapprovedTxs, history } = this.props
    const { unapprovedTxs: prevUnapprovedTxs } = prevProps

    Object.keys(unapprovedTxs).forEach(
      (id) =>
        prevUnapprovedTxs[id] === undefined &&
        history.push(`${CONFIRM_TRANSACTION_ROUTE}/${id}`),
    )
  }

  setCustomAllowance = (value) => {
    this.setState({ customAllowance: value })
  }

  render () {
    const { history } = this.props
    const { customAllowance } = this.state

    return (
      <div className="page-container">
        <SwapHeader history={history} />
        <SwapContent
          customAllowance={customAllowance}
          setCustomAllowance={this.setCustomAllowance}
        />
        <SwapFooter history={history} customAllowance={customAllowance} />
      </div>
    )
  }
}
