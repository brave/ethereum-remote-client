import { decimalToHex } from '../../helpers/utils/conversions.util'
import { calcTokenValue } from '../../helpers/utils/token-util.js'
import { getTokenData } from '../../helpers/utils/transactions.util'

export function getCustomTxParamsData (data, { customPermissionAmount, decimals }) {
  const tokenData = getTokenData(data)

  if (!tokenData) {
    throw new Error('Invalid data')
  } else if (tokenData.name !== 'approve') {
    throw new Error(`Invalid data; should be 'approve' method, but instead is '${tokenData.name}'`)
  }
  let spender = tokenData.params[0].value
  if (spender.startsWith('0x')) {
    spender = spender.substring(2)
  }
  const [signature, tokenValue] = data.split(spender)

  if (!signature || !tokenValue) {
    throw new Error('Invalid data')
  } else if (tokenValue.length !== 64) {
    throw new Error('Invalid token value; should be exactly 64 hex digits long (u256)')
  }

  let customPermissionValue = decimalToHex(calcTokenValue(customPermissionAmount, decimals))
  if (customPermissionValue.length > 64) {
    throw new Error('Custom value is larger than u256')
  }

  customPermissionValue = customPermissionValue.padStart(tokenValue.length, '0')
  const customTxParamsData = `${signature}${spender}${customPermissionValue}`
  return customTxParamsData
}
