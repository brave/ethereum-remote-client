import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import SwapHeader from '../swap-header.component.js'
import PageContainerHeader from '../../../../components/ui/page-container/page-container-header'

describe('SendHeader Component', function () {
  let wrapper

  beforeEach(function () {
    wrapper = shallow((
      <SwapHeader
        titleKey="mockTitleKey"
      />
    ), { context: { t: (str1, str2) => (str2 ? str1 + str2 : str1) } })
  })

  describe('render', function () {
    it('should render a PageContainerHeader component', function () {
      assert.strictEqual(wrapper.find(PageContainerHeader).length, 1)
    })

    it('should pass the correct props to PageContainerHeader', function () {
      const {
        title,
      } = wrapper.find(PageContainerHeader).props()
      assert.strictEqual(title, 'mockTitleKey')
    })
  })
})
