import { multiplyCurrencies, subtractCurrencies } from '../../../../../helpers/utils/conversion-util'
import ethUtil from 'ethereumjs-util'

export function calcMaxAmount ({ balance, gasTotal, swapFromToken, tokenFromBalance }) {
  const { decimals } = swapFromToken || {}
  const multiplier = Math.pow(10, Number(decimals || 0))

  return swapFromToken
    ? multiplyCurrencies(
      tokenFromBalance,
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
