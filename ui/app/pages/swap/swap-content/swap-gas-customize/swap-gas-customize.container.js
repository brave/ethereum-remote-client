import { connect } from 'react-redux'
import { getIsMainnet, getSwapQuoteGas, getSwapQuoteGasPrice } from '../../../../selectors'
import { setCustomGasLimit, setCustomGasPrice } from '../../../../ducks/gas/gas.duck'
import { showModal } from '../../../../store/actions'
import CustomizeGasButton from './swap-gas-customize.component'


function mapStateToProps (state) {
  return {
    quoteGasPrice: getSwapQuoteGasPrice(state),
    quoteGasLimit: getSwapQuoteGas(state),
    isMainnet: getIsMainnet(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showCustomizeGasModal: () => dispatch(showModal({ name: 'CUSTOMIZE_GAS', hideBasic: true })),
    setGlobalGasLimit: (value) => dispatch(setCustomGasLimit(value)),
    setGlobalGasPrice: (value) => dispatch(setCustomGasPrice(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomizeGasButton)
