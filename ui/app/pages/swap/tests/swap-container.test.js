import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

let mapDispatchToProps

const actionSpies = {
  updateSwapTokenBalance: sinon.spy(),
  updateGasData: sinon.spy(),
  setGasTotal: sinon.spy(),
}
const duckActionSpies = {
  updateSwapErrors: sinon.spy(),
  resetSwapState: sinon.spy(),
}

proxyquire('../swap.container.js', {
  'react-redux': {
    connect: (_, md) => {
      mapDispatchToProps = md
      return () => ({})
    },
  },
  'react-router-dom': { withRouter: () => {} },
  'redux': { compose: (_, arg2) => () => arg2() },
  '../../store/actions': actionSpies,
  '../../ducks/swap/swap.duck': duckActionSpies,
  './swap.utils.js': {
    calcGasTotal: (gasLimit, gasPrice) => gasLimit + gasPrice,
  },

})

describe('swap container', function () {

  describe('mapDispatchToProps()', function () {
    let dispatchSpy
    let mapDispatchToPropsObject

    beforeEach(function () {
      dispatchSpy = sinon.spy()
      mapDispatchToPropsObject = mapDispatchToProps(dispatchSpy)
    })

    describe('updateAndSetGasLimit()', function () {
      const mockProps = {
        blockGasLimit: 'mockBlockGasLimit',
        editingTransactionId: '0x2',
        gasLimit: '0x3',
        gasPrice: '0x4',
        selectedAddress: '0x4',
        swapToken: { address: '0x1' },
        to: 'mockTo',
        value: 'mockValue',
        data: undefined,
      }

      it('should dispatch a setGasTotal action when editingTransactionId is truthy', function () {
        mapDispatchToPropsObject.updateAndSetGasLimit(mockProps)
        assert(dispatchSpy.calledOnce)
        assert.equal(
          actionSpies.setGasTotal.getCall(0).args[0],
          '0x30x4',
        )
      })

      it('should dispatch an updateGasData action when editingTransactionId is falsy', function () {
        const { gasPrice, selectedAddress, swapToken, blockGasLimit, to, value, data } = mockProps
        mapDispatchToPropsObject.updateAndSetGasLimit(
          Object.assign({}, mockProps, { editingTransactionId: false }),
        )
        assert(dispatchSpy.calledOnce)
        assert.deepEqual(
          actionSpies.updateGasData.getCall(0).args[0],
          { gasPrice, selectedAddress, swapToken, blockGasLimit, to, value, data },
        )
      })
    })

    describe('updateSwapTokenBalance()', function () {
      const mockProps = {
        address: '0x10',
        tokenContract: '0x00a',
        swapToken: { address: '0x1' },
      }

      it('should dispatch an action', function () {
        mapDispatchToPropsObject.updateSwapTokenBalance(Object.assign({}, mockProps))
        assert(dispatchSpy.calledOnce)
        assert.deepEqual(
          actionSpies.updateSwapTokenBalance.getCall(0).args[0],
          mockProps,
        )
      })
    })

    describe('updateSwapErrors()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.updateSwapErrors('mockError')
        assert(dispatchSpy.calledOnce)
        assert.equal(
          duckActionSpies.updateSwapErrors.getCall(0).args[0],
          'mockError',
        )
      })
    })

    describe('resetSwapState()', function () {
      it('should dispatch an action', function () {
        mapDispatchToPropsObject.resetSwapState()
        assert(dispatchSpy.calledOnce)
        assert.equal(
          duckActionSpies.resetSwapState.getCall(0).args.length,
          0,
        )
      })
    })

  })

})
