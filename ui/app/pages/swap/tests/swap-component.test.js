import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import SwapHeader from '../swap-header/swap-header.container'
import SwapContent from '../swap-content/swap-content.container'
import SwapFooter from '../swap-footer/swap-footer.container'
import SwapTransactionScreen from '../swap.component'

describe('Swap component', function () {
  const propsMethodSpies = {
    hideLoadingIndication: sinon.spy(),
    resetSwapState: sinon.spy(),
  }

  const mockHistory = { mockProp: 'history-abc', push: sinon.spy() }

  const wrapperFactory = (props) =>
    shallow(
      <SwapTransactionScreen
        history={mockHistory}
        resetSwapState={propsMethodSpies.resetSwapState}
        hideLoadingIndication={propsMethodSpies.hideLoadingIndication}
        unapprovedTxs={{}}
        {...props}
      />,
      { context: { t: (str) => str, metricsEvent: () => ({}) } },
    )

  before(function () {
    sinon.spy(SwapTransactionScreen.prototype, 'componentDidUpdate')
    sinon.spy(SwapTransactionScreen.prototype, 'componentWillUnmount')
  })

  afterEach(function () {
    SwapTransactionScreen.prototype.componentDidUpdate.resetHistory()
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

  describe('componentDidUpdate', function () {
    it('should handle newly created unapproved transaction', function () {
      const wrapper = wrapperFactory()
      assert.strictEqual(
        SwapTransactionScreen.prototype.componentDidUpdate.calledOnce,
        false,
      )

      wrapper.setProps({
        unapprovedTxs: {
          1234567890: 'mockUnapprovedTx',
        },
      })

      assert(SwapTransactionScreen.prototype.componentDidUpdate.calledOnce)
      assert.deepStrictEqual(mockHistory.push.getCall(0).args, [
        '/confirm-transaction/1234567890',
      ])

      assert.strictEqual(propsMethodSpies.hideLoadingIndication.callCount, 1)
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
  })
})
