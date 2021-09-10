import { useMemo } from 'react'

import { hasEIP1559GasFields } from '../helpers/utils/transactions.util'
import { increaseLastGasPrice } from '../helpers/utils/confirm-tx.util'
import { conversionGreaterThan } from '../helpers/utils/conversion-util'


function incrementValue (value = '0x0') {
  return value.startsWith('-') ? '0x0' : increaseLastGasPrice(value)
}

export function useIncrementedGasFees (transactionGroup, suggestedMaxPriorityFeePerGas = '0x0') {
  const { primaryTransaction } = transactionGroup

  return useMemo(() => {
    if (hasEIP1559GasFields(primaryTransaction)) {
      const maxPriorityFeePerGas = primaryTransaction.txParams?.maxPriorityFeePerGas
      const incrementedMaxPriorityFeePerGas = incrementValue(maxPriorityFeePerGas) || maxPriorityFeePerGas
      const incrementedFeePerGasIsEnough = conversionGreaterThan(
        { value: incrementedMaxPriorityFeePerGas, fromNumericBase: 'hex' },
        { value: suggestedMaxPriorityFeePerGas, fromNumericBase: 'hex' },
      )

      return {
        gasLimit: primaryTransaction.txParams?.gas,
        maxPriorityFeePerGas: incrementedFeePerGasIsEnough
          ? incrementedMaxPriorityFeePerGas : suggestedMaxPriorityFeePerGas,
      }

    } else {
      const gasPrice = primaryTransaction.txParams?.gasPrice
      return {
        gasLimit: primaryTransaction.txParams?.gas,
        gasPrice: incrementValue(gasPrice) || gasPrice,
      }
    }
  }, [primaryTransaction, suggestedMaxPriorityFeePerGas])
}
