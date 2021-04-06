import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import SwapAmountRow from '../swap-amount-row.component.js'

import SwapRowWrapper from '../../swap-row-wrapper/swap-row-wrapper.component'
import AmountMaxButton from '../amount-max-button/amount-max-button.container'
import UserPreferencedTokenInput from '../../../../../components/app/user-preferenced-token-input'

describe('SwapAmountRow Component', function () {
  describe('validateAmount', function () {
    it('should call updateSwapAmountError with the correct params', function () {
      const { instance, propsMethodSpies: { updateSwapAmountError } } = shallowRenderSwapAmountRow()

      assert.equal(updateSwapAmountError.callCount, 0)

      instance.validateAmount('someAmount')

      assert.ok(updateSwapAmountError.calledOnceWithExactly({
        amount: 'someAmount',
        balance: 'mockBalance',
        conversionRate: 7,
        gasTotal: 'mockGasTotal',
        primaryCurrency: 'mockPrimaryCurrency',
        swapFromToken: { address: 'mockTokenAddress' },
        tokenBalance: 'mockTokenBalance',
      }))
    })

    it('should call updateGasFeeError if swapFromToken is truthy', function () {
      const { instance, propsMethodSpies: { updateGasFeeError } } = shallowRenderSwapAmountRow()

      assert.equal(updateGasFeeError.callCount, 0)

      instance.validateAmount('someAmount')

      assert.ok(updateGasFeeError.calledOnceWithExactly({
        balance: 'mockBalance',
        conversionRate: 7,
        gasTotal: 'mockGasTotal',
        primaryCurrency: 'mockPrimaryCurrency',
        swapFromToken: { address: 'mockTokenAddress' },
        tokenBalance: 'mockTokenBalance',
      }))
    })

    it('should call not updateGasFeeError if swapFromToken is falsey', function () {
      const { wrapper, instance, propsMethodSpies: { updateGasFeeError } } = shallowRenderSwapAmountRow()

      wrapper.setProps({ swapFromToken: null })

      assert.equal(updateGasFeeError.callCount, 0)

      instance.validateAmount('someAmount')

      assert.equal(updateGasFeeError.callCount, 0)
    })

  })

  describe('updateAmount', function () {

    it('should call setMaxModeTo', function () {
      const { instance, propsMethodSpies: { setMaxModeTo } } = shallowRenderSwapAmountRow()

      assert.equal(setMaxModeTo.callCount, 0)

      instance.updateAmount('someAmount')

      assert.ok(setMaxModeTo.calledOnceWithExactly(false))
    })

    it('should call updateSwapAmount', function () {
      const { instance, propsMethodSpies: { updateSwapAmount } } = shallowRenderSwapAmountRow()

      assert.equal(updateSwapAmount.callCount, 0)

      instance.updateAmount('someAmount')

      assert.ok(updateSwapAmount.calledOnceWithExactly('someAmount'))
    })

  })

  describe('render', function () {
    it('should render a SwapRowWrapper component', function () {
      const { wrapper } = shallowRenderSwapAmountRow()

      assert.equal(wrapper.find(SwapRowWrapper).length, 1)
    })

    it('should pass the correct props to SwapRowWrapper', function () {
      const { wrapper } = shallowRenderSwapAmountRow()
      const {
        errorType,
        label,
        showError,
      } = wrapper.find(SwapRowWrapper).props()

      assert.equal(errorType, 'amount')
      assert.equal(label, 'amount_t:')
      assert.equal(showError, false)
    })

    it('should render an AmountMaxButton as the first child of the SwapRowWrapper', function () {
      const { wrapper } = shallowRenderSwapAmountRow()

      assert(wrapper.find(SwapRowWrapper).childAt(0).is(AmountMaxButton))
    })

    it('should render a UserPreferencedTokenInput as the second child of the SwapRowWrapper', function () {
      const { wrapper } = shallowRenderSwapAmountRow()

      assert(wrapper.find(SwapRowWrapper).childAt(1).is(UserPreferencedTokenInput))
    })

    it('should render the UserPreferencedTokenInput with the correct props', function () {
      const { wrapper, instanceSpies: { updateGas, updateAmount, validateAmount } } = shallowRenderSwapAmountRow()
      const {
        onChange,
        error,
        value,
      } = wrapper.find(SwapRowWrapper).childAt(1).props()

      assert.equal(error, false)
      assert.equal(value, 'mockAmount')
      assert.equal(updateGas.callCount, 0)
      assert.equal(updateAmount.callCount, 0)
      assert.equal(validateAmount.callCount, 0)

      onChange('mockNewAmount')

      assert.ok(updateGas.calledOnceWithExactly('mockNewAmount'))
      assert.ok(updateAmount.calledOnceWithExactly('mockNewAmount'))
      assert.ok(validateAmount.calledOnceWithExactly('mockNewAmount'))
    })
  })
})

function shallowRenderSwapAmountRow () {
  const setMaxModeTo = sinon.spy()
  const updateGasFeeError = sinon.spy()
  const updateSwapAmount = sinon.spy()
  const updateSwapAmountError = sinon.spy()
  const wrapper = shallow((
    <SwapAmountRow
      amount="mockAmount"
      balance="mockBalance"
      conversionRate={7}
      convertedCurrency="mockConvertedCurrency"
      gasTotal="mockGasTotal"
      inError={false}
      primaryCurrency="mockPrimaryCurrency"
      swapFromToken={ { address: 'mockTokenAddress' } }
      setMaxModeTo={setMaxModeTo}
      tokenBalance="mockTokenBalance"
      updateGasFeeError={updateGasFeeError}
      updateSwapAmount={updateSwapAmount}
      updateSwapAmountError={updateSwapAmountError}
      updateGas={() => {}}
    />
  ), { context: { t: (str) => str + '_t' } })
  const instance = wrapper.instance()
  const updateAmount = sinon.spy(instance, 'updateAmount')
  const updateGas = sinon.spy(instance, 'updateGas')
  const validateAmount = sinon.spy(instance, 'validateAmount')

  return {
    instance,
    wrapper,
    propsMethodSpies: {
      setMaxModeTo,
      updateGasFeeError,
      updateSwapAmount,
      updateSwapAmountError,
    },
    instanceSpies: {
      updateAmount,
      updateGas,
      validateAmount,
    },
  }
}
