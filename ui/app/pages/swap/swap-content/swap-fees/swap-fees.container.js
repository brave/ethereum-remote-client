import { connect } from 'react-redux'
import SwapFees from './swap-fees.component'

import {
  getSwapQuote,
  getSwapFromAsset,
  getSwapToAsset,
  getSwapQuoteEstimatedGasCost, getSwapGasCost, getSwapAmount,
} from '../../../../selectors'


const mapStateToProps = (state) => {
  const { metamask: { currentCurrency, conversionRate } } = state

  return {
    fromAsset: getSwapFromAsset(state),
    toAsset: getSwapToAsset(state),
    quote: getSwapQuote(state),
    estimatedGasCost: getSwapQuoteEstimatedGasCost(state),
    actualGasCost: getSwapGasCost(state),
    amount: getSwapAmount(state),
    currentCurrency,
    conversionRate,
  }
}

const mapDispatchToProps = () => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SwapFees)
