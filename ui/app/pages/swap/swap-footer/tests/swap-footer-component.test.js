import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import SwapFooter from '../swap-footer.component.js'
import PageContainerFooter from '../../../../components/ui/page-container/page-container-footer'

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

describe('SwapFooter Component', function () {
  const propsMethodSpies = {
    approve: sinon.spy(),
    sign: sinon.spy(),
    updateSwapTokenApprovalTxId: sinon.spy(),
    hideLoadingIndication: sinon.spy(),
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
        updateSwapTokenApprovalTxId={propsMethodSpies.updateSwapTokenApprovalTxId}
        hideLoadingIndication={propsMethodSpies.hideLoadingIndication}
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
    propsMethodSpies.updateSwapTokenApprovalTxId.resetHistory()
    propsMethodSpies.hideLoadingIndication.resetHistory()
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
        transaction: { params: 'mockTransaction' },
      })
      assert.strictEqual(propsMethodSpies.sign.callCount, 0)
      wrapper.instance().onSubmit(mockEvent)
      assert.strictEqual(propsMethodSpies.sign.callCount, 1)
      assert.deepStrictEqual(propsMethodSpies.sign.getCall(0).args, [
        { params: 'mockTransaction' },
      ])
    })

    it('should call sign() for BAT with enough allowance', function () {
      const wrapper = wrapperFactory({
        fromAsset: BAT,
        transaction: { params: 'mockTransaction' },
        isSwapFromTokenAssetAllowanceEnough: true,
      })
      assert.strictEqual(propsMethodSpies.sign.callCount, 0)
      wrapper.instance().onSubmit(mockEvent)
      assert.strictEqual(propsMethodSpies.sign.callCount, 1)
      assert.deepStrictEqual(propsMethodSpies.sign.getCall(0).args, [
        { params: 'mockTransaction' },
      ])
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
    })

    it('should handle newly created unapproved transaction from BAT', function () {
      const wrapper = wrapperFactory({ fromAsset: BAT })
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
      assert.strictEqual(propsMethodSpies.updateSwapTokenApprovalTxId.callCount, 1)
      assert.deepStrictEqual(
        propsMethodSpies.updateSwapTokenApprovalTxId.getCall(0).args,
        ['1234567890'],
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
