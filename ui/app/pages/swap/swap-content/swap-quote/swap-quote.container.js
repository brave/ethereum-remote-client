import { connect } from 'react-redux'
import SwapQuote from './swap-quote.component'

import { getSwapFromAsset, getSwapQuote, getSwapToAsset } from '../../../../selectors'


const mapStateToProps = (state) => ({
  fromAsset: getSwapFromAsset(state),
  toAsset: getSwapToAsset(state),
  quote: getSwapQuote(state),
})


export default connect(mapStateToProps)(SwapQuote)
