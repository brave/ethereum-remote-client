import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerHeader from '../../../components/ui/page-container/page-container-header'

export default class SwapHeader extends Component {

  static propTypes = {
    titleKey: PropTypes.string,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  render () {
    return (
      <PageContainerHeader
        className="swap__header"
        title={this.context.t(this.props.titleKey)}
      />
    )
  }

}
