import { connect } from 'react-redux'
import { addHexPrefix } from 'ethereumjs-util'

import EIP1559GasControlsModal from './component'
import { resetCustomData } from '../../../../ducks/gas/gas.duck'
import { hideModal } from '../../../../store/actions'
import {
  getDefaultActiveButtonIndex,
  getBasicGasEstimateLoadingStatus,
  getCustomGasLimit,
  getRenderableBasicEstimateData,
  getFastPriceEstimateInHexWEI,
  getSendToken,
  getCustomPriorityFee,
} from '../../../../selectors'

const mapStateToProps = (state, ownProps) => {
  const { currentNetworkTxList, send } = state.metamask
  const { modalState: { props: modalProps } = {} } = state.appState.modal || {}
  const { txData = {} } = modalProps || {}
  const { transaction = {} } = ownProps
  const selectedTransaction = currentNetworkTxList.find(({ id }) => id === (transaction.id || txData.id))
  const sendToken = getSendToken(state)

  const maxPriorityFeePerGas = send.maxPriorityFeePerGas || getFastPriceEstimateInHexWEI(state, true)
  const maxFeePerGas = send.maxFeePerGas // || maxPriorityFeePerGas + 1

  const defaultTxParams = {
    gas: send.gasLimit || '0x5208',
    value: sendToken ? '0x0' : send.amount,
    maxPriorityFeePerGas,
    maxFeePerGas,
  }

  const txParams = selectedTransaction?.txParams ?? defaultTxParams

  const { gas: currentGasLimit } = txParams
  const customModalGasPriceInHex = getCustomPriorityFee(state) || maxPriorityFeePerGas
  const customModalGasLimitInHex = getCustomGasLimit(state) || currentGasLimit || '0x5208'

  const gasButtonInfo = getRenderableBasicEstimateData(state, customModalGasLimitInHex)

  return {
    gasPriceButtonGroupProps: {
      buttonDataLoading: getBasicGasEstimateLoadingStatus(state),
      defaultActiveButtonIndex: getDefaultActiveButtonIndex(gasButtonInfo, customModalGasPriceInHex),
      gasButtonInfo,
    },
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    cancelAndClose: () => {
      dispatch(resetCustomData())
      dispatch(hideModal())
    },
    hideModal: () => dispatch(hideModal()),
    updateCustomPriorityFee: (newPrice) => dispatch(getCustomPriorityFee(addHexPrefix(newPrice))),
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { gasPriceButtonGroupProps } = stateProps
  const { updateCustomPriorityFee } = dispatchProps
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    gasPriceButtonGroupProps: {
      ...gasPriceButtonGroupProps,
      handleGasPriceSelection: updateCustomPriorityFee,
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EIP1559GasControlsModal)
