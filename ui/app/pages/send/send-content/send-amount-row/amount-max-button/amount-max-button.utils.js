import { multiplyCurrencies, subtractCurrencies } from '../../../../../helpers/utils/conversion-util'
import { addHexPrefix } from 'ethereumjs-util'

export function calcMaxAmount ({ balance, gasTotal, sendToken, tokenBalance }) {
  const { decimals } = sendToken || {}
  const multiplier = Math.pow(10, Number(decimals || 0))

  return sendToken
    ? multiplyCurrencies(
      tokenBalance,
      multiplier,
      {
        toNumericBase: 'hex',
        multiplicandBase: 16,
      },
    )
    : subtractCurrencies(
      addHexPrefix(balance),
      addHexPrefix(gasTotal),
      { toNumericBase: 'hex' },
    )
}
