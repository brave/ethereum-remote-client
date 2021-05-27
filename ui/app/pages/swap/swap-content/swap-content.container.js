import { connect } from 'react-redux'
import SwapContent from './swap-content.component'

import {
  displayWarning,
  fetchSwapQuote,
  hideLoadingIndication,
  showLoadingIndication,
  updateSwapGasLimit,
  updateSwapGasPrice,
} from '../../../store/actions'
import {
  getCustomGasPrice,
  getSwapAmount,
  getSwapFromAsset,
  getSwapGasLimit,
  getSwapGasPrice,
  getSwapQuote,
  getSwapQuoteGasPrice,
  getSwapToAsset,
} from '../../../selectors'

const mapStateToProps = (state) => ({
  fromAsset: getSwapFromAsset(state),
  toAsset: getSwapToAsset(state),
  amount: getSwapAmount(state),
  quote: getSwapQuote(state),
  globalGasPrice: getCustomGasPrice(state),
  gasPrice: getSwapGasPrice(state),
  gasLimit: getSwapGasLimit(state),
  quoteGasPrice: getSwapQuoteGasPrice(state),
})

const mapDispatchToProps = (dispatch) => ({
  fetchSwapQuote: async (fromAsset, toAsset, amount, gasPrice, showLoading) => {
    showLoading && (await dispatch(showLoadingIndication()))

    try {
      await dispatch(fetchSwapQuote(fromAsset, toAsset, amount, gasPrice))
    } catch (err) {
      dispatch(displayWarning(err.message))
      throw err
    } finally {
      await dispatch(hideLoadingIndication())
    }
  },
  setGasPrice: (value) => dispatch(updateSwapGasPrice(value)),
  setGasLimit: (value) => dispatch(updateSwapGasLimit(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SwapContent)
