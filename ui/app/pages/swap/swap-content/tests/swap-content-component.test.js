import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import SwapContent from '../swap-content.component.js'

import PageContainerContent from '../../../../components/ui/page-container/page-container-content.component'
import SwapFromAssetRow from '../swap-from-asset-row/swap-from-asset-row.container'

describe('SendContent Component', function () {
  let wrapper

  beforeEach(function () {
    wrapper = shallow(
      <SwapContent />,
      { context: { t: (str) => str + '_t' } },
    )
  })

  describe('render', function () {
    it('should render a PageContainerContent component', function () {
      assert.strictEqual(wrapper.find(PageContainerContent).length, 1)
    })

    it('should render a div with a .swap__form class as a child of PageContainerContent', function () {
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      PageContainerContentChild.is('div')
      PageContainerContentChild.is('.swap__form')
    })

    it('should render the correct row components as grandchildren of the PageContainerContent component', function () {
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      assert(PageContainerContentChild.childAt(0).is(SwapFromAssetRow), 'row[0] should be SwapFromAssetRow')
    })
  })
})
