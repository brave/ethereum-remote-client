import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import SwapContent from '../swap-content.component.js'
import PageContainerContent from '../../../../components/ui/page-container/page-container-content.component'
import SwapAssetRow from '../swap-asset-row'
import SwapFees from '../swap-fees'
import SwapQuote from '../swap-quote'

describe('SwapContent Component', function () {
  const propsMethodSpies = {
    setCustomAllowance: sinon.spy(),
    refreshQuote: sinon.spy(),
  }

  const wrapperFactory = (props) => shallow(
    <SwapContent
      setCustomAllowance={propsMethodSpies.setCustomAllowance}
      refreshQuote={propsMethodSpies.refreshQuote}
      customAllowance="mockCustomAllowance"
      seconds={12345}
      {...props}
    />,
    { context: { t: (str) => str, metricsEvent: () => ({}) } },
  )

  afterEach(function () {
    propsMethodSpies.setCustomAllowance.resetHistory()
    propsMethodSpies.refreshQuote.resetHistory()
  })

  describe('render', function () {
    it('should render a PageContainerContent component', function () {
      const wrapper = wrapperFactory()
      assert.strictEqual(wrapper.find(PageContainerContent).length, 1)
    })

    it('should render a div with a .swap-v2__form class as a child of PageContainerContent', function () {
      const wrapper = wrapperFactory()
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      PageContainerContentChild.is('div')
      PageContainerContentChild.is('.swap-v2__form')
    })

    it('should render the correct row components as grandchildren of the PageContainerContent component', function () {
      const wrapper = wrapperFactory()
      const PageContainerContentChild = wrapper.find(PageContainerContent).children()
      assert(PageContainerContentChild.childAt(0).is(SwapAssetRow), 'row[0] should be SwapAssetRow')
      assert(PageContainerContentChild.childAt(1).is(SwapQuote), 'row[1] should be SwapQuote')
      assert(PageContainerContentChild.childAt(2).is(SwapFees), 'row[2] should be SwapFees')
    })

    it('should pass the correct props to SwapQuote', function () {
      const wrapper = wrapperFactory()
      assert.deepStrictEqual(
        wrapper.find(SwapQuote).props(),
        { seconds: 12345 },
      )
    })

    it('should pass the correct props to SwapAssetRow', function () {
      const wrapper = wrapperFactory()
      assert.deepStrictEqual(
        wrapper.find(SwapAssetRow).props(), {
          customAllowance: 'mockCustomAllowance',
          refreshQuote: propsMethodSpies.refreshQuote,
          setCustomAllowance: propsMethodSpies.setCustomAllowance,
        },
      )
    })

    it('should pass the correct props to SwapFees', function () {
      const wrapper = wrapperFactory()
      assert.deepStrictEqual(
        wrapper.find(SwapFees).props(), {
          refreshQuote: propsMethodSpies.refreshQuote,
        },
      )
    })
  })
})
