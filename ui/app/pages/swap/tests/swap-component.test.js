import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import SwapHeader from '../swap-header/swap-header.container'
import SwapContent from '../swap-content'
import SwapFooter from '../swap-footer/swap-footer.container'
import SwapTransactionScreen from '../swap.component'
import { BAT, ETH } from './swap-utils.test'

describe('Swap component', function () {
  const propsMethodSpies = {
    hideLoadingIndication: sinon.spy(),
    resetSwapState: sinon.spy(),
    fetchSwapQuote: sinon.spy(),
  }

  const mockHistory = { mockProp: 'history-abc', push: sinon.spy() }

  const wrapperFactory = (props) =>
    shallow(
      <SwapTransactionScreen
        history={mockHistory}
        fetchSwapQuote={propsMethodSpies.fetchSwapQuote}
        resetSwapState={propsMethodSpies.resetSwapState}
        hideLoadingIndication={propsMethodSpies.hideLoadingIndication}
        unapprovedTxs={{}}
        {...props}
      />,
      { context: { t: (str) => str, metricsEvent: () => ({}) } },
    )

  before(function () {
    sinon.spy(SwapTransactionScreen.prototype, 'componentWillUnmount')
  })

  afterEach(function () {
    SwapTransactionScreen.prototype.componentWillUnmount.resetHistory()
  })

  after(function () {
    sinon.restore()
  })

  it('should call componentWillUnmount', function () {
    const wrapper = wrapperFactory()
    wrapper.unmount()
    assert(SwapTransactionScreen.prototype.componentWillUnmount.calledOnce)
  })

  describe('componentWillUnmount', function () {
    it('should call resetSwapState', function () {
      propsMethodSpies.resetSwapState.resetHistory()
      assert.strictEqual(propsMethodSpies.resetSwapState.callCount, 0)
      wrapperFactory().instance().componentWillUnmount()
      assert.strictEqual(propsMethodSpies.resetSwapState.callCount, 1)
    })
  })

  describe('render', function () {
    it('should render a page-container class', function () {
      const wrapper = wrapperFactory()
      assert.strictEqual(wrapper.find('.page-container').length, 1)
    })

    it('should render SwapHeader', function () {
      const wrapper = wrapperFactory()
      assert.strictEqual(wrapper.find(SwapHeader).length, 1)
    })

    it('should render SwapFooter', function () {
      const wrapper = wrapperFactory()
      assert.strictEqual(wrapper.find(SwapFooter).length, 1)
    })

    it('should render SwapContent', function () {
      const wrapper = wrapperFactory()
      assert.strictEqual(wrapper.find(SwapContent).length, 1)
    })

    it('should pass the history prop to SwapHeader and SwapFooter', function () {
      const wrapper = wrapperFactory()

      assert.strictEqual(wrapper.find(SwapHeader).length, 1)
      assert.strictEqual(wrapper.find(SwapContent).length, 1)
      assert.strictEqual(wrapper.find(SwapFooter).length, 1)

      assert.deepStrictEqual(
        wrapper.find(SwapFooter).props().history,
        mockHistory,
      )

      assert.deepStrictEqual(
        wrapper.find(SwapHeader).props().history,
        mockHistory,
      )
    })

    it('should pass customAllowance to SwapContent', function () {
      const wrapper = wrapperFactory()

      wrapper.setState({
        customAllowance: 'mockCustomAllowance',
      })
      assert.strictEqual(
        wrapper.find(SwapContent).props().customAllowance,
        'mockCustomAllowance',
      )
    })

    it('should pass customAllowance to SwapFooter', function () {
      const wrapper = wrapperFactory()

      wrapper.setState({
        customAllowance: 'mockCustomAllowance',
      })
      assert.strictEqual(
        wrapper.find(SwapFooter).props().customAllowance,
        'mockCustomAllowance',
      )
    })

    it('should update customAllowance if setCustomAllowance() is called', function () {
      const wrapper = wrapperFactory()
      wrapper.instance().setCustomAllowance('mockCustomAllowance')

      assert.strictEqual(
        wrapper.find(SwapFooter).props().customAllowance,
        'mockCustomAllowance',
      )

      assert.strictEqual(
        wrapper.find(SwapContent).props().customAllowance,
        'mockCustomAllowance',
      )
    })

    it('should pass seconds prop to SwapContent on change', function () {
      const wrapper = wrapperFactory()
      wrapper.setState({ seconds: 'mockSeconds' })
      assert.strictEqual(
        wrapper.find(SwapContent).props().seconds,
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
      wrapper.instance().refreshQuote(ETH, BAT, '7b', '100', 3)
      assert.strictEqual(propsMethodSpies.fetchSwapQuote.calledOnce, true)
      assert.deepStrictEqual(
        propsMethodSpies.fetchSwapQuote.getCall(0).args,
        [ETH, BAT, '7b', '0x64', 3, true, false],
      )
    })
  })
})
