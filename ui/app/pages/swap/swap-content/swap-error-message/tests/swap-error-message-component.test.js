import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import SwapRowErrorMessage from '../swap-error-message.component.js'

describe('SwapRowErrorMessage Component', function () {
  let wrapper

  describe('render', function () {
    beforeEach(function () {
      wrapper = shallow((
        <SwapRowErrorMessage
          errors={{ error1: 'abc', error2: 'def' }}
          errorType="error3"
        />
      ), { context: { t: (str) => str + '_t' } })
    })

    it('should render null if the passed errors do not contain an error of errorType', function () {
      assert.equal(wrapper.find('.swap-v2__error').length, 0)
      assert.equal(wrapper.html(), null)
    })

    it('should render an error message if the passed errors contain an error of errorType', function () {
      wrapper.setProps({ errors: { error1: 'abc', error2: 'def', error3: 'xyz' } })
      assert.equal(wrapper.find('.swap-v2__error').length, 1)
      assert.equal(wrapper.find('.swap-v2__error').text(), 'xyz_t')
    })
  })
})
