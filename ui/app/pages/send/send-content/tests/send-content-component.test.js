import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import SendContent from '../send-content.component.js'

import PageContainerContent from '../../../../components/ui/page-container/page-container-content.component'
import SendAmountRow from '../send-amount-row/send-amount-row.container'
import SendFromRow from '../send-from-row/send-from-row.container'
import SendGasRow from '../send-gas-row/send-gas-row.container'
import SendToRow from '../send-to-row/send-to-row.container'
import SendHexDataRow from '../send-hex-data-row/send-hex-data-row.container'
import SendAssetRow from '../send-asset-row/send-asset-row.container'

describe('SendContent Component', function () {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SendContent showHexData={true} />)
  })

  describe('render', () => {
    it('should render a PageContainerContent component', () => {
      assert.equal(wrapper.find(PageContainerContent).length, 1)
    })

    it('should render a div with a .send-v2__form class as a child of PageContainerContent', () => {
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      PageContainerContentChild.is('div')
      PageContainerContentChild.is('.send-v2__form')
    })

    it('should render the correct row components as grandchildren of the PageContainerContent component', () => {
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      assert(PageContainerContentChild.childAt(0).is(SendFromRow))
      assert(PageContainerContentChild.childAt(1).is(SendToRow))
      assert(PageContainerContentChild.childAt(2).is(SendAssetRow))
      assert(PageContainerContentChild.childAt(3).is(SendAmountRow))
      assert(PageContainerContentChild.childAt(4).is(SendGasRow))
      assert(PageContainerContentChild.childAt(5).is(SendHexDataRow))
    })

    it('should not render the SendHexDataRow if props.showHexData is false', () => {
      wrapper.setProps({ showHexData: false })
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      assert(PageContainerContentChild.childAt(0).is(SendFromRow))
      assert(PageContainerContentChild.childAt(1).is(SendToRow))
      assert(PageContainerContentChild.childAt(2).is(SendAssetRow))
      assert(PageContainerContentChild.childAt(3).is(SendAmountRow))
      assert(PageContainerContentChild.childAt(4).is(SendGasRow))
      assert.equal(PageContainerContentChild.childAt(5).exists(), false)
    })
  })

  it('should not render the asset dropdown if token length is 0 ', () => {
    wrapper.setProps({ tokens: [] })
    const PageContainerContentChild = wrapper.find(PageContainerContent).children()
    assert(PageContainerContentChild.childAt(2).is(SendAssetRow))
    assert(PageContainerContentChild.childAt(2).find('send-v2__asset-dropdown__single-asset'), true)
  })
})
