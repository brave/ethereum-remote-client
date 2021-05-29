import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import SwapAmountRow from '../swap-amount-row.component.js'
import UserPreferencedTokenInput from '../../../../../components/app/user-preferenced-token-input'
import UserPreferencedCurrencyInput from '../../../../../components/app/user-preferenced-currency-input'

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

const MOCK = {
  name: 'mockTokenName',
  address: 'mockTokenAddress',
  symbol: 'MOCK',
  decimals: 18,
}

describe('SwapAmountRow Component', function () {
  describe('handleChange()', function () {
    it('should call side-effect functions with correct params', function () {
      const {
        instance,
        propsMethodSpies: { computeSwapErrors, updateSwapAmount, refreshQuote },
      } = shallowRenderSwapAmountRow(ETH)

      assert.strictEqual(computeSwapErrors.callCount, 0)
      assert.strictEqual(updateSwapAmount.callCount, 0)
      assert.strictEqual(refreshQuote.callCount, 0)

      instance.handleChange('someAmount')

      assert.ok(
        computeSwapErrors.calledOnceWithExactly({
          amount: 'someAmount',
        }),
      )
      assert.ok(updateSwapAmount.calledOnceWithExactly('someAmount'))
      assert.ok(refreshQuote.calledOnceWithExactly(ETH, MOCK, 'someAmount'))
    })
  })

  describe('render', function () {
    it('should render as null when fromAsset is missing', function () {
      const { wrapper } = shallowRenderSwapAmountRow()
      assert(wrapper.isEmptyRender())
    })

    it('should pass the correct props', function () {
      const { instance } = shallowRenderSwapAmountRow(ETH)

      const { amount, estimatedGasCost, fromAsset, toAsset } = instance.props

      assert.strictEqual(amount, 'mockAmount')
      assert.strictEqual(estimatedGasCost, 'mockEstimatedGasCost')
      assert.deepStrictEqual(fromAsset, ETH)
      assert.deepStrictEqual(toAsset, MOCK)
    })

    it('should render UserPreferencedTokenInput for BAT', function () {
      const {
        wrapper,
        instanceSpies: { handleChange },
      } = shallowRenderSwapAmountRow(BAT)

      assert(wrapper.is(UserPreferencedTokenInput))

      assert.strictEqual(handleChange.callCount, 0)
      handleChange('mockNewAmount')
      assert.ok(handleChange.calledOnceWithExactly('mockNewAmount'))
    })

    it('should render UserPreferencedCurrencyInput for ETH', function () {
      const {
        wrapper,
        instanceSpies: { handleChange },
      } = shallowRenderSwapAmountRow(ETH)

      assert(wrapper.is(UserPreferencedCurrencyInput))

      assert.strictEqual(handleChange.callCount, 0)
      handleChange('mockNewAmount')
      assert.ok(handleChange.calledOnceWithExactly('mockNewAmount'))
    })
  })
})

function shallowRenderSwapAmountRow (fromAsset) {
  const updateSwapAmount = sinon.spy()
  const refreshQuote = sinon.spy()
  const computeSwapErrors = sinon.spy()

  const wrapper = shallow(
    <SwapAmountRow
      amount="mockAmount"
      estimatedGasCost="mockEstimatedGasCost"
      fromAsset={fromAsset}
      toAsset={{
        name: 'mockTokenName',
        address: 'mockTokenAddress',
        symbol: 'MOCK',
        decimals: 18,
      }}
      updateSwapAmount={updateSwapAmount}
      refreshQuote={refreshQuote}
      computeSwapErrors={computeSwapErrors}
    />,
    { context: { t: (str) => str + '_t' } },
  )
  const instance = wrapper.instance()
  const handleChange = sinon.spy(instance, 'handleChange')

  return {
    instance,
    wrapper,
    propsMethodSpies: {
      updateSwapAmount,
      refreshQuote,
      computeSwapErrors,
    },
    instanceSpies: {
      handleChange,
    },
  }
}
