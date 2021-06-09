import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { resetSwapState } from '../../ducks/swap/swap.duck'
import Swap from './swap.component'
import {
  getCustomGasPrice,
  getSwapAmount,
  getSwapFromAsset,
  getSwapQuote,
  getSwapQuoteGasPrice,
  getSwapToAsset,
} from '../../selectors'
import { displayWarning, fetchSwapQuote, hideLoadingIndication, showLoadingIndication } from '../../store/actions'


function mapStateToProps (state) {
  return {
    fromAsset: getSwapFromAsset(state),
    toAsset: getSwapToAsset(state),
    amount: getSwapAmount(state),
    quote: getSwapQuote(state),
    globalGasPrice: getCustomGasPrice(state),
    quoteGasPrice: getSwapQuoteGasPrice(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    resetSwapState: () => dispatch(resetSwapState()),
    fetchSwapQuote: async (fromAsset, toAsset, amount, gasPrice, showLoading, full) => {
      showLoading && (await dispatch(showLoadingIndication()))

      try {
        await dispatch(fetchSwapQuote(fromAsset, toAsset, amount, gasPrice, full))
      } catch (err) {
        dispatch(displayWarning(err.message))
      } finally {
        showLoading && (await dispatch(hideLoadingIndication()))
      }
    },
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Swap)
