import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { showSidebar } from '../store/actions'
import {
  fetchBasicGasAndTimeEstimates,
  fetchGasEstimates,
  setCustomGasLimit,
  setCustomGasPriceForRetry,
  setCustomMaxFeePerGasForRetry,
  setCustomMaxPriorityFeePerGasForRetry,
} from '../ducks/gas/gas.duck'
import { useMetricEvent } from './useMetricEvent'
import { hasEIP1559GasFields } from '../helpers/utils/transactions.util'
import { useIncrementedGasFees } from './useIncrementedFees'
import { getAveragePriceEstimateInHexWEI, getBaseFeePerGas } from '../selectors'
import { addCurrencies } from '../helpers/utils/conversion-util'


/**
 * Provides a reusable hook that, given a transactionGroup, will return
 * a method for beginning the retry process
 * @param {Object} transactionGroup - the transaction group
 * @return {Function}
 */
export function useRetryTransaction (transactionGroup) {
  const { primaryTransaction: transaction } = transactionGroup
  const suggestedMaxPriorityFeePerGas = useSelector(getAveragePriceEstimateInHexWEI)
  const customGasParams = useIncrementedGasFees(transactionGroup, suggestedMaxPriorityFeePerGas)
  const baseFeePerGas = useSelector(getBaseFeePerGas) || '0x0'

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
      // Step 1: query ETH Gas Station for latest estimates
      await dispatch(fetchBasicGasAndTimeEstimates)

      // Step 2: bump the previous maxPriorityFeePerGas by 10%.
      const increasedMaxPriorityFeePerGas = customGasParams.maxPriorityFeePerGas
      const increasedMaxFeePerGas = addCurrencies(baseFeePerGas, increasedMaxPriorityFeePerGas || '0x0', {
        aBase: 16,
        bBase: 16,
        toNumericBase: 'hex',
      })

      // Step 3: set the new values of maxPriorityFeePerGas and maxFeePerGas
      dispatch(setCustomMaxPriorityFeePerGasForRetry(increasedMaxPriorityFeePerGas))
      dispatch(setCustomMaxFeePerGasForRetry(increasedMaxFeePerGas))
    } else {
      // Step 1: query ETH Gas Station for latest estimates
      const basicEstimates = await dispatch(fetchBasicGasAndTimeEstimates)

      // Step 2: obtain the gasPrice estimate for the desired block time
      await dispatch(fetchGasEstimates(basicEstimates.blockTime))

      // Step 3: bump the previous gasPrice by 10%.
      const increasedGasPrice = customGasParams.gasPrice

      // Step 4: set the new values of the gasPrice
      dispatch(setCustomGasPriceForRetry(increasedGasPrice))
    }

    dispatch(setCustomGasLimit(customGasParams.gasLimit))

    dispatch(showSidebar({
      transitionName: 'sidebar-left',
      type: 'customize-gas',
      props: { transaction },
    }))
  }, [dispatch, trackMetricsEvent, transaction, customGasParams, baseFeePerGas])
}
