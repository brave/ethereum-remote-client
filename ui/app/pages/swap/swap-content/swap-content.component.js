import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerContent from '../../../components/ui/page-container/page-container-content.component'
import SwapFromAssetRow from './swap-from-asset-row'

export default class SwapContent extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  render () {
    return (
      <PageContainerContent>
        <div className="swap__form">
          <SwapFromAssetRow />
        </div>
      </PageContainerContent>
    )
  }
}
