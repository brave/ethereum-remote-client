import { connect } from 'react-redux'
import { compose } from 'redux'

import withModalProps from '../../../../helpers/higher-order-components/with-modal-props'
import CancelTransaction from './cancel-transaction.component'
import { showModal, createCancelTransaction } from '../../../../store/actions'
import { getHexGasTotal } from '../../../../helpers/utils/confirm-tx.util'

const mapStateToProps = (state, ownProps) => {
  const { metamask } = state
  const { transactionId, customGasParams } = ownProps
  const { currentNetworkTxList } = metamask
  const transaction = currentNetworkTxList.find(({ id }) => id === transactionId)
  const transactionStatus = transaction ? transaction.status : ''

  const newGasFee = getHexGasTotal({
    ...customGasParams,
    gasLimit: customGasParams.gasLimit || '0x5208',
  })

  return {
    transactionId,
    transactionStatus,
    customGasParams,
    newGasFee,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createCancelTransaction: (txId, customGasParams) => {
      return dispatch(createCancelTransaction(txId, customGasParams))
    },
    showTransactionConfirmedModal: () => dispatch(showModal({ name: 'TRANSACTION_CONFIRMED' })),
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { transactionId, customGasParams, ...restStateProps } = stateProps
  const { createCancelTransaction, ...restDispatchProps } = dispatchProps

  return {
    ...restStateProps,
    ...restDispatchProps,
    ...ownProps,
    createCancelTransaction: () => createCancelTransaction(transactionId, customGasParams),
  }
}

export default compose(
  withModalProps,
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
)(CancelTransaction)
