import { connect } from 'react-redux'
import { showModal } from '../../../../../store/actions'
import {
  decGWEIToHexWEI,
  decimalToHex,
  hexWEIToDecGWEI,
} from '../../../../../helpers/utils/conversions.util'

import AdvancedGasInputs from './advanced-gas-inputs.component'

function convertHexValueForInputs (gasPriceInHexWEI) {
  return Number(hexWEIToDecGWEI(gasPriceInHexWEI))
}

function convertGasLimitForInputs (gasLimitInHexWEI) {
  return parseInt(gasLimitInHexWEI, 16) || 0
}

const mapDispatchToProps = (dispatch) => {
  return {
    showMaxPriorityFeeInfoModal: () => dispatch(showModal({ name: 'MAX_PRIORITY_FEE_PER_GAS_INFO_MODAL' })),
    showMaxFeeInfoModal: () => dispatch(showModal({ name: 'MAX_FEE_PER_GAS_INFO_MODAL' })),
    showGasLimitInfoModal: () => dispatch(showModal({ name: 'GAS_LIMIT_INFO_MODAL' })),
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    customMaxPriorityFeePerGas,
    customMaxFeePerGas,
    customGasLimit,
    updateCustomMaxPriorityFeePerGas,
    updateCustomMaxFeePerGas,
    updateCustomGasLimit,
  } = ownProps
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    customMaxPriorityFeePerGas: convertHexValueForInputs(customMaxPriorityFeePerGas),
    customMaxFeePerGas: convertHexValueForInputs(customMaxFeePerGas),
    customGasLimit: convertGasLimitForInputs(customGasLimit),
    updateCustomMaxPriorityFeePerGas: (price) => updateCustomMaxPriorityFeePerGas(decGWEIToHexWEI(price)),
    updateCustomMaxFeePerGas: (price) => updateCustomMaxFeePerGas(decGWEIToHexWEI(price)),
    updateCustomGasLimit: (limit) => updateCustomGasLimit(decimalToHex(limit)),
  }
}

export default connect(null, mapDispatchToProps, mergeProps)(AdvancedGasInputs)
