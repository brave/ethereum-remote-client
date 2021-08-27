import { connect } from 'react-redux'
import SendEther from './send.component'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import {
  getBlockGasLimit,
  getConversionRate,
  getCurrentNetwork,
  getGasLimit,
  getGasPrice,
  getGasTotal,
  getPrimaryCurrency,
  getSendToken,
  getSendTokenContract,
  getSendAmount,
  getSendEditingTransactionId,
  getSendHexDataFeatureFlagState,
  getSendFromObject,
  getSendTo,
  getSendToNickname,
  getTokenBalance,
  getQrCodeData,
  getSelectedAddress,
  getAddressBook,
  getMaxPriorityFeePerGas,
  getMaxFeePerGas,
  isEIP1559Network,
  getEIP1559GasTotal,
  getBaseFeePerGas,
} from '../../selectors'

import {
  updateSendTo,
  updateSendTokenBalance,
  updateGasData,
  setGasTotal,
  showQrScanner,
  qrCodeDetected,
  updateSendEnsResolution,
  updateSendEnsResolutionError,
} from '../../store/actions'
import {
  resetSendState,
  updateSendErrors,
} from '../../ducks/send/send.duck'
import {
  fetchBasicGasEstimates,
} from '../../ducks/gas/gas.duck'
import { getTokens } from '../../ducks/metamask/metamask'
import {
  calcEIP1559GasTotal,
  calcGasTotal,
} from './send.utils.js'
import {
  isValidDomainName,
} from '../../helpers/utils/util'

function mapStateToProps (state) {
  const editingTransactionId = getSendEditingTransactionId(state)

  return {
    addressBook: getAddressBook(state),
    amount: getSendAmount(state),
    blockGasLimit: getBlockGasLimit(state),
    conversionRate: getConversionRate(state),
    editingTransactionId,
    from: getSendFromObject(state),
    gasLimit: getGasLimit(state),
    gasPrice: getGasPrice(state),
    baseFeePerGas: getBaseFeePerGas(state),
    maxPriorityFeePerGas: getMaxPriorityFeePerGas(state),
    maxFeePerGas: getMaxFeePerGas(state),
    gasTotal: isEIP1559Network(state) ? getEIP1559GasTotal(state) : getGasTotal(state),
    network: getCurrentNetwork(state),
    primaryCurrency: getPrimaryCurrency(state),
    qrCodeData: getQrCodeData(state),
    selectedAddress: getSelectedAddress(state),
    sendToken: getSendToken(state),
    showHexData: getSendHexDataFeatureFlagState(state),
    to: getSendTo(state),
    toNickname: getSendToNickname(state),
    tokens: getTokens(state),
    tokenBalance: getTokenBalance(state),
    tokenContract: getSendTokenContract(state),
    isEIP1559: isEIP1559Network(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateAndSetGasLimit: ({
      blockGasLimit,
      editingTransactionId,
      gasLimit,
      gasPrice,
      baseFeePerGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      isEIP1559,
      selectedAddress,
      sendToken,
      to,
      value,
      data,
    }) => {
      !editingTransactionId
        ? dispatch(updateGasData({
          gasPrice: isEIP1559 ? maxFeePerGas : gasPrice,
          selectedAddress,
          sendToken,
          blockGasLimit,
          to,
          value,
          data,
        }))
        : dispatch(setGasTotal(
          isEIP1559
            ? calcEIP1559GasTotal(gasLimit, baseFeePerGas, maxPriorityFeePerGas)
            : calcGasTotal(gasLimit, gasPrice),
        ))
    },
    updateSendTokenBalance: ({ sendToken, tokenContract, address }) => {
      dispatch(updateSendTokenBalance({
        sendToken,
        tokenContract,
        address,
      }))
    },
    updateSendErrors: (newError) => dispatch(updateSendErrors(newError)),
    resetSendState: () => dispatch(resetSendState()),
    scanQrCode: () => dispatch(showQrScanner()),
    qrCodeDetected: (data) => dispatch(qrCodeDetected(data)),
    updateSendTo: (to, nickname) => dispatch(updateSendTo(to, nickname)),
    fetchBasicGasEstimates: () => dispatch(fetchBasicGasEstimates()),
    updateSendEnsResolution: (ensResolution) => dispatch(updateSendEnsResolution(ensResolution)),
    updateSendEnsResolutionError: (message) => dispatch(updateSendEnsResolutionError(message)),
    updateToNicknameIfNecessary: (to, toNickname, addressBook) => {
      if (isValidDomainName(toNickname)) {
        const addressBookEntry = addressBook.find(({ address }) => to === address) || {}
        if (!addressBookEntry.name !== toNickname) {
          dispatch(updateSendTo(to, addressBookEntry.name || ''))
        }
      }
    },
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SendEther)
