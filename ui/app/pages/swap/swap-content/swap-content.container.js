import { connect } from 'react-redux'
import SwapContent from './swap-content.component'

import {
  displayWarning,
  fetchSwapQuote,
  hideLoadingIndication,
  showLoadingIndication,
} from '../../../store/actions'
import {
  getSwapAmount,
  getSwapFromAsset,
  getSwapQuote,
  getSwapToAsset,
} from '../../../selectors'

const mapStateToProps = (state) => ({
  fromAsset: getSwapFromAsset(state),
  toAsset: getSwapToAsset(state),
  amount: getSwapAmount(state),
  quote: getSwapQuote(state),
})

const mapDispatchToProps = (dispatch) => ({
  fetchSwapQuote: async (fromAsset, toAsset, amount, showLoading) => {
    showLoading && (await dispatch(showLoadingIndication()))

    try {
      await dispatch(fetchSwapQuote(fromAsset, toAsset, amount))
    } catch (err) {
      dispatch(displayWarning(err.message))
      throw err
    } finally {
      await dispatch(hideLoadingIndication())
    }
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SwapContent)
