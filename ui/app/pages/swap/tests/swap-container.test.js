import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

let mapStateToProps
let mapDispatchToProps


const duckActionSpies = {
  resetSwapState: sinon.spy(),
}

proxyquire('../swap.container.js', {
  'react-redux': {
    connect: (ms, md) => {
      mapDispatchToProps = md
      mapStateToProps = ms
      return () => ({})
    },
  },
  'react-router-dom': {
    withRouter: () => {
    },
  },
  redux: { compose: (_, arg2) => () => arg2() },
  '../../ducks/swap/swap.duck': duckActionSpies,
})

describe('Swap container', function () {
  describe('mapStateToProps()', function () {
    it('should map the correct properties to props', function () {
      assert.deepStrictEqual(mapStateToProps('mockState'), {})
    })
  })

  describe('mapDispatchToProps()', function () {
    let dispatchSpy
    let mapDispatchToPropsObject

    beforeEach(function () {
      dispatchSpy = sinon.spy()
      mapDispatchToPropsObject = mapDispatchToProps(dispatchSpy)
    })

    describe('resetSwapState()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.resetSwapState()
        assert(dispatchSpy.calledOnce)
        assert.strictEqual(
          duckActionSpies.resetSwapState.getCall(0).args.length,
          0,
        )
      })
    })
  })
})
