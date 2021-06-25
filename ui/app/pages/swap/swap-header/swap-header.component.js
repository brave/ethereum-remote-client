import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerHeader from '../../../components/ui/page-container/page-container-header'

export default class SwapHeader extends Component {

  static propTypes = {
    clearSwap: PropTypes.func,
    history: PropTypes.object,
    mostRecentOverviewPage: PropTypes.string,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  onClose () {
    const { clearSwap, history, mostRecentOverviewPage } = this.props
    clearSwap()
    history.push(mostRecentOverviewPage)
  }

  render () {
    return (
      <PageContainerHeader
        className="swap__header"
        onClose={() => this.onClose()}
        title={this.context.t('swap')}
        headerCloseText={this.context.t('cancel')}
      />
    )
  }

}
