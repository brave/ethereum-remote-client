import assert from 'assert'
import sinon from 'sinon'
import proxyquire from 'proxyquire'
import {
  BALANCE_FETCH_ERROR,
  INSUFFICIENT_FUNDS_ERROR,
  INSUFFICIENT_FUNDS_GAS_ERROR,
  INSUFFICIENT_TOKENS_ERROR,
} from '../swap.constants'
import itParam from 'mocha-param'

export const ETH = {
  name: 'Ether',
  address: '',
  symbol: 'ETH',
  decimals: 18,
}

export const BAT = {
  name: 'Basic Attention Token',
  address: '0xDEADBEEF',
  symbol: 'BAT',
  decimals: 18,
}

const stubs = {
  multiplyCurrencies: sinon.stub().callsFake((a, b) => `${a}x${b}`),
  calcTokenAmount: sinon.stub().callsFake((a, d) => 'calc:' + a + d),
  rawEncode: sinon.stub().returns([16, 1100]),
  conversionGreaterThan: sinon
    .stub()
    .callsFake((obj1, obj2) => obj1.value > obj2.value),
  conversionLessThan: sinon
    .stub()
    .callsFake((obj1, obj2) => obj1.value < obj2.value),
}

const swapUtils = proxyquire('../swap.utils.js', {
  '../../helpers/utils/conversion-util': {
    multiplyCurrencies: stubs.multiplyCurrencies,
    conversionGreaterThan: stubs.conversionGreaterThan,
    conversionLessThan: stubs.conversionLessThan,
  },
  '../../helpers/utils/token-util': { calcTokenAmount: stubs.calcTokenAmount },
  'ethereumjs-abi': {
    rawEncode: stubs.rawEncode,
  },
})

const {
  estimateGasForTransaction,
  getAmountErrorObject,
  getGasFeeErrorObject,
  calcTokenBalance,
  isBalanceSufficient,
  isTokenBalanceSufficient,
} = swapUtils

