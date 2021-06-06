import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

let mapStateToProps
let mapDispatchToProps

const actionSpies = {
  createTransaction: sinon.spy(),
  approveAllowance: sinon.spy(),
  showLoadingIndication: sinon.spy(),
}
const spyObjs = Object.values(actionSpies)

proxyquire('../swap-footer.container.js', {
  'react-redux': {
    connect: (ms, md) => {
      mapStateToProps = ms
      mapDispatchToProps = md
      return () => ({})
    },
  },
  '../../../selectors': {
    getSwapErrors: (s) => `mockSwapErrors:${s}`,
    isSwapFormInError: (s) => `mockInError:${s}`,
    getSwapTransactionObject: (s) => `mockTransaction:${s}`,
    isSwapFromTokenAssetAllowanceEnough: (s) =>
      `mockIsSwapFromTokenAssetAllowanceEnough:${s}`,
    getSwapFromAsset: (s) => `mockFromAsset:${s}`,
  },
  '../../../store/actions': actionSpies,
})

describe('swap-footer container', function () {
  describe('mapStateToProps()', function () {
    it('should map the correct properties to props', function () {
      assert.deepStrictEqual(mapStateToProps('mockState'), {
        swapErrors: 'mockSwapErrors:mockState',
        inError: 'mockInError:mockState',
        transaction: 'mockTransaction:mockState',
        isSwapFromTokenAssetAllowanceEnough:
          'mockIsSwapFromTokenAssetAllowanceEnough:mockState',
        fromAsset: 'mockFromAsset:mockState',
      })
    })
  })

  describe('mapDispatchToProps()', function () {
    let dispatchSpy
    let mapDispatchToPropsObject

    beforeEach(function () {
      dispatchSpy = sinon.spy()
      mapDispatchToPropsObject = mapDispatchToProps(dispatchSpy)

      spyObjs.forEach((actionSpy) => actionSpy.resetHistory())
    })

    describe('sign()', function () {
      it('should dispatch the right actions', function () {
        mapDispatchToPropsObject
          .sign('mockTransactionParams')
          .then(function () {
            assert(dispatchSpy.calledTwice)
            assert(actionSpies.createTransaction.calledOnce)
            assert(actionSpies.showLoadingIndication.calledOnce)
            assert.deepStrictEqual(
              actionSpies.createTransaction.getCall(0).args,
              ['mockTransactionParams'],
            )
          })
      })
    })

    describe('approve()', function () {
      it('should dispatch the right actions', function () {
        mapDispatchToPropsObject.approve('mockAllowance').then(function () {
          assert(dispatchSpy.calledTwice)
          assert(actionSpies.approveAllowance.calledOnce)
          assert(actionSpies.showLoadingIndication.calledOnce)
          assert.deepStrictEqual(actionSpies.approveAllowance.getCall(0).args, [
            'mockAllowance',
          ])
        })
      })
    })
  })
})
