import { connect } from 'react-redux'
import ethUtil from 'ethereumjs-util'
import {
  addToAddressBook,
  clearSwap,
  signTokenTx,
  signTx,
  updateTransaction,
} from '../../../store/actions'
import {
  getGasLimit,
  getGasPrice,
  getGasTotal,
  getSwapFromToken,
  getSwapAmount,
  getSwapEditingTransactionId,
  getSwapFromObject,
  getSwapTo,
  getSwapToAccounts,
  getSwapHexData,
  getSwapFromTokenBalance,
  getSwapToTokenBalance,
  getUnapprovedTxs,
  getSwapErrors,
  isSwapFormInError,
  getGasIsLoading,
  getRenderableEstimateDataForSmallButtonsFromGWEI,
  getDefaultActiveButtonIndex,
} from '../../../selectors'
import SwapFooter from './swap-footer.component'
import {
  addressIsNew,
  constructTxParams,
  constructUpdatedTx,
} from './swap-footer.utils'
import { getMostRecentOverviewPage } from '../../../ducks/history/history'

export default connect(mapStateToProps, mapDispatchToProps)(SwapFooter)

function mapStateToProps (state) {

  const gasButtonInfo = getRenderableEstimateDataForSmallButtonsFromGWEI(state)
  const gasPrice = getGasPrice(state)
  const activeButtonIndex = getDefaultActiveButtonIndex(gasButtonInfo, gasPrice)
  const gasEstimateType = activeButtonIndex >= 0
    ? gasButtonInfo[activeButtonIndex].gasEstimateType
    : 'custom'
  const editingTransactionId = getSwapEditingTransactionId(state)

  return {
    amount: getSwapAmount(state),
    data: getSwapHexData(state),
    editingTransactionId,
    from: getSwapFromObject(state),
    gasLimit: getGasLimit(state),
    gasPrice: getGasPrice(state),
    gasTotal: getGasTotal(state),
    inError: isSwapFormInError(state),
    swapFromToken: getSwapFromToken(state),
    to: getSwapTo(state),
    toAccounts: getSwapToAccounts(state),
    tokenFromBalance: getSwapFromTokenBalance(state),
    tokenToBalance: getSwapToTokenBalance(state),
    unapprovedTxs: getUnapprovedTxs(state),
    swapErrors: getSwapErrors(state),
    gasEstimateType,
    gasIsLoading: getGasIsLoading(state),
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    clearSwap: () => dispatch(clearSwap()),
    sign: ({ swapFromToken, to, amount, from, gas, gasPrice, data }) => {
      const txParams = constructTxParams({
        amount,
        data,
        from,
        gas,
        gasPrice,
        swapFromToken,
        to,
      })

      swapFromToken
        ? dispatch(signTokenTx(swapFromToken.address, to, amount, txParams))
        : dispatch(signTx(txParams))
    },
    update: ({
      amount,
      data,
      editingTransactionId,
      from,
      gas,
      gasPrice,
      swapFromToken,
      to,
      unapprovedTxs,
    }) => {
      const editingTx = constructUpdatedTx({
        amount,
        data,
        editingTransactionId,
        from,
        gas,
        gasPrice,
        swapFromToken,
        to,
        unapprovedTxs,
      })

      return dispatch(updateTransaction(editingTx))
    },

    addToAddressBookIfNew: (newAddress, toAccounts, nickname = '') => {
      const hexPrefixedAddress = ethUtil.addHexPrefix(newAddress)
      if (addressIsNew(toAccounts, hexPrefixedAddress)) {
        // TODO: nickname, i.e. addToAddressBook(recipient, nickname)
        dispatch(addToAddressBook(hexPrefixedAddress, nickname))
      }
    },
  }
}
