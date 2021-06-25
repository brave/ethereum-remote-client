import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

let mapStateToProps
let mapDispatchToProps

const actionSpies = {
  computeSwapErrors: sinon.spy(),
  updateSwapAmount: sinon.spy(),
}

proxyquire('../swap-amount-row.container.js', {
  'react-redux': {
    connect: (ms, md) => {
      mapStateToProps = ms
      mapDispatchToProps = md
      return () => ({})
    },
  },
  '../../../../selectors': {
    getSwapAmount: (s) => `mockAmount:${s}`,
    getSwapFromAsset: (s) => `mockFromAsset:${s}`,
    getSwapToAsset: (s) => `mockToAsset:${s}`,
    getSwapQuoteEstimatedGasCost: (s) => `mockEstimatedGasCost:${s}`,
  },
  '../../../../store/actions': actionSpies,
})

describe('swap-amount-row container', function () {
  describe('mapStateToProps()', function () {
    it('should map the correct properties to props', function () {
      assert.deepStrictEqual(mapStateToProps('mockState'), {
        amount: 'mockAmount:mockState',
        fromAsset: 'mockFromAsset:mockState',
        toAsset: 'mockToAsset:mockState',
        estimatedGasCost: 'mockEstimatedGasCost:mockState',
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

    describe('updateSwapAmount()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.updateSwapAmount('mockAmount')
        assert(dispatchSpy.calledOnce)
        assert(actionSpies.updateSwapAmount.calledOnce)
        assert.deepStrictEqual(actionSpies.updateSwapAmount.getCall(0).args, [
          'mockAmount',
        ])
      })
    })

    describe('computeSwapErrors()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.computeSwapErrors('mockOverrides')
        assert(dispatchSpy.calledOnce)
        assert(actionSpies.computeSwapErrors.calledOnce)
        assert.deepStrictEqual(actionSpies.computeSwapErrors.getCall(0).args, [
          'mockOverrides',
        ])
      })
    })
  })
})
