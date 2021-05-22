import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import AmountMaxButton from '../amount-max-button.component.js'

describe('AmountMaxButton Component', function () {
  let wrapper
  let instance

  const propsMethodSpies = {
    setAmountToMax: sinon.spy(),
    setMaxModeTo: sinon.spy(),
  }

  const MOCK_EVENT = { preventDefault: () => {} }

  before(function () {
    sinon.spy(AmountMaxButton.prototype, 'setMaxAmount')
  })

  beforeEach(function () {
    wrapper = shallow((
      <AmountMaxButton
        balance="mockBalance"
        gasTotal="mockGasTotal"
        maxModeOn={false}
        swapFromToken={ { address: 'mockTokenAddress' } }
        setAmountToMax={propsMethodSpies.setAmountToMax}
        setMaxModeTo={propsMethodSpies.setMaxModeTo}
        tokenBalance="mockTokenBalance"
      />
    ), {
      context: {
        t: (str) => str + '_t',
        metricsEvent: () => {},
      },
    })
    instance = wrapper.instance()
  })

  afterEach(function () {
    propsMethodSpies.setAmountToMax.resetHistory()
    propsMethodSpies.setMaxModeTo.resetHistory()
    AmountMaxButton.prototype.setMaxAmount.resetHistory()
  })

  after(function () {
    sinon.restore()
  })

  describe('setMaxAmount', function () {

    it('should call setAmountToMax with the correct params', function () {
      assert.equal(propsMethodSpies.setAmountToMax.callCount, 0)
      instance.setMaxAmount()
      assert.equal(propsMethodSpies.setAmountToMax.callCount, 1)
      assert.deepEqual(
        propsMethodSpies.setAmountToMax.getCall(0).args,
        [{
          balance: 'mockBalance',
          gasTotal: 'mockGasTotal',
          swapFromToken: { address: 'mockTokenAddress' },
          tokenBalance: 'mockTokenBalance',
        }],
      )
    })

  })

  describe('render', function () {
    it('should render an element with a swap-v2__amount-max class', function () {
      assert(wrapper.exists('.swap-v2__amount-max'))
    })

    it('should call setMaxModeTo and setMaxAmount when the checkbox is checked', function () {
      const {
        onClick,
      } = wrapper.find('.swap-v2__amount-max').props()

      assert.equal(AmountMaxButton.prototype.setMaxAmount.callCount, 0)
      assert.equal(propsMethodSpies.setMaxModeTo.callCount, 0)
      onClick(MOCK_EVENT)
      assert.equal(AmountMaxButton.prototype.setMaxAmount.callCount, 1)
      assert.equal(propsMethodSpies.setMaxModeTo.callCount, 1)
      assert.deepEqual(
        propsMethodSpies.setMaxModeTo.getCall(0).args,
        [true],
      )
    })

    it('should render the expected text when maxModeOn is false', function () {
      wrapper.setProps({ maxModeOn: false })
      assert.equal(wrapper.find('.swap-v2__amount-max').text(), 'max_t')
    })
  })
})
