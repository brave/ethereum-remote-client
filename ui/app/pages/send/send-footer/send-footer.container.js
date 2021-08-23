import { connect } from 'react-redux'
import { addHexPrefix } from 'ethereumjs-util'
import {
  addToAddressBook,
  clearSend,
  signTokenTx,
  signTx,
  updateTransaction,
} from '../../../store/actions'
import {
  getGasLimit,
  getGasPrice,
  getGasTotal,
  getSendToken,
  getSendAmount,
  getSendEditingTransactionId,
  getSendFromObject,
  getSendTo,
  getSendToAccounts,
  getSendHexData,
  getTokenBalance,
  getUnapprovedTxs,
  getSendErrors,
  isSendFormInError,
  getGasIsLoading,
  getRenderableEstimateDataForSmallButtonsFromGWEI,
  getDefaultActiveButtonIndex,
  getMaxPriorityFeePerGas,
  getMaxFeePerGas,
  isEIP1559Active,
  getEIP1559GasTotal,
} from '../../../selectors'
import SendFooter from './send-footer.component'
import {
  addressIsNew,
  constructTxParams,
  constructUpdatedTx,
} from './send-footer.utils'
import { getMostRecentOverviewPage } from '../../../ducks/history/history'

export default connect(mapStateToProps, mapDispatchToProps)(SendFooter)

function mapStateToProps (state) {

  const gasButtonInfo = getRenderableEstimateDataForSmallButtonsFromGWEI(state)
  const gasPrice = getGasPrice(state)
  const activeButtonIndex = getDefaultActiveButtonIndex(gasButtonInfo, gasPrice)
  const gasEstimateType = activeButtonIndex >= 0
    ? gasButtonInfo[activeButtonIndex].gasEstimateType
    : 'custom'
  const editingTransactionId = getSendEditingTransactionId(state)

  const isEIP1559 = isEIP1559Active(state)

  return {
    amount: getSendAmount(state),
    data: getSendHexData(state),
    editingTransactionId,
    from: getSendFromObject(state),
    gasLimit: getGasLimit(state),
    gasPrice: getGasPrice(state),
    maxPriorityFeePerGas: getMaxPriorityFeePerGas(state),
    maxFeePerGas: getMaxFeePerGas(state),
    gasTotal: isEIP1559 ? getEIP1559GasTotal(state) : getGasTotal(state),
    inError: isSendFormInError(state),
    sendToken: getSendToken(state),
    to: getSendTo(state),
    toAccounts: getSendToAccounts(state),
    tokenBalance: getTokenBalance(state),
    unapprovedTxs: getUnapprovedTxs(state),
    sendErrors: getSendErrors(state),
    gasEstimateType,
    gasIsLoading: getGasIsLoading(state),
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    isEIP1559Active: isEIP1559,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    clearSend: () => dispatch(clearSend()),
    sign: ({ sendToken, to, amount, from, gasParams, data }) => {
      // gasParams must contain the following fields:
      //   EIP-1559: gas, maxPriorityFeePerGas, maxFeePerGas
      //   Legacy: gas, gasPrice

      const txParams = constructTxParams({
        amount,
        data,
        from,
        sendToken,
        to,
        gasParams,
      })

      sendToken
        ? dispatch(signTokenTx(sendToken.address, to, amount, txParams))
        : dispatch(signTx(txParams))
    },
    update: ({
      amount,
      data,
      editingTransactionId,
      from,
      gasParams,
      sendToken,
      to,
      unapprovedTxs,
    }) => {
      const editingTx = constructUpdatedTx({
        amount,
        data,
        editingTransactionId,
        from,
        sendToken,
        to,
        unapprovedTxs,
        gasParams,
      })

      return dispatch(updateTransaction(editingTx))
    },

    addToAddressBookIfNew: (newAddress, toAccounts, nickname = '') => {
      const hexPrefixedAddress = addHexPrefix(newAddress)
      if (addressIsNew(toAccounts, hexPrefixedAddress)) {
        // TODO: nickname, i.e. addToAddressBook(recipient, nickname)
        dispatch(addToAddressBook(hexPrefixedAddress, nickname))
      }
    },
  }
}
