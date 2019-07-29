import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import {
  setTransactionToConfirm,
  clearConfirmTransaction,
} from '../../ducks/confirm-transaction/confirm-transaction.duck'
import {
  isTokenMethodAction,
} from '../../helpers/utils/transactions.util'
import {
  fetchBasicGasAndTimeEstimates,
} from '../../ducks/gas/gas.duck'

import {
  getContractMethodData,
  getTokenParams,
} from '../../store/actions'
import ConfirmTransaction from './confirm-transaction.component'
import { unconfirmedTransactionsListSelector } from '../../selectors/confirm-transaction'

const mapStateToProps = (state, ownProps) => {
  const { metamask: { send, unapprovedTxs }, confirmTransaction } = state
  const { match: { params = {} } } = ownProps
  const { id } = params

  const unconfirmedTransactions = unconfirmedTransactionsListSelector(state)
  const totalUnconfirmed = unconfirmedTransactions.length
  const transaction = totalUnconfirmed
    ? unapprovedTxs[id] || unconfirmedTransactions[totalUnconfirmed - 1]
    : {}
  const { id: transactionId, transactionCategory } = transaction

  return {
    totalUnapprovedCount: totalUnconfirmed,
    send,
    confirmTransaction,
    unapprovedTxs,
    id,
    paramsTransactionId: id && String(id),
    transactionId: transactionId && String(transactionId),
    unconfirmedTransactions,
    transaction,
    isTokenMethodAction: isTokenMethodAction(transactionCategory),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setTransactionToConfirm: transactionId => {
      dispatch(setTransactionToConfirm(transactionId))
    },
    clearConfirmTransaction: () => dispatch(clearConfirmTransaction()),
    fetchBasicGasAndTimeEstimates: () => dispatch(fetchBasicGasAndTimeEstimates()),
    getContractMethodData: (data) => dispatch(getContractMethodData(data)),
    getTokenParams: (tokenAddress) => dispatch(getTokenParams(tokenAddress)),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmTransaction)
