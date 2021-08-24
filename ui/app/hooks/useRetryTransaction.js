import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { showSidebar } from '../store/actions'
import {
  fetchBasicGasAndTimeEstimates,
  fetchGasEstimates,
  setCustomGasLimit,
  setCustomGasPriceForRetry,
} from '../ducks/gas/gas.duck'
import { useMetricEvent } from './useMetricEvent'
import { hasEIP1559GasFields } from '../helpers/utils/transactions.util'
import { useIncrementedGasFees } from './useIncrementedFees'


/**
 * Provides a reusable hook that, given a transactionGroup, will return
 * a method for beginning the retry process
 * @param {Object} transactionGroup - the transaction group
 * @return {Function}
 */
export function useRetryTransaction (transactionGroup) {
  const { primaryTransaction: transaction } = transactionGroup
  const customGasParams = useIncrementedGasFees(transactionGroup)

  const trackMetricsEvent = useMetricEvent(({
    eventOpts: {
      category: 'Navigation',
      action: 'Activity Log',
      name: 'Clicked "Speed Up"',
    },
  }))
  const dispatch = useDispatch()

  return useCallback(async (event) => {
    event.stopPropagation()
    trackMetricsEvent()

    if (hasEIP1559GasFields(transaction)) {
      // TODO (@onyb): handle EIP-1559 fee bump logic.

      // Step 1: query eth_feeHistory RPC to fetch the latest estimates
      // Step 2: obtain the priority fee estimate for the desired block time
      // Step 3: bump priority fee by 10%
      // Step 4: update state
    } else {
      // Step 1: query ETH Gas Station for latest estimates
      const basicEstimates = await dispatch(fetchBasicGasAndTimeEstimates)

      // Step 2: obtain the gasPrice estimate for the desired block time
      await dispatch(fetchGasEstimates(basicEstimates.blockTime))

      // Step 3: bump the previous gasPrice by 10%.
      const increasedGasPrice = customGasParams.gasPrice

      // Step 4: set the new values of the gasPrice
      dispatch(setCustomGasPriceForRetry(increasedGasPrice))
      dispatch(setCustomGasLimit(customGasParams.gasLimit))
    }

    dispatch(showSidebar({
      transitionName: 'sidebar-left',
      type: 'customize-gas',
      props: { transaction },
    }))
  }, [dispatch, trackMetricsEvent, transaction, customGasParams])
}
