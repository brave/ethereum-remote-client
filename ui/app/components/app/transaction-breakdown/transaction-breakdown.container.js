import { connect } from 'react-redux'
import TransactionBreakdown from './transaction-breakdown.component'
import { getIsMainnet, getNativeCurrency, getPreferences } from '../../../selectors'
import { getHexGasTotal } from '../../../helpers/utils/confirm-tx.util'
import { hasEIP1559GasFields, sumHexes } from '../../../helpers/utils/transactions.util'

const mapStateToProps = (state, ownProps) => {
  const { transaction } = ownProps
  const {
    txParams: {
      gas,
      gasPrice,
      maxPriorityFeePerGas,
      maxFeePerGas,
      value,
    } = {},
    txReceipt: { gasUsed } = {},
  } = transaction
  const { showFiatInTestnets } = getPreferences(state)
  const isMainnet = getIsMainnet(state)

  const gasParams = {
    gasLimit: typeof gasUsed === 'string' ? gasUsed : gas,
    gasPrice,
    maxFeePerGas,
  }

  const gasLimit = typeof gasUsed === 'string' ? gasUsed : gas

  const hexGasTotal = (gasLimit && getHexGasTotal(gasParams)) || '0x0'
  const totalInHex = sumHexes(hexGasTotal, value)

  return {
    nativeCurrency: getNativeCurrency(state),
    showFiat: (isMainnet || !!showFiatInTestnets),
    totalInHex,
    gas,
    gasPrice,
    maxPriorityFeePerGas,
    maxFeePerGas,
    value,
    gasUsed,
    hasEIP1559GasFields: hasEIP1559GasFields(transaction),
  }
}

export default connect(mapStateToProps)(TransactionBreakdown)
