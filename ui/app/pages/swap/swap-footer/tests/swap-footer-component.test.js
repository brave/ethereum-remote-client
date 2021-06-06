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
  }

  const mockEvent = {
    preventDefault: sinon.stub(),
  }

  const wrapperFactory = (props) =>
    shallow(
      <SwapFooter
        approve={propsMethodSpies.approve}
        sign={propsMethodSpies.sign}
        {...props}
      />,
      { context: { t: (str) => str, metricsEvent: () => ({}) } },
    )

  before(function () {
    sinon.spy(SwapFooter.prototype, 'onSubmit')
  })

  afterEach(function () {
    propsMethodSpies.approve.resetHistory()
    propsMethodSpies.sign.resetHistory()
    SwapFooter.prototype.onSubmit.resetHistory()
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
