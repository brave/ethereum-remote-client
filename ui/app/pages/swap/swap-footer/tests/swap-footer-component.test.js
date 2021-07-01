import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import SwapFooter from '../swap-footer.component.js'
import PageContainerFooter from '../../../../components/ui/page-container/page-container-footer'
import { BAT, ETH } from '../../tests/swap-utils.test'

describe('SwapFooter Component', function () {
  const propsMethodSpies = {
    approve: sinon.spy(),
    sign: sinon.spy(),
    updateSwapTokenApprovalTxId: sinon.spy(),
    hideLoadingIndication: sinon.spy(),
    showLoadingIndication: sinon.spy(),
    refreshQuote: sinon.spy(),
    clearSwap: sinon.spy(),
  }

  const mockEvent = {
    preventDefault: sinon.stub(),
  }

  const mockHistory = { mockProp: 'history-abc', push: sinon.spy() }

  const wrapperFactory = (props) =>
    shallow(
      <SwapFooter
        history={mockHistory}
        approve={propsMethodSpies.approve}
        sign={propsMethodSpies.sign}
        clearSwap={propsMethodSpies.clearSwap}
        updateSwapTokenApprovalTxId={propsMethodSpies.updateSwapTokenApprovalTxId}
        refreshQuote={propsMethodSpies.refreshQuote}
        hideLoadingIndication={propsMethodSpies.hideLoadingIndication}
        showLoadingIndication={propsMethodSpies.showLoadingIndication}
        unapprovedTxs={{}}
        {...props}
      />,
      { context: { t: (str) => str, metricsEvent: () => ({}) } },
    )

  before(function () {
    sinon.spy(SwapFooter.prototype, 'onSubmit')
    sinon.spy(SwapFooter.prototype, 'componentDidUpdate')
  })

  afterEach(function () {
    propsMethodSpies.approve.resetHistory()
    propsMethodSpies.sign.resetHistory()
    propsMethodSpies.clearSwap.resetHistory()
    propsMethodSpies.updateSwapTokenApprovalTxId.resetHistory()
    propsMethodSpies.refreshQuote.resetHistory()
    propsMethodSpies.hideLoadingIndication.resetHistory()
    propsMethodSpies.showLoadingIndication.resetHistory()
    SwapFooter.prototype.onSubmit.resetHistory()
    SwapFooter.prototype.componentDidUpdate.resetHistory()
  })

  after(function () {
    sinon.restore()
  })

  describe('onSubmit', function () {
    it('should call sign() for ETH', function () {
      const wrapper = wrapperFactory({
        fromAsset: ETH,
        toAsset: BAT,
        transaction: { params: 'mockTransaction' },
      })
      assert.strictEqual(propsMethodSpies.sign.callCount, 0)
      wrapper.instance().onSubmit(mockEvent)
      assert(propsMethodSpies.showLoadingIndication.calledOnce)
      assert.strictEqual(propsMethodSpies.refreshQuote.callCount, 1)
      assert.deepStrictEqual(propsMethodSpies.refreshQuote.getCall(0).args,
        [ETH, BAT],
      )
    })

    it('should call sign() for BAT with enough allowance', function () {
      const wrapper = wrapperFactory({
        fromAsset: BAT,
        toAsset: ETH,
        transaction: { params: 'mockTransaction' },
        isSwapFromTokenAssetAllowanceEnough: true,
      })
      assert.strictEqual(propsMethodSpies.refreshQuote.callCount, 0)
      wrapper.instance().onSubmit(mockEvent)
      assert.strictEqual(propsMethodSpies.refreshQuote.callCount, 1)
      assert.deepStrictEqual(propsMethodSpies.refreshQuote.getCall(0).args,
        [BAT, ETH],
      )
    })

    it('should call approve() for BAT if not enough allowance', function () {
      const wrapper = wrapperFactory({
        fromAsset: BAT,
        isSwapFromTokenAssetAllowanceEnough: false,
        customAllowance: 'mockCustomAllowance',
      })
      assert.strictEqual(propsMethodSpies.approve.callCount, 0)
      wrapper.instance().onSubmit(mockEvent)
      assert.strictEqual(propsMethodSpies.approve.callCount, 1)
      assert.deepStrictEqual(propsMethodSpies.approve.getCall(0).args, [
        'mockCustomAllowance',
      ])
    })
  })

  describe('componentDidUpdate', function () {
    it('should handle newly created unapproved transaction from ETH', function () {
      const wrapper = wrapperFactory({ fromAsset: ETH })
      assert.strictEqual(
        SwapFooter.prototype.componentDidUpdate.calledOnce,
        false,
      )

      wrapper.setProps({
        unapprovedTxs: {
          1234567890: 'mockUnapprovedTx',
        },
      })

      assert(SwapFooter.prototype.componentDidUpdate.calledOnce)
      assert.deepStrictEqual(mockHistory.push.getCall(0).args, [
        '/confirm-transaction/1234567890',
      ])

      assert.strictEqual(propsMethodSpies.hideLoadingIndication.callCount, 1)
      assert.strictEqual(propsMethodSpies.updateSwapTokenApprovalTxId.callCount, 0)
      assert.strictEqual(propsMethodSpies.clearSwap.callCount, 1)
    })

    it('should handle newly created unapproved transaction from BAT', function () {
      const wrapper = wrapperFactory({ fromAsset: BAT })
      assert(!SwapFooter.prototype.componentDidUpdate.calledOnce)

      wrapper.setProps({
        unapprovedTxs: {
          1234567890: 'mockUnapprovedTx',
        },
      })

      assert(SwapFooter.prototype.componentDidUpdate.calledOnce)
      assert.deepStrictEqual(mockHistory.push.getCall(0).args, [
        '/confirm-transaction/1234567890',
      ])

      assert.strictEqual(propsMethodSpies.hideLoadingIndication.callCount, 1)
      assert.strictEqual(propsMethodSpies.updateSwapTokenApprovalTxId.callCount, 1)
      assert.deepStrictEqual(
        propsMethodSpies.updateSwapTokenApprovalTxId.getCall(0).args,
        ['1234567890'],
      )
      assert.strictEqual(propsMethodSpies.clearSwap.callCount, 0)
    })

    it('should call sign() if full quote is fetched', function () {
      const wrapper = wrapperFactory(
        { transaction: {} },
      )
      assert(!SwapFooter.prototype.componentDidUpdate.calledOnce)

      wrapper.setProps({
        transaction: {
          data: 'mockTransactionData',
        },
      })
      assert(SwapFooter.prototype.componentDidUpdate.calledOnce)
      assert.strictEqual(propsMethodSpies.sign.callCount, 1)
      assert.deepStrictEqual(
        propsMethodSpies.sign.getCall(0).args,
        [{ data: 'mockTransactionData' }],
      )
    })
  })

  describe('render', function () {
    it('should render a PageContainerFooter component', function () {
      const wrapper = wrapperFactory()
      assert.strictEqual(wrapper.find(PageContainerFooter).length, 1)
    })

    it('should pass the correct props to PageContainerFooter', function () {
      const wrapper = wrapperFactory({ fromAsset: ETH })
      const { onSubmit } = wrapper.find(PageContainerFooter).props()

      assert.strictEqual(SwapFooter.prototype.onSubmit.callCount, 0)
      onSubmit(mockEvent)
      assert.strictEqual(SwapFooter.prototype.onSubmit.callCount, 1)
    })
  })
})
