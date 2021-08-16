import currencyFormatter from 'currency-formatter'
import currencies from 'currency-formatter/currencies'
import { addHexPrefix } from 'ethereumjs-util'
import BigNumber from 'bignumber.js'

import {
  conversionUtil,
  addCurrencies,
  multiplyCurrencies,
  conversionGreaterThan,
} from './conversion-util'

import { unconfirmedTransactionsCountSelector } from '../../selectors'

export function increaseLastGasPrice (lastGasPrice) {
  return addHexPrefix(multiplyCurrencies(lastGasPrice || '0x0', 1.1, {
    multiplicandBase: 16,
    multiplierBase: 10,
    toNumericBase: 'hex',
  }))
}

export function hexGreaterThan (a, b) {
  return conversionGreaterThan(
    { value: a, fromNumericBase: 'hex' },
    { value: b, fromNumericBase: 'hex' },
  )
}

export function getHexGasTotal ({ gasLimit, gasPrice, maxFeePerGas }) {
  const func = (value) => addHexPrefix(multiplyCurrencies(gasLimit || '0x0', value || '0x0', {
    toNumericBase: 'hex',
    multiplicandBase: 16,
    multiplierBase: 16,
  }))

  if (maxFeePerGas) {
    return func(maxFeePerGas)
  }

  return func(gasPrice)
}

export function addEth (...args) {
  return args.reduce((acc, base) => {
    return addCurrencies(acc, base, {
      toNumericBase: 'dec',
      numberOfDecimals: 6,
    })
  })
}

export function addFiat (...args) {
  return args.reduce((acc, base) => {
    return addCurrencies(acc, base, {
      toNumericBase: 'dec',
      numberOfDecimals: 2,
    })
  })
}

export function getValueFromWeiHex ({
  value,
  fromCurrency = 'ETH',
  toCurrency,
  conversionRate,
  numberOfDecimals,
  toDenomination,
}) {
  return conversionUtil(value, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
    fromCurrency,
    toCurrency,
    numberOfDecimals,
    fromDenomination: 'WEI',
    toDenomination,
    conversionRate,
  })
}

export function getTransactionFee ({
  value,
  fromCurrency = 'ETH',
  toCurrency,
  conversionRate,
  numberOfDecimals,
}) {
  return conversionUtil(value, {
    fromNumericBase: 'BN',
    toNumericBase: 'dec',
    fromDenomination: 'WEI',
    fromCurrency,
    toCurrency,
    numberOfDecimals,
    conversionRate,
  })
}

export function formatCurrency (value, currencyCode) {
  const upperCaseCurrencyCode = currencyCode.toUpperCase()

  return currencies.find((currency) => currency.code === upperCaseCurrencyCode)
    ? currencyFormatter.format(Number(value), { code: upperCaseCurrencyCode, style: 'currency' })
    : value
}

export function convertTokenToFiat ({
  value,
  fromCurrency = 'ETH',
  toCurrency,
  conversionRate,
  contractExchangeRate,
}) {
  const totalExchangeRate = conversionRate * contractExchangeRate

  return conversionUtil(value, {
    fromNumericBase: 'dec',
    toNumericBase: 'dec',
    fromCurrency,
    toCurrency,
    numberOfDecimals: 2,
    conversionRate: totalExchangeRate,
  })
}

export function hasUnconfirmedTransactions (state) {
  return unconfirmedTransactionsCountSelector(state) > 0
}

export function roundExponential (value) {
  const PRECISION = 4
  const bigNumberValue = new BigNumber(String(value))

  // In JS, numbers with exponentials greater than 20 get displayed as an exponential.
  return bigNumberValue.e > 20 ? Number(bigNumberValue.toPrecision(PRECISION)) : value
}
