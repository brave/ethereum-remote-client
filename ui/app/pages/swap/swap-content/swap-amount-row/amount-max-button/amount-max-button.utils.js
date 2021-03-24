import { multiplyCurrencies, subtractCurrencies } from '../../../../../helpers/utils/conversion-util'
import ethUtil from 'ethereumjs-util'

export function calcMaxAmount ({ balance, gasTotal, swapToken, tokenBalance }) {
  const { decimals } = swapToken || {}
  const multiplier = Math.pow(10, Number(decimals || 0))

  return swapToken
    ? multiplyCurrencies(
      tokenBalance,
      multiplier,
      {
        toNumericBase: 'hex',
        multiplicandBase: 16,
      },
    )
    : subtractCurrencies(
      ethUtil.addHexPrefix(balance),
      ethUtil.addHexPrefix(gasTotal),
      { toNumericBase: 'hex' },
    )
}
