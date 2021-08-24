import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import ConfirmSendToken from './confirm-send-token.component'
import { clearConfirmTransaction } from '../../ducks/confirm-transaction/confirm-transaction.duck'
import { updateSend, showSendTokenPage } from '../../store/actions'
import { conversionUtil } from '../../helpers/utils/conversion-util'
import { sendTokenTokenAmountAndToAddressSelector } from '../../selectors'

const mapStateToProps = (state) => {
  const { tokenAmount } = sendTokenTokenAmountAndToAddressSelector(state)

  return {
    tokenAmount,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editTransaction: ({ txData, tokenData, tokenProps }) => {

      const {
        id,
        txParams: {
          from,
          to: tokenAddress,
          gas: gasLimit,
          gasPrice,
          maxPriorityFeePerGas,
          maxFeePerGas,
        } = {},
      } = txData

      const { params = [] } = tokenData
      const { value: to } = params[0] || {}
      const { value: tokenAmountInDec } = params[1] || {}

      const tokenAmountInHex = conversionUtil(tokenAmountInDec, {
        fromNumericBase: 'dec',
        toNumericBase: 'hex',
      })

      dispatch(updateSend({
        from,
        gasLimit,
        gasPrice,
        maxPriorityFeePerGas,
        maxFeePerGas,
        gasTotal: null,
        to,
        amount: tokenAmountInHex,
        errors: { to: null, amount: null },
        editingTransactionId: id && id.toString(),
        token: {
          ...tokenProps,
          address: tokenAddress,
        },
      }))
      dispatch(clearConfirmTransaction())
      dispatch(showSendTokenPage())
    },
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmSendToken)
