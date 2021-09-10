import { addHexPrefix } from 'ethereumjs-util'

import {
  addCurrencies,
  conversionGreaterThan,
  conversionGTE,
  conversionLessThan,
  conversionUtil,
  multiplyCurrencies,
} from '../../helpers/utils/conversion-util'

import { decimalToHex as decimalToHexHelper } from '../../helpers/utils/conversions.util'

import { calcTokenAmount } from '../../helpers/utils/token-util'

import {
  BALANCE_FETCH_ERROR,
  INSUFFICIENT_FUNDS_ERROR,
  INSUFFICIENT_FUNDS_GAS_ERROR,
  INSUFFICIENT_TOKENS_ERROR,
  MIN_GAS_LIMIT_HEX,
  NEGATIVE_ETH_ERROR,
} from './swap.constants'

export {
  addGasBuffer,
  calcTokenBalance,
  estimateGasForTransaction,
  getAmountErrorObject,
  getGasFeeErrorObject,
  isBalanceSufficient,
  isTokenBalanceSufficient,
}

function isBalanceSufficient ({
  amount = '0x0',
  balance = '0x0',
  conversionRate = 1,
  estimatedGasCost = '0x0',
  primaryCurrency,
}) {
  const totalAmount = addCurrencies(amount, estimatedGasCost, {
    aBase: 16,
    bBase: 16,
    toNumericBase: 'hex',
  })

  return conversionGTE(
    {
      value: balance,
      fromNumericBase: 'hex',
      fromCurrency: primaryCurrency,
      conversionRate,
    },
    {
      value: totalAmount,
      fromNumericBase: 'hex',
      conversionRate: conversionRate,
      fromCurrency: primaryCurrency,
    },
  )
}

function isTokenBalanceSufficient ({
  amount = '0x0',
  tokenBalance = '0x0',
}) {
  return conversionGTE(
    {
      value: tokenBalance,
      fromNumericBase: 'hex',
    },
    {
      value: amount,
      fromNumericBase: 'hex',
    },
  )
}

function getAmountErrorObject ({
  amount,
  balance,
  conversionRate,
  estimatedGasCost,
  fromAsset,
  tokenBalance,
}) {
  if (fromAsset.address && tokenBalance === null) {
    return { amount: BALANCE_FETCH_ERROR }
  }

  let insufficientFunds = false
  if (conversionRate && !fromAsset.address) {
    insufficientFunds = !isBalanceSufficient({
      amount: amount || '0',
      balance,
      conversionRate,
      estimatedGasCost: estimatedGasCost || '0',
      primaryCurrency: fromAsset.symbol,
    })
  }

  let inSufficientTokens = false
  if (fromAsset.address) {
    const { decimals } = fromAsset
    inSufficientTokens = !isTokenBalanceSufficient({
      tokenBalance,
      amount: amount || '0',
      decimals,
    })
  }

  const amountLessThanZero = conversionGreaterThan(
    { value: 0, fromNumericBase: 'dec' },
    { value: amount, fromNumericBase: 'hex' },
  )

  let amountError = null

  if (insufficientFunds) {
    amountError = INSUFFICIENT_FUNDS_ERROR
  } else if (inSufficientTokens) {
    amountError = INSUFFICIENT_TOKENS_ERROR
  } else if (amountLessThanZero) {
    amountError = NEGATIVE_ETH_ERROR
  }

  return { amount: amountError }
}

function getGasFeeErrorObject ({
  amount,
  balance,
  conversionRate,
  estimatedGasCost,
  fromAsset,
}) {
  if (!conversionRate) {
    return { gasFee: null }
  }

  let gasFeeError = null
  const insufficientFunds = balance === '0x0' || !isBalanceSufficient({
    amount: fromAsset.address ? '0x0' : amount,
    balance,
    conversionRate,
    estimatedGasCost: estimatedGasCost || '0x0',
    primaryCurrency: fromAsset.symbol,
  })

  if (insufficientFunds) {
    gasFeeError = INSUFFICIENT_FUNDS_GAS_ERROR
  }

  return { gasFee: gasFeeError }
}

function calcTokenBalance ({ swapFromToken, usersToken }) {
  const { decimals } = swapFromToken || {}
  return calcTokenAmount(usersToken.balance.toString(), decimals).toString(16)
}

async function estimateGasForTransaction ({
  transaction,
  estimateGasMethod,
  blockGasLimit = MIN_GAS_LIMIT_HEX,
}) {
  const gas = addHexPrefix(multiplyCurrencies(blockGasLimit, 0.95, {
    multiplicandBase: 16,
    multiplierBase: 10,
    roundDown: '0',
    toNumericBase: 'hex',
  }))

  try {
    const estimatedGas = await estimateGasMethod({ ...transaction, gas })
    const estimateWithBuffer = addGasBuffer(estimatedGas.toString(16), blockGasLimit, 1.5)
    return addHexPrefix(estimateWithBuffer)
  } catch (error) {
    const simulationFailed = (
      error.message.includes('Transaction execution error.') ||
      error.message.includes('gas required exceeds allowance or always failing transaction')
    )
    if (simulationFailed) {
      const estimateWithBuffer = addGasBuffer(gas, blockGasLimit, 1.5)
      return addHexPrefix(estimateWithBuffer)
    } else {
      throw error
    }
  }
}

function addGasBuffer (initialGasLimitHex, blockGasLimitHex, bufferMultiplier = 1.5) {
  const upperGasLimit = multiplyCurrencies(blockGasLimitHex, 0.9, {
    toNumericBase: 'hex',
    multiplicandBase: 16,
    multiplierBase: 10,
    numberOfDecimals: '0',
  })
  const bufferedGasLimit = multiplyCurrencies(initialGasLimitHex, bufferMultiplier, {
    toNumericBase: 'hex',
    multiplicandBase: 16,
    multiplierBase: 10,
    numberOfDecimals: '0',
  })

  // if initialGasLimit is above blockGasLimit, dont modify it
  if (conversionGreaterThan(
    { value: initialGasLimitHex, fromNumericBase: 'hex' },
    { value: upperGasLimit, fromNumericBase: 'hex' },
  )) {
    return initialGasLimitHex
  }
  // if bufferedGasLimit is below blockGasLimit, use bufferedGasLimit
  if (conversionLessThan(
    { value: bufferedGasLimit, fromNumericBase: 'hex' },
    { value: upperGasLimit, fromNumericBase: 'hex' },
  )) {
    return bufferedGasLimit
  }
  // otherwise use blockGasLimit
  return upperGasLimit
}

export function decimalToHex (value) {
  return addHexPrefix(decimalToHexHelper(value))
}

export function hexAmountToDecimal (value, asset) {
  const { decimals, symbol } = asset

  if (value === '0') {
    return '0'
  }

  const multiplier = Math.pow(10, Number(decimals || 0))
  const decimalValueString = conversionUtil(addHexPrefix(value), {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
    toCurrency: symbol,
    conversionRate: multiplier,
    invertConversionRate: true,
  })

  return Number(decimalValueString) ? decimalValueString : ''
}
