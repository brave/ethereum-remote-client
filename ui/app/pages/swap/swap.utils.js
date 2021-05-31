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
  BASE_TOKEN_GAS_COST,
  INSUFFICIENT_FUNDS_ERROR,
  INSUFFICIENT_FUNDS_GAS_ERROR,
  INSUFFICIENT_TOKENS_ERROR,
  MIN_GAS_LIMIT_HEX,
  NEGATIVE_ETH_ERROR,
  SIMPLE_GAS_COST,
  TOKEN_TRANSFER_FUNCTION_SIGNATURE,
} from './swap.constants'

import abi from 'ethereumjs-abi'
import ethUtil from 'ethereumjs-util'

export {
  addGasBuffer,
  calcGasTotal,
  calcTokenBalance,
  doesAmountErrorRequireUpdate,
  estimateGas,
  generateTokenTransferData,
  getAmountErrorObject,
  getGasFeeErrorObject,
  getToAddressForGasUpdate,
  isBalanceSufficient,
  isTokenBalanceSufficient,
  removeLeadingZeroes,
}

function calcGasTotal (gasLimit = '0', gasPrice = '0') {
  return multiplyCurrencies(gasLimit, gasPrice, {
    toNumericBase: 'hex',
    multiplicandBase: 16,
    multiplierBase: 16,
  })
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
  primaryCurrency,
  fromAsset,
  tokenBalance,
}) {
  if (fromAsset.address && tokenBalance === null) {
    return { amount: BALANCE_FETCH_ERROR }
  }

  let insufficientFunds = false
  if (estimatedGasCost && conversionRate && !fromAsset.address) {
    insufficientFunds = !isBalanceSufficient({
      amount,
      balance,
      conversionRate,
      estimatedGasCost,
      primaryCurrency,
    })
  }

  if (!estimatedGasCost && amount && conversionRate && !fromAsset.address) {
    insufficientFunds = insufficientFunds || !conversionGreaterThan(
      {
        value: balance,
        fromNumericBase: 'hex',
        fromCurrency: primaryCurrency,
        conversionRate,
      },
      {
        value: amount,
        fromNumericBase: 'hex',
        conversionRate: conversionRate,
        fromCurrency: primaryCurrency,
      },
    )
  }

  let inSufficientTokens = false
  if (fromAsset.address) {
    const { decimals } = fromAsset
    inSufficientTokens = !isTokenBalanceSufficient({
      tokenBalance,
      amount,
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
  primaryCurrency,
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
    primaryCurrency,
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

function doesAmountErrorRequireUpdate ({
  balance,
  gasTotal,
  prevBalance,
  prevGasTotal,
  prevTokenBalance,
  swapFromToken,
  tokenBalance,
}) {
  const balanceHasChanged = balance !== prevBalance
  const gasTotalHasChange = gasTotal !== prevGasTotal
  const tokenBalanceHasChanged = swapFromToken && tokenBalance !== prevTokenBalance
  return balanceHasChanged || gasTotalHasChange || tokenBalanceHasChanged
}

async function estimateGas ({
  selectedAddress,
  swapFromToken,
  blockGasLimit = MIN_GAS_LIMIT_HEX,
  to,
  value,
  data,
  gasPrice,
  estimateGasMethod,
}) {
  const paramsForGasEstimate = { from: selectedAddress, value, gasPrice }

  // if recipient has no code, gas is 21k max:
  if (!swapFromToken && !data) {
    const code = Boolean(to) && await global.eth.getCode(to)
    // Geth will return '0x', and ganache-core v2.2.1 will return '0x0'
    const codeIsEmpty = !code || code === '0x' || code === '0x0'
    if (codeIsEmpty) {
      return SIMPLE_GAS_COST
    }
  } else if (swapFromToken && !to) {
    return BASE_TOKEN_GAS_COST
  }

  if (swapFromToken) {
    paramsForGasEstimate.value = '0x0'
    paramsForGasEstimate.data = generateTokenTransferData({ toAddress: to, amount: value, swapFromToken })
    paramsForGasEstimate.to = swapFromToken.address
  } else {
    if (data) {
      paramsForGasEstimate.data = data
    }

    if (to) {
      paramsForGasEstimate.to = to
    }

    if (!value || value === '0') {
      paramsForGasEstimate.value = '0xff'
    }
  }

  // if not, fall back to block gasLimit
  if (!blockGasLimit) {
    blockGasLimit = MIN_GAS_LIMIT_HEX
  }

  paramsForGasEstimate.gas = ethUtil.addHexPrefix(multiplyCurrencies(blockGasLimit, 0.95, {
    multiplicandBase: 16,
    multiplierBase: 10,
    roundDown: '0',
    toNumericBase: 'hex',
  }))

  // run tx
  try {
    const estimatedGas = await estimateGasMethod(paramsForGasEstimate)
    const estimateWithBuffer = addGasBuffer(estimatedGas.toString(16), blockGasLimit, 1.5)
    return ethUtil.addHexPrefix(estimateWithBuffer)
  } catch (error) {
    const simulationFailed = (
      error.message.includes('Transaction execution error.') ||
      error.message.includes('gas required exceeds allowance or always failing transaction')
    )
    if (simulationFailed) {
      const estimateWithBuffer = addGasBuffer(paramsForGasEstimate.gas, blockGasLimit, 1.5)
      return ethUtil.addHexPrefix(estimateWithBuffer)
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

function generateTokenTransferData ({ toAddress = '0x0', amount = '0x0', swapFromToken }) {
  if (!swapFromToken) {
    return
  }
  return TOKEN_TRANSFER_FUNCTION_SIGNATURE + Array.prototype.map.call(
    abi.rawEncode(['address', 'uint256'], [toAddress, ethUtil.addHexPrefix(amount)]),
    (x) => ('00' + x.toString(16)).slice(-2),
  ).join('')
}

function getToAddressForGasUpdate (...addresses) {
  return [...addresses, ''].find((str) => str !== undefined && str !== null).toLowerCase()
}

function removeLeadingZeroes (str) {
  return str.replace(/^0*(?=\d)/, '')
}

export function decimalToHex (value) {
  return ethUtil.addHexPrefix(decimalToHexHelper(value))
}

export function hexAmountToDecimal (value, asset) {
  const { decimals, symbol } = asset

  if (value === '0') {
    return '0'
  }

  const multiplier = Math.pow(10, Number(decimals || 0))
  const decimalValueString = conversionUtil(ethUtil.addHexPrefix(value), {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
    toCurrency: symbol,
    conversionRate: multiplier,
    invertConversionRate: true,
  })

  return Number(decimalValueString) ? decimalValueString : ''
}
