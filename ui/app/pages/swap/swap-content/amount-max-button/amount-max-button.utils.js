import { addHexPrefix } from 'ethereumjs-util'
import { subtractCurrencies } from '../../../../helpers/utils/conversion-util'

export function calcMaxAmount ({ balance, estimatedGasCost, fromAsset }) {
  return fromAsset.address
    ? balance
    : subtractCurrencies(
      addHexPrefix(balance),
      addHexPrefix(estimatedGasCost || '0'),
      { toNumericBase: 'hex' },
    )
}
