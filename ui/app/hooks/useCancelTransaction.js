import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'
import { showModal } from '../store/actions'
import { isBalanceSufficient } from '../pages/send/send.utils'
import { getHexGasTotal } from '../helpers/utils/confirm-tx.util'
import {
  getAveragePriceEstimateInHexWEI,
  getBaseFeePerGas,
  getConversionRate,
  getSelectedAccount,
} from '../selectors'
import { useIncrementedGasFees } from './useIncrementedFees'
import { addCurrencies } from '../helpers/utils/conversion-util'
import { hasEIP1559GasFields } from '../helpers/utils/transactions.util'


/**
 * Determine whether a transaction can be cancelled and provide a method to
 * kick off the process of cancellation.
 *
 * Provides a reusable hook that, given a transactionGroup, will return
 * whether or not the account has enough funds to cover the gas cancellation
 * fee, and a method for beginning the cancellation process
 * @param {Object} transactionGroup
 * @return {[boolean, Function]}
 */
export function useCancelTransaction (transactionGroup) {
  const { primaryTransaction } = transactionGroup
  const transactionId = primaryTransaction.id
  const dispatch = useDispatch()
  const selectedAccount = useSelector(getSelectedAccount)
  const conversionRate = useSelector(getConversionRate)

  const baseFeePerGas = useSelector(getBaseFeePerGas) || '0x0'
  const suggestedMaxPriorityFeePerGas = useSelector(getAveragePriceEstimateInHexWEI)
  const baseGasParams = useIncrementedGasFees(transactionGroup, suggestedMaxPriorityFeePerGas)

  const customGasParams = useMemo(() => {
    if (hasEIP1559GasFields(primaryTransaction)) {
      const { maxPriorityFeePerGas } = baseGasParams
      const maxFeePerGas = addCurrencies(baseFeePerGas, maxPriorityFeePerGas || '0x0', {
        aBase: 16,
        bBase: 16,
        toNumericBase: 'hex',
      })

      return {
        ...baseGasParams,
        maxFeePerGas,
      }
    }
    return baseGasParams
  }, [baseGasParams, baseFeePerGas, primaryTransaction])

  const cancelTransaction = useCallback((event) => {
    event.stopPropagation()
    return dispatch(showModal({ name: 'CANCEL_TRANSACTION', transactionId, customGasParams }))
  }, [dispatch, transactionId, customGasParams])


  const hasEnoughCancelGas = primaryTransaction.txParams && isBalanceSufficient({
    amount: '0x0',
    gasTotal: getHexGasTotal(customGasParams),
    balance: selectedAccount.balance,
    conversionRate,
  })

  return [hasEnoughCancelGas, cancelTransaction]
}
