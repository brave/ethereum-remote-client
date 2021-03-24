import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'

import SwapScreen from '../swap.component'
import SwapHeader from '../swap-header/swap-header.container'
import SwapContent from '../swap-content/swap-content.container'
import SwapFooter from '../swap-footer/swap-footer.container'

describe('Swap Component', function () {
  let wrapper

  beforeEach(function () {
    wrapper = shallow((
      <SwapScreen
        history={{ mockProp: 'history-abc' }}
      />
    ))
  })

  describe('render', function () {
    it('should render a page-container class', function () {
      assert.strictEqual(wrapper.find('.page-container').length, 1)
    })

    it('should render SwapHeader', function () {
      assert.strictEqual(wrapper.find(SwapHeader).length, 1)
    })

    it('should pass the history prop to SwapHeader and SwapFooter', function () {
      assert.strictEqual(wrapper.find(SwapHeader).length, 1)
      assert.strictEqual(wrapper.find(SwapContent).length, 1)
      assert.strictEqual(wrapper.find(SwapFooter).length, 1)
      assert.deepStrictEqual(
        wrapper.find(SwapFooter).props(),
        {
          history: { mockProp: 'history-abc' },
        },
      )
    })
  })
})
