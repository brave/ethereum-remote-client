import assert from 'assert'
import proxyquire from 'proxyquire'

let mapStateToProps

proxyquire('../swap-row-error-message.container.js', {
  'react-redux': {
    connect: (ms) => {
      mapStateToProps = ms
      return () => ({})
    },
  },
  '../../../../../selectors': { getSwapErrors: (s) => `mockErrors:${s}` },
})

describe('swap-row-error-message container', function () {

  describe('mapStateToProps()', function () {

    it('should map the correct properties to props', function () {
      assert.deepEqual(mapStateToProps('mockState', { errorType: 'someType' }), {
        errors: 'mockErrors:mockState',
        errorType: 'someType' })
    })

  })

})
