import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

let mapStateToProps
let mapDispatchToProps

const actionSpies = {
  setMaxModeTo: sinon.spy(),
  updateSwapAmount: sinon.spy(),
}
const duckActionSpies = {
  updateSwapErrors: sinon.spy(),
}

proxyquire('../amount-max-button.container.js', {
  'react-redux': {
    connect: (ms, md) => {
      mapStateToProps = ms
      mapDispatchToProps = md
      return () => ({})
    },
  },
  '../../../../../selectors': {
    getGasTotal: (s) => `mockGasTotal:${s}`,
    getSwapToken: (s) => `mockSwapToken:${s}`,
    getSwapFromBalance: (s) => `mockBalance:${s}`,
    getSwapTokenBalance: (s) => `mockTokenBalance:${s}`,
    getSwapMaxModeState: (s) => `mockMaxModeOn:${s}`,
    getBasicGasEstimateLoadingStatus: (s) => `mockButtonDataLoading:${s}`,
  },
  './amount-max-button.utils.js': { calcMaxAmount: (mockObj) => mockObj.val + 1 },
  '../../../../../store/actions': actionSpies,
  '../../../../../ducks/swap/swap.duck': duckActionSpies,
})

describe('amount-max-button container', function () {

  describe('mapStateToProps()', function () {

    it('should map the correct properties to props', function () {
      assert.deepEqual(mapStateToProps('mockState'), {
        balance: 'mockBalance:mockState',
        buttonDataLoading: 'mockButtonDataLoading:mockState',
        gasTotal: 'mockGasTotal:mockState',
        maxModeOn: 'mockMaxModeOn:mockState',
        swapFromToken: 'mockSwapToken:mockState',
        tokenBalance: 'mockTokenBalance:mockState',
      })
    })

  })

  describe('mapDispatchToProps()', function () {
    let dispatchSpy
    let mapDispatchToPropsObject

    beforeEach(function () {
      dispatchSpy = sinon.spy()
      mapDispatchToPropsObject = mapDispatchToProps(dispatchSpy)
    })

    describe('setAmountToMax()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.setAmountToMax({ val: 11, foo: 'bar' })
        assert(dispatchSpy.calledTwice)
        assert(duckActionSpies.updateSwapErrors.calledOnce)
        assert.deepEqual(
          duckActionSpies.updateSwapErrors.getCall(0).args[0],
          { amount: null },
        )
        assert(actionSpies.updateSwapAmount.calledOnce)
        assert.equal(
          actionSpies.updateSwapAmount.getCall(0).args[0],
          12,
        )
      })
    })

    describe('setMaxModeTo()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.setMaxModeTo('mockVal')
        assert(dispatchSpy.calledOnce)
        assert.equal(
          actionSpies.setMaxModeTo.getCall(0).args[0],
          'mockVal',
        )
      })
    })

  })

})
