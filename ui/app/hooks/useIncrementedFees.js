import { useMemo } from 'react'

import { hasEIP1559GasFields } from '../helpers/utils/transactions.util'
import { increaseLastGasPrice } from '../helpers/utils/confirm-tx.util'


function incrementValue (value) {
  return value.startsWith('-') ? '0x0' : increaseLastGasPrice(value)
}

export function useIncrementedGasFees (transactionGroup) {
  const { primaryTransaction } = transactionGroup

  return useMemo(() => {
    if (hasEIP1559GasFields(primaryTransaction)) {
      const maxFeePerGas = primaryTransaction.txParams?.maxFeePerGas
      const maxPriorityFeePerGas = primaryTransaction.txParams?.maxPriorityFeePerGas
      return {
        gasLimit: primaryTransaction.txParams?.gas,
        maxFeePerGas: incrementValue(maxFeePerGas) || maxFeePerGas,
        maxPriorityFeePerGas: incrementValue(maxPriorityFeePerGas) || maxPriorityFeePerGas,
      }

    } else {
      const gasPrice = primaryTransaction.txParams?.gasPrice
      return {
        gasLimit: primaryTransaction.txParams?.gas,
        gasPrice: incrementValue(gasPrice) || gasPrice,
      }
    }
  }, [primaryTransaction])
}
