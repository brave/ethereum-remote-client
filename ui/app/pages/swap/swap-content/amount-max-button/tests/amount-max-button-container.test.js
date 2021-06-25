import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

let mapStateToProps
let mapDispatchToProps

const actionSpies = {
  computeSwapErrors: sinon.spy(),
  updateSwapAmount: sinon.spy(),
}

proxyquire('../amount-max-button.container.js', {
  'react-redux': {
    connect: (ms, md) => {
      mapStateToProps = ms
      mapDispatchToProps = md
      return () => ({})
    },
  },
  '../../../../selectors': {
    getSelectedAccount: (s) => `mockAccount:${s}`,
    getSwapFromAsset: (s) => `mockFromAsset:${s}`,
    getSwapToAsset: (s) => `mockToAsset:${s}`,
    getSwapQuoteEstimatedGasCost: (s) => `mockEstimatedGasCost:${s}`,
    getSwapFromTokenAssetBalance: (s) => `mockFromTokenAssetBalance:${s}`,
  },
  '../../../../store/actions': actionSpies,
})

describe('amount-max-button container', function () {
  describe('mapStateToProps()', function () {
    it('should map the correct properties to props', function () {
      assert.deepStrictEqual(mapStateToProps('mockState'), {
        account: 'mockAccount:mockState',
        fromAsset: 'mockFromAsset:mockState',
        toAsset: 'mockToAsset:mockState',
        estimatedGasCost: 'mockEstimatedGasCost:mockState',
        fromTokenAssetBalance: 'mockFromTokenAssetBalance:mockState',
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

    describe('setAmount()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.setAmount(11).then(function () {
          assert(dispatchSpy.calledTwice)

          assert(actionSpies.computeSwapErrors.calledOnce)
          assert.deepStrictEqual(
            actionSpies.computeSwapErrors.getCall(0).args,
            [{ amount: 11 }],
          )

          assert(actionSpies.updateSwapAmount.calledOnce)
          assert.deepStrictEqual(actionSpies.updateSwapAmount.getCall(0).args, [
            11,
          ])
        })
      })
    })
  })
})
