import React from 'react'
import assert from 'assert'
import { mount } from 'enzyme'
import MetaFoxLogo from '..'

describe('MetaFoxLogo', function () {

  it('MetaFox logo does not render', function () {
    const wrapper = mount(
      <MetaFoxLogo />,
    )

    assert.equal(wrapper.find('img.app-header__metafox-logo--icon').length, 0)
    assert.equal(wrapper.find('img.app-header__metafox-logo--icon').length, 0)
  })
})
