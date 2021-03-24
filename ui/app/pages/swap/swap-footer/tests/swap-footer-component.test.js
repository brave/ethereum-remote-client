import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import SwapFooter from '../swap-footer.component.js'
import PageContainerFooter from '../../../../components/ui/page-container/page-container-footer'

describe('SwapFooter Component', function () {
  let wrapper

  const propsMethodSpies = {
    clearSwap: sinon.spy(),
  }
  const historySpies = {
    push: sinon.spy(),
  }

  before(function () {
    sinon.spy(SwapFooter.prototype, 'onCancel')
  })

  beforeEach(function () {
    wrapper = shallow((
      <SwapFooter
        clearSwap={propsMethodSpies.clearSwap}
        history={historySpies}
        mostRecentOverviewPage="mostRecentOverviewPage"
      />
    ), { context: { t: (str) => str, metricsEvent: () => ({}) } })
  })

  afterEach(function () {
    propsMethodSpies.clearSwap.resetHistory()
    historySpies.push.resetHistory()
    SwapFooter.prototype.onCancel.resetHistory()
  })

  after(function () {
    sinon.restore()
  })

  describe('onCancel', function () {
    it('should call clearSwap', function () {
      assert.strictEqual(propsMethodSpies.clearSwap.callCount, 0)
      wrapper.instance().onCancel()
      assert.strictEqual(propsMethodSpies.clearSwap.callCount, 1)
    })

    it('should call history.push', function () {
      assert.strictEqual(historySpies.push.callCount, 0)
      wrapper.instance().onCancel()
      assert.strictEqual(historySpies.push.callCount, 1)
      assert.strictEqual(historySpies.push.getCall(0).args[0], 'mostRecentOverviewPage')
    })
  })

  describe('render', function () {
    it('should render a PageContainerFooter component', function () {
      assert.strictEqual(wrapper.find(PageContainerFooter).length, 1)
    })

    it('should pass the correct props to PageContainerFooter', function () {
      const {
        onCancel,
      } = wrapper.find(PageContainerFooter).props()
      assert.strictEqual(SwapFooter.prototype.onCancel.callCount, 0)
      onCancel()
      assert.strictEqual(SwapFooter.prototype.onCancel.callCount, 1)
    })
  })
})
