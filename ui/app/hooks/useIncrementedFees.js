import { useMemo } from 'react'

import { hasEIP1559GasFields } from '../helpers/utils/transactions.util'
import { increaseLastGasPrice } from '../helpers/utils/confirm-tx.util'


function incrementValue (value = '0x0') {
  return value.startsWith('-') ? '0x0' : increaseLastGasPrice(value)
}

export function useIncrementedGasFees (transactionGroup) {
  const { primaryTransaction } = transactionGroup

  return useMemo(() => {
    if (hasEIP1559GasFields(primaryTransaction)) {
      const maxPriorityFeePerGas = primaryTransaction.txParams?.maxPriorityFeePerGas
      return {
        gasLimit: primaryTransaction.txParams?.gas,
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
