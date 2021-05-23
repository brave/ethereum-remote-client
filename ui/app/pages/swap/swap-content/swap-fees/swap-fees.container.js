import { connect } from 'react-redux'
import SwapFees from './swap-fees.component'

import {
  getSwapAmount,
  getSwapFromAsset,
  getSwapQuote,
  getSwapQuoteEstimatedGasCost,
  getSwapToAsset,
} from '../../../../selectors'


const mapStateToProps = (state) => {
  const { metamask: { currentCurrency, conversionRate } } = state

  return {
    fromAsset: getSwapFromAsset(state),
    toAsset: getSwapToAsset(state),
    quote: getSwapQuote(state),
    estimatedGasCost: getSwapQuoteEstimatedGasCost(state),
    amount: getSwapAmount(state),
    currentCurrency,
    conversionRate,
  }
}

const mapDispatchToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(SwapFees)
