import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

import { BAT, ETH } from './swap-utils.test'

let mapStateToProps
let mapDispatchToProps


const duckActionSpies = {
  resetSwapState: sinon.spy(),
}

const actionSpies = {
  fetchSwapQuote: sinon.spy(),
  hideLoadingIndication: sinon.spy(),
  showLoadingIndication: sinon.spy(),
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
  '../../selectors': {
    getSwapFromAsset: (s) => `mockSwapFromAsset:${s}`,
    getSwapToAsset: (s) => `mockSwapToAsset:${s}`,
    getSwapAmount: (s) => `mockSwapAmount:${s}`,
    getSwapQuote: (s) => `mockSwapQuote:${s}`,
    getCustomGasPrice: (s) => `mockGlobalGasPrice:${s}`,
    getSwapQuoteGasPrice: (s) => `mockSwapQuoteGasPrice:${s}`,
  },
  '../../store/actions': actionSpies,
})

describe('Swap container', function () {
  describe('mapStateToProps()', function () {
    it('should map the correct properties to props', function () {
      assert.deepStrictEqual(mapStateToProps('mockState'), {
        fromAsset: 'mockSwapFromAsset:mockState',
        toAsset: 'mockSwapToAsset:mockState',
        amount: `mockSwapAmount:mockState`,
        quote: `mockSwapQuote:mockState`,
        globalGasPrice: `mockGlobalGasPrice:mockState`,
        quoteGasPrice: `mockSwapQuoteGasPrice:mockState`,
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

    describe('fetchSwapQuote()', function () {
      it('should dispatch an action - showLoading=false', async function () {
        await mapDispatchToPropsObject.fetchSwapQuote(
          ETH, BAT, 'mockAmount', 'mockGasPrice', false, false,
        )
        assert(dispatchSpy.calledOnce)
        assert.deepStrictEqual(
          actionSpies.fetchSwapQuote.getCall(0).args,
          [ETH, BAT, 'mockAmount', 'mockGasPrice', false],
        )
      })

      it('should dispatch an action - showLoading=true', async function () {
        await mapDispatchToPropsObject.fetchSwapQuote(
          ETH, BAT, 'mockAmount', 'mockGasPrice', true, false,
        )
        assert(dispatchSpy.calledThrice)
        assert.deepStrictEqual(
          actionSpies.fetchSwapQuote.getCall(0).args,
          [ETH, BAT, 'mockAmount', 'mockGasPrice', false],
        )
        assert(actionSpies.hideLoadingIndication.calledOnce)
        assert(actionSpies.showLoadingIndication.calledOnce)
      })
    })
  })
})
