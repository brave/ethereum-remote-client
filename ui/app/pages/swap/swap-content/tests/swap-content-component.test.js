import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import SwapContent from '../swap-content.component.js'

import PageContainerContent from '../../../../components/ui/page-container/page-container-content.component'
import SwapAmountRow from '../swap-amount-row/swap-amount-row.container'
import SwapGasRow from '../swap-gas-row/swap-gas-row.container'
import SwapHexDataRow from '../swap-hex-data-row/swap-hex-data-row.container'
import SwapAssetRow from '../swap-asset-row/swap-asset-row.container'
import Dialog from '../../../../components/ui/dialog'

describe('SwapContent Component', function () {
  let wrapper

  beforeEach(function () {
    wrapper = shallow(
      <SwapContent
        showHexData
      />,
      { context: { t: (str) => str + '_t' } },
    )
  })

  describe('render', function () {
    it('should render a PageContainerContent component', function () {
      assert.equal(wrapper.find(PageContainerContent).length, 1)
    })

    it('should render a div with a .swap-v2__form class as a child of PageContainerContent', function () {
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      PageContainerContentChild.is('div')
      PageContainerContentChild.is('.swap-v2__form')
    })

    it('should render the correct row components as grandchildren of the PageContainerContent component', function () {
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      assert(PageContainerContentChild.childAt(0).is(Dialog), 'row[0] should be Dialog')
      assert(PageContainerContentChild.childAt(1).is(SwapAssetRow), 'row[1] should be SwapAssetRow')
      assert(PageContainerContentChild.childAt(2).is(SwapAmountRow), 'row[2] should be SwapAmountRow')
      assert(PageContainerContentChild.childAt(3).is(SwapGasRow), 'row[3] should be SwapGasRow')
      assert(PageContainerContentChild.childAt(4).is(SwapHexDataRow), 'row[4] should be SwapHexDataRow')
    })

    it('should not render the SwapHexDataRow if props.showHexData is false', function () {
      wrapper.setProps({ showHexData: false })
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      assert(PageContainerContentChild.childAt(0).is(Dialog), 'row[0] should be Dialog')
      assert(PageContainerContentChild.childAt(1).is(SwapAssetRow), 'row[1] should be SwapAssetRow')
      assert(PageContainerContentChild.childAt(2).is(SwapAmountRow), 'row[2] should be SwapAmountRow')
      assert(PageContainerContentChild.childAt(3).is(SwapGasRow), 'row[3] should be SwapGasRow')
      assert.equal(PageContainerContentChild.childAt(4).exists(), false)
    })

    it('should not render the Dialog if contact has a name', function () {
      wrapper.setProps({
        showHexData: false,
        contact: { name: 'testName' },
      })
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      assert(PageContainerContentChild.childAt(0).is(SwapAssetRow), 'row[1] should be SwapAssetRow')
      assert(PageContainerContentChild.childAt(1).is(SwapAmountRow), 'row[2] should be SwapAmountRow')
      assert(PageContainerContentChild.childAt(2).is(SwapGasRow), 'row[3] should be SwapGasRow')
      assert.equal(PageContainerContentChild.childAt(3).exists(), false)
    })

    it('should not render the Dialog if it is an ownedAccount', function () {
      wrapper.setProps({
        showHexData: false,
        isOwnedAccount: true,
      })
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      assert(PageContainerContentChild.childAt(0).is(SwapAssetRow), 'row[1] should be SwapAssetRow')
      assert(PageContainerContentChild.childAt(1).is(SwapAmountRow), 'row[2] should be SwapAmountRow')
      assert(PageContainerContentChild.childAt(2).is(SwapGasRow), 'row[3] should be SwapGasRow')
      assert.equal(PageContainerContentChild.childAt(3).exists(), false)
    })

    it('should render contract warning when swaping a token to its own address', function () {
      wrapper.setProps({
        showHexData: false,
        isOwnedAccount: true,
        isContractAddress: true,
      })
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      assert(PageContainerContentChild.childAt(0).is('.contract-error-dialog'), 'row[0] should be contract error dialog')
    })

    it('should not render contract warning when swaping a token to an appropriate address', function () {
      wrapper.setProps({
        showHexData: false,
        isOwnedAccount: true,
        isContractAddress: false,
      })
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      assert(PageContainerContentChild.childAt(0).is(SwapAssetRow), 'row[0] should be SwapAssetRow')
    })
  })

  it('should not render the asset dropdown if token length is 0 ', function () {
    wrapper.setProps({ tokens: [] })
    const PageContainerContentChild = wrapper.find(PageContainerContent).children()
    assert(PageContainerContentChild.childAt(1).is(SwapAssetRow))
    assert(PageContainerContentChild.childAt(1).find('swap-v2__asset-dropdown__single-asset'), true)
  })
})
