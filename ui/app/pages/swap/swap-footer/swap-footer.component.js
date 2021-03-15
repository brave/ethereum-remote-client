import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../../components/ui/page-container/page-container-footer'

export default class SwapFooter extends Component {

  static propTypes = {
    clearSwap: PropTypes.func,
    history: PropTypes.object,
    mostRecentOverviewPage: PropTypes.string.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  onCancel () {
    const { clearSwap, history, mostRecentOverviewPage } = this.props
    clearSwap()
    history.push(mostRecentOverviewPage)
  }

  render () {
    return (
      <PageContainerFooter
        onCancel={() => this.onCancel()}
      />
    )
  }
}
