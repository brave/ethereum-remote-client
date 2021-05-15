import { connect } from 'react-redux'
import SwapQuote from './swap-quote.component'

import {
  getSwapQuote,
  getSwapFromAsset,
  getSwapToAsset,
  getSwapAmount,
} from '../../../../selectors'

import * as actions from '../../../../store/actions'

const mapStateToProps = (state) => ({
  fromAsset: getSwapFromAsset(state),
  toAsset: getSwapToAsset(state),
  amount: getSwapAmount(state),
  quote: getSwapQuote(state),
})

const mapDispatchToProps = (dispatch) => ({
  fetchSwapQuote: (fromAsset, toAsset, amount) => dispatch(actions.fetchSwapQuote(fromAsset, toAsset, amount)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SwapQuote)
