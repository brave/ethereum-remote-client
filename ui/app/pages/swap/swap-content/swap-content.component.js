import React, { Component } from 'react'

import PageContainerContent from '../../../components/ui/page-container/page-container-content.component'

import SwapAssetRow from './swap-asset-row'
import SwapQuote from './swap-quote'


export default class SwapContent extends Component {
  render () {
    return (
      <PageContainerContent>
        <div className="swap-v2__form">
          <SwapAssetRow />
          <SwapQuote />
        </div>
      </PageContainerContent>
    )
  }
}
