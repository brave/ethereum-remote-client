import { subtractCurrencies } from '../../../../helpers/utils/conversion-util'
import ethUtil from 'ethereumjs-util'

export function calcMaxAmount ({ balance, estimatedGasCost, fromAsset }) {
  return fromAsset.address
    ? balance
    : subtractCurrencies(
      ethUtil.addHexPrefix(balance),
      ethUtil.addHexPrefix(estimatedGasCost || '0'),
      { toNumericBase: 'hex' },
    )
}
