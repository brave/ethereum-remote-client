import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

let mapDispatchToProps

const actionSpies = {
  clearSwap: sinon.spy(),
}

proxyquire('../swap-footer.container.js', {
  'react-redux': {
    connect: (_, md) => {
      mapDispatchToProps = md
      return () => ({})
    },
  },
  '../../../store/actions': actionSpies,
})

describe('swap-footer container', function () {

  describe('mapDispatchToProps()', function () {
    let dispatchSpy
    let mapDispatchToPropsObject

    beforeEach(function () {
      dispatchSpy = sinon.spy()
      mapDispatchToPropsObject = mapDispatchToProps(dispatchSpy)
    })

    describe('clearSwap()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.clearSwap()
        assert(dispatchSpy.calledOnce)
        assert(actionSpies.clearSwap.calledOnce)
      })
    })
  })
})
