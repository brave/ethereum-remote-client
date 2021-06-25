import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import SwapHeader from '../swap-header.component.js'
import PageContainerHeader from '../../../../components/ui/page-container/page-container-header'

describe('SwapHeader Component', function () {
  let wrapper

  const propsMethodSpies = {
    clearSwap: sinon.spy(),
  }
  const historySpies = {
    push: sinon.spy(),
  }

  before(function () {
    sinon.spy(SwapHeader.prototype, 'onClose')
  })

  beforeEach(function () {
    wrapper = shallow(
      <SwapHeader
        clearSwap={propsMethodSpies.clearSwap}
        history={historySpies}
        mostRecentOverviewPage="mostRecentOverviewPage"
      />,
      { context: { t: (str1, str2) => (str2 ? str1 + str2 : str1) } },
    )
  })

  afterEach(function () {
    propsMethodSpies.clearSwap.resetHistory()
    historySpies.push.resetHistory()
    SwapHeader.prototype.onClose.resetHistory()
  })

  after(function () {
    sinon.restore()
  })

  describe('onClose', function () {
    it('should call clearSwap', function () {
      assert.strictEqual(propsMethodSpies.clearSwap.callCount, 0)
      wrapper.instance().onClose()
      assert.strictEqual(propsMethodSpies.clearSwap.callCount, 1)
    })

    it('should call history.push', function () {
      assert.strictEqual(historySpies.push.callCount, 0)
      wrapper.instance().onClose()
      assert.strictEqual(historySpies.push.callCount, 1)
      assert.strictEqual(
        historySpies.push.getCall(0).args[0],
        'mostRecentOverviewPage',
      )
    })
  })

  describe('render', function () {
    it('should render a PageContainerHeader component', function () {
      assert.strictEqual(wrapper.find(PageContainerHeader).length, 1)
    })

    it('should pass the correct props to PageContainerHeader', function () {
      const { onClose, title } = wrapper.find(PageContainerHeader).props()
      assert.strictEqual(title, 'swap')
      assert.strictEqual(SwapHeader.prototype.onClose.callCount, 0)
      onClose()
      assert.strictEqual(SwapHeader.prototype.onClose.callCount, 1)
    })
  })
})
