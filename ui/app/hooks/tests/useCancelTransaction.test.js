import * as reactRedux from 'react-redux'
import assert from 'assert'
import { renderHook } from '@testing-library/react-hooks'
import sinon from 'sinon'
import transactions from '../../../../test/data/transaction-data.json'
import { getConversionRate, getSelectedAccount } from '../../selectors'
import { useCancelTransaction } from '../useCancelTransaction'
import { showModal } from '../../store/actions'
import { increaseLastGasPrice } from '../../helpers/utils/confirm-tx.util'


describe('useCancelTransaction', function () {
  let useSelector
  const dispatch = sinon.spy()

  before(function () {
    sinon.stub(reactRedux, 'useDispatch').returns(dispatch)
  })

  afterEach(function () {
    dispatch.resetHistory()
  })

  describe('when account has insufficient balance to cover gas', function () {
    before(function () {
      useSelector = sinon.stub(reactRedux, 'useSelector')
      useSelector.callsFake((selector) => {
        if (selector === getConversionRate) {
          return 280.46
        } else if (selector === getSelectedAccount) {
          return {
            balance: '0x3',
          }
        }
      })
    })
    transactions.forEach((transactionGroup) => {
      const originalGasPrice = transactionGroup.primaryTransaction.txParams?.gasPrice
      const customGasParams = {
        gasPrice: originalGasPrice && increaseLastGasPrice(originalGasPrice),
        gasLimit: transactionGroup.primaryTransaction.txParams?.gas,
      }

      const transactionId = transactionGroup.primaryTransaction.id
      it(`should indicate account has insufficient funds to cover ${customGasParams.gasPrice} gas price`, function () {
        const { result } = renderHook(() => useCancelTransaction(transactionGroup))
        assert.equal(result.current[0], false)
      })

      it(`should return a function that kicks off cancellation for id ${transactionId}`, function () {
        const { result } = renderHook(() => useCancelTransaction(transactionGroup))
        assert.equal(typeof result.current[1], 'function')
        result.current[1]({ preventDefault: () => {}, stopPropagation: () => {} })
        assert.equal(
          dispatch.calledWith(
            showModal({
              name: 'CANCEL_TRANSACTION',
              transactionId,
              customGasParams,
            }),
          ),
          true,
        )
      })
    })
    after(function () {
      useSelector.restore()
    })
  })


  describe('when account has sufficient balance to cover gas', function () {
    before(function () {
      useSelector = sinon.stub(reactRedux, 'useSelector')
      useSelector.callsFake((selector) => {
        if (selector === getConversionRate) {
          return 280.46
        } else if (selector === getSelectedAccount) {
          return {
            balance: '0x9C2007651B2500000',
          }
        }
      })
    })
    transactions.forEach((transactionGroup) => {
      const originalGasPrice = transactionGroup.primaryTransaction.txParams?.gasPrice
      const customGasParams = {
        gasPrice: originalGasPrice && increaseLastGasPrice(originalGasPrice),
        gasLimit: transactionGroup.primaryTransaction.txParams?.gas,
      }
      const transactionId = transactionGroup.primaryTransaction.id
      it(`should indicate account has funds to cover ${customGasParams.gasPrice} gas price`, function () {
        const { result } = renderHook(() => useCancelTransaction(transactionGroup))
        assert.equal(result.current[0], true)
      })
      it(`should return a function that kicks off cancellation for id ${transactionId}`, function () {
        const { result } = renderHook(() => useCancelTransaction(transactionGroup))
        assert.equal(typeof result.current[1], 'function')
        result.current[1]({ preventDefault: () => {}, stopPropagation: () => {} })
        assert.equal(
          dispatch.calledWith(
            showModal({
              name: 'CANCEL_TRANSACTION',
              transactionId,
              customGasParams,
            }),
          ),
          true,
        )
      })
    })
    after(function () {
      useSelector.restore()
    })
  })


  after(function () {
    sinon.restore()
  })
})
