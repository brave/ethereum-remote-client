import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

let mapDispatchToProps

const actionSpies = {
  setMaxModeTo: sinon.spy(),
  updateSwapAmount: sinon.spy(),
}
const duckActionSpies = {
  updateSwapErrors: sinon.spy(),
}

proxyquire('../swap-amount-row.container.js', {
  'react-redux': {
    connect: (_, md) => {
      mapDispatchToProps = md
      return () => ({})
    },
  },
  '../../../../selectors': { swapAmountIsInError: (s) => `mockInError:${s}` },
  '../../swap.utils': {
    getAmountErrorObject: (mockDataObject) => ({ ...mockDataObject, mockChange: true }),
    getGasFeeErrorObject: (mockDataObject) => ({ ...mockDataObject, mockGasFeeErrorChange: true }),
  },
  '../../../../store/actions': actionSpies,
  '../../../../ducks/swap/swap.duck': duckActionSpies,
})

describe('swap-amount-row container', function () {

  describe('mapDispatchToProps()', function () {
    let dispatchSpy
    let mapDispatchToPropsObject

    beforeEach(function () {
      dispatchSpy = sinon.spy()
      mapDispatchToPropsObject = mapDispatchToProps(dispatchSpy)
      duckActionSpies.updateSwapErrors.resetHistory()
    })

    describe('setMaxModeTo()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.setMaxModeTo('mockBool')
        assert(dispatchSpy.calledOnce)
        assert(actionSpies.setMaxModeTo.calledOnce)
        assert.equal(
          actionSpies.setMaxModeTo.getCall(0).args[0],
          'mockBool',
        )
      })
    })

    describe('updateSwapAmount()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.updateSwapAmount('mockAmount')
        assert(dispatchSpy.calledOnce)
        assert(actionSpies.updateSwapAmount.calledOnce)
        assert.equal(
          actionSpies.updateSwapAmount.getCall(0).args[0],
          'mockAmount',
        )
      })
    })

    describe('updateGasFeeError()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.updateGasFeeError({ some: 'data' })
        assert(dispatchSpy.calledOnce)
        assert(duckActionSpies.updateSwapErrors.calledOnce)
        assert.deepEqual(
          duckActionSpies.updateSwapErrors.getCall(0).args[0],
          { some: 'data', mockGasFeeErrorChange: true },
        )
      })
    })

    describe('updateSwapAmountError()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.updateSwapAmountError({ some: 'data' })
        assert(dispatchSpy.calledOnce)
        assert(duckActionSpies.updateSwapErrors.calledOnce)
        assert.deepEqual(
          duckActionSpies.updateSwapErrors.getCall(0).args[0],
          { some: 'data', mockChange: true },
        )
      })
    })

  })

})
