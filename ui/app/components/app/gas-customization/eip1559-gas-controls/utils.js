import {
  addHexWEIsToDec,
  decEthToConvertedCurrency as ethTotalToConvertedCurrency, hexWEIToDecGWEI, subtractHexWEIsToDec,
} from '../../../../helpers/utils/conversions.util'
import { formatCurrency } from '../../../../helpers/utils/confirm-tx.util'
import { formatETHFee } from '../../../../helpers/utils/formatters'


export function addHexWEIsToRenderableFiat (aHexWEI, bHexWEI, convertedCurrency, conversionRate) {
  const ethTotal = ethTotalToConvertedCurrency(
    addHexWEIsToDec(aHexWEI, bHexWEI),
    convertedCurrency,
    conversionRate,
  )
  return formatCurrency(ethTotal, convertedCurrency)
}

export function addHexWEIsToRenderableEth (aHexWEI, bHexWEI) {
  return formatETHFee(addHexWEIsToDec(aHexWEI, bHexWEI))
}

export function subtractHexWEIsFromRenderableEth (aHexWEI, bHexWEI) {
  return formatETHFee(subtractHexWEIsToDec(aHexWEI, bHexWEI))
}

export function calcCustomMaxPriorityFeePerGasInDec (customMaxPriorityFeePerGasInHex) {
  return Number(hexWEIToDecGWEI(customMaxPriorityFeePerGasInHex))
}

export function calcCustomMaxFeePerGasInDec (customMaxFeePerGasInHex) {
  return Number(hexWEIToDecGWEI(customMaxFeePerGasInHex))
}
