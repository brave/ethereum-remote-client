import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'

import SwapContent from '../swap-content.component.js'
import PageContainerContent from '../../../../components/ui/page-container/page-container-content.component'
import SwapAssetRow from '../swap-asset-row'
import SwapFees from '../swap-fees'
import SwapQuote from '../swap-quote'
import sinon from 'sinon'

const ETH = {
  name: 'Ether',
  address: '',
  symbol: 'ETH',
  decimals: 18,
}

const BAT = {
  name: 'Basic Attention Token',
  address: '0xDEADBEEF',
  symbol: 'BAT',
  decimals: 18,
}

describe('SwapContent Component', function () {
  const propsMethodSpies = {
    fetchSwapQuote: sinon.spy(),
    setCustomAllowance: sinon.spy(),
  }

  const wrapperFactory = (props) => shallow(
    <SwapContent
      fetchSwapQuote={propsMethodSpies.fetchSwapQuote}
      setCustomAllowance={propsMethodSpies.setCustomAllowance}
      {...props}
    />,
    { context: { t: (str) => str, metricsEvent: () => ({}) } },
  )

  afterEach(function () {
    propsMethodSpies.setCustomAllowance.resetHistory()
    propsMethodSpies.fetchSwapQuote.resetHistory()
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

    it('should pass seconds prop to SwapQuote on change', function () {
      const wrapper = wrapperFactory()
      wrapper.setState({ seconds: 'mockSeconds' })
      assert.strictEqual(
        wrapper.find(SwapQuote).props().seconds,
        'mockSeconds',
      )
    })

    it('should not invoke fetchSwapQuote is no fromAsset', function () {
      const wrapper = wrapperFactory({})
      wrapper.instance().refreshQuote(null, BAT)
      assert.strictEqual(propsMethodSpies.fetchSwapQuote.calledOnce, false)
    })

    it('should not invoke fetchSwapQuote is no toAsset', function () {
      const wrapper = wrapperFactory({})
      wrapper.instance().refreshQuote(ETH, null)
      assert.strictEqual(propsMethodSpies.fetchSwapQuote.calledOnce, false)
    })

    it('should not invoke fetchSwapQuote is no amount', function () {
      const wrapper = wrapperFactory({})
      wrapper.instance().refreshQuote(ETH, BAT, '0')
      assert.strictEqual(propsMethodSpies.fetchSwapQuote.calledOnce, false)
    })

    it('should invoke fetchSwapQuote if correct props are passed', function () {
      const wrapper = wrapperFactory({})
      wrapper.instance().refreshQuote(ETH, BAT, '7b', '100')
      assert.strictEqual(propsMethodSpies.fetchSwapQuote.calledOnce, true)
      assert.deepStrictEqual(
        propsMethodSpies.fetchSwapQuote.getCall(0).args,
        [ETH, BAT, '7b', '0x64', true],
      )
    })
  })
})
