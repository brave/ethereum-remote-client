import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import SwapRowWrapper from '../swap-row-wrapper.component.js'

import SwapRowErrorMessage from '../swap-row-error-message/swap-row-error-message.container'

describe('SwapContent Component', function () {
  let wrapper

  describe('render', function () {
    beforeEach(function () {
      wrapper = shallow((
        <SwapRowWrapper errorType="mockErrorType" label="mockLabel" showError={false}>
          <span>Mock Form Field</span>
        </SwapRowWrapper>
      ))
    })

    it('should render a div with a swap-v2__form-row class', function () {
      assert.equal(wrapper.find('div.swap-v2__form-row').length, 1)
    })

    it('should render two children of the root div, with swap-v2_form label and field classes', function () {
      assert.equal(wrapper.find('.swap-v2__form-row > .swap-v2__form-label').length, 1)
      assert.equal(wrapper.find('.swap-v2__form-row > .swap-v2__form-field').length, 1)
    })

    it('should render the label as a child of the swap-v2__form-label', function () {
      assert.equal(wrapper.find('.swap-v2__form-row > .swap-v2__form-label').childAt(0).text(), 'mockLabel')
    })

    it('should render its first child as a child of the swap-v2__form-field', function () {
      assert.equal(wrapper.find('.swap-v2__form-row > .swap-v2__form-field').childAt(0).text(), 'Mock Form Field')
    })

    it('should not render a SwapRowErrorMessage if showError is false', function () {
      assert.equal(wrapper.find(SwapRowErrorMessage).length, 0)
    })

    it('should render a SwapRowErrorMessage with and errorType props if showError is true', function () {
      wrapper.setProps({ showError: true })
      assert.equal(wrapper.find(SwapRowErrorMessage).length, 1)

      const expectedSwapRowErrorMessage = wrapper.find('.swap-v2__form-row > .swap-v2__form-label').childAt(1)
      assert(expectedSwapRowErrorMessage.is(SwapRowErrorMessage))
      assert.deepEqual(
        expectedSwapRowErrorMessage.props(),
        { errorType: 'mockErrorType' },
      )
    })

    it('should render its second child as a child of the swap-v2__form-field, if it has two children', function () {
      wrapper = shallow((
        <SwapRowWrapper
          errorType="mockErrorType"
          label="mockLabel"
          showError={false}
        >
          <span>Mock Custom Label Content</span>
          <span>Mock Form Field</span>
        </SwapRowWrapper>
      ))
      assert.equal(wrapper.find('.swap-v2__form-row > .swap-v2__form-field').childAt(0).text(), 'Mock Form Field')
    })

    it('should render its first child as the last child of the swap-v2__form-label, if it has two children', function () {
      wrapper = shallow((
        <SwapRowWrapper
          errorType="mockErrorType"
          label="mockLabel"
          showError={false}
        >
          <span>Mock Custom Label Content</span>
          <span>Mock Form Field</span>
        </SwapRowWrapper>
      ))
      assert.equal(wrapper.find('.swap-v2__form-row > .swap-v2__form-label').childAt(1).text(), 'Mock Custom Label Content')
    })
  })
})