describe('Swap utils', function () {
  describe('getAmountErrorObject()', function () {
    const cases = [
      {
        name: 'should return balanceFetchError for BAT if tokenBalance is null',
        props: {
          amount: 'f',
          balance: '1',
          conversionRate: 3,
          estimatedGasCost: '0',
          fromAsset: BAT,
          tokenBalance: null,
        },
        expected: { amount: BALANCE_FETCH_ERROR },
      },
      {
        name:
          'should return insufficientFunds for ETH if not enough balance and estimatedGasCost=null',
        props: {
          amount: 'f',
          balance: '1',
          conversionRate: 3,
          estimatedGasCost: null,
          fromAsset: ETH,
        },
        expected: { amount: INSUFFICIENT_FUNDS_ERROR },
      },
      {
        name: 'should handle null ETH amount',
        props: {
          amount: null,
          balance: '1',
          conversionRate: 3,
          estimatedGasCost: null,
          fromAsset: ETH,
        },
        expected: { amount: null },
      },
      {
        name: 'should handle null BAT amount',
        props: {
          amount: null,
          balance: '1',
          conversionRate: 3,
          estimatedGasCost: null,
          fromAsset: BAT,
          tokenBalance: 'f',
        },
        expected: { amount: null },
      },
      {
        name:
          'should return insufficientFunds for ETH if balance is not enough',
        props: {
          amount: 'f',
          balance: '1',
          conversionRate: 3,
          estimatedGasCost: 'e',
          fromAsset: ETH,
        },
        expected: { amount: INSUFFICIENT_FUNDS_ERROR },
      },
      {
        name: 'should return no error for ETH if balance is enough',
        props: {
          amount: '1',
          balance: 'f',
          conversionRate: 3,
          estimatedGasCost: 'e',
          fromAsset: ETH,
        },
        expected: { amount: null },
      },
      {
        name:
          'should return insufficientTokens error for BAT if balance is not enough',
        props: {
          amount: 'f',
          balance: '1',
          conversionRate: 3,
          estimatedGasCost: 'e',
          fromAsset: BAT,
        },
        expected: { amount: INSUFFICIENT_TOKENS_ERROR },
      },
      {
        name: 'should return no error for BAT if balance is enough',
        props: {
          amount: '1',
          balance: 'e',
          tokenBalance: 'f',
          conversionRate: 3,
          estimatedGasCost: 'e',
          fromAsset: BAT,
        },
        expected: { amount: null },
      },
    ]

    itParam('${value.name}', cases, function ({ props, expected }) {
      assert.deepStrictEqual(getAmountErrorObject(props), expected)
    })
  })

  describe('getGasFeeErrorObject()', function () {
    const cases = [
      {
        name: 'should return no error if conversionRate is null',
        props: {
          amount: '0',
          balance: '10',
          conversionRate: null,
          estimatedGasCost: '11',
          fromAsset: ETH,
        },
        expected: { gasFee: null },
      },
      {
        name: 'should return insufficientFundsGas error if balance is 0',
        props: {
          amount: '0',
          balance: '0',
          conversionRate: '1',
          estimatedGasCost: '11',
          fromAsset: ETH,
        },
        expected: { gasFee: INSUFFICIENT_FUNDS_GAS_ERROR },
      },
      {
        name: 'should return null error if ETH balance is sufficient',
        props: {
          amount: '4e20',
          balance: '5208',
          conversionRate: '1',
          estimatedGasCost: '3e8',
          fromAsset: ETH,
        },
        expected: { gasFee: null },
      },
      {
        name: 'should return null error for BAT if gas is sufficient',
        props: {
          amount: '186a0',
          balance: '5208',
          conversionRate: '1',
          estimatedGasCost: '3e8',
          fromAsset: BAT,
        },
        expected: { gasFee: null },
      },
      {
        name:
          'should return insufficientFundsGas error for BAT if gas is insufficient',
        props: {
          amount: '186a0',
          balance: '3e8',
          conversionRate: '1',
          estimatedGasCost: '5208',
          fromAsset: BAT,
        },
        expected: { gasFee: INSUFFICIENT_FUNDS_GAS_ERROR },
      },
      {
        name: 'should not break if estimatedGas unavailable',
        props: {
          amount: '186a0',
          balance: '3e8',
          conversionRate: '1',
          estimatedGasCost: null,
          fromAsset: BAT,
        },
        expected: { gasFee: null },
      },
    ]

    itParam('${value.name}', cases, function ({ props, expected }) {
      assert.deepStrictEqual(getGasFeeErrorObject(props), expected)
    })
  })

  describe('calcTokenBalance()', function () {
    it('should return the calculated token balance', function () {
      assert.strictEqual(
        calcTokenBalance({
          swapFromToken: {
            address: '0x0',
            decimals: 11,
          },
          usersToken: {
            balance: 20,
          },
        }),
        'calc:2011',
      )
    })
  })

  describe('isBalanceSufficient()', function () {
    it('should correctly call addCurrencies and return the result of calling conversionGTE', function () {
      const result = isBalanceSufficient({
        amount: '4e20',
        balance: '5208',
        conversionRate: 3,
        estimatedGasCost: '3e8',
        primaryCurrency: 'ABC',
      })
      assert.strictEqual(result, true)
    })
  })

  describe('isTokenBalanceSufficient()', function () {
    it('should return the result of calling isTokenBalanceSufficient', function () {
      const result = isTokenBalanceSufficient({
        tokenBalance: '4e20',
        amount: '5208',
      })
      assert.strictEqual(result, false)
    })
  })

  describe('estimateGasForTransaction', function () {
    const baseMockParams = {
      blockGasLimit: '0x64',
      transaction: {
        to: '0xisContract',
        from: 'mockAddress',
        value: 'mockValue',
        gasPrice: 'mockGasPrice',
        data: 'mockData',
      },
      estimateGasMethod: sinon.stub().callsFake(({ to }) => {
        if (typeof to === 'string' && to.match(/willFailBecauseOf:/)) {
          throw new Error(to.match(/:(.+)$/)[1])
        }
        return { toString: (n) => `0xabc${n}` }
      }),
    }
    const baseExpectedCall = {
      from: 'mockAddress',
      gas: '0x64x0.95',
      to: '0xisContract',
      value: 'mockValue',
      data: 'mockData',
      gasPrice: 'mockGasPrice',
    }

    afterEach(function () {
      baseMockParams.estimateGasMethod.resetHistory()
    })

    it('should call ethQuery.estimateGas with the expected params', async function () {
      const result = await estimateGasForTransaction(baseMockParams)
      assert.strictEqual(baseMockParams.estimateGasMethod.callCount, 1)
      assert.deepStrictEqual(
        baseMockParams.estimateGasMethod.getCall(0).args[0],
        Object.assign(
          { gasPrice: undefined, value: undefined },
          baseExpectedCall,
        ),
      )
      assert.strictEqual(result, '0xabc16')
    })

    it('should call ethQuery.estimateGas with the expected params when initialGasLimitHex is lower than the upperGasLimit', async function () {
      const result = await estimateGasForTransaction(
        Object.assign({}, baseMockParams, { blockGasLimit: '0xbcd' }),
      )
      assert.strictEqual(baseMockParams.estimateGasMethod.callCount, 1)
      assert.deepStrictEqual(
        baseMockParams.estimateGasMethod.getCall(0).args[0],
        Object.assign(
          { gasPrice: undefined, value: undefined },
          baseExpectedCall,
          { gas: '0xbcdx0.95' },
        ),
      )
      assert.strictEqual(result, '0xabc16x1.5')
    })

    it(`should return the adjusted blockGasLimit if it fails with a 'Transaction execution error.'`, async function () {
      const result = await estimateGasForTransaction({
        ...baseMockParams,
        transaction: {
          ...baseMockParams.transaction,
          to: 'isContract willFailBecauseOf:Transaction execution error.',
        },
      })
      assert.strictEqual(result, '0x64x0.95')
    })

    it(`should return the adjusted blockGasLimit if it fails with a 'gas required exceeds allowance or always failing transaction.'`, async function () {
      const result = await estimateGasForTransaction({
        ...baseMockParams,
        transaction: {
          ...baseMockParams.transaction,
          to:
            'isContract willFailBecauseOf:gas required exceeds allowance or always failing transaction.',
        },
      })

      assert.strictEqual(result, '0x64x0.95')
    })

    it(`should reject other errors`, async function () {
      try {
        await estimateGasForTransaction({
          ...baseMockParams,
          transaction: {
            ...baseMockParams.transaction,
            to: 'isContract willFailBecauseOf:some other error',
          },
        })
      } catch (err) {
        assert.strictEqual(err.message, 'some other error')
      }
    })
  })
})
