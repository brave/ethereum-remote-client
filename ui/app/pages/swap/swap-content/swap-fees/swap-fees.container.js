import { connect } from 'react-redux'
import SwapFees from './swap-fees.component'

import {
  getSwapQuote,
  getSwapFromAsset,
  getSwapToAsset,
  getSwapAmount,
  getSwapQuoteGasPrice,
  getSwapQuoteGas,
} from '../../../../selectors'


const mapStateToProps = (state) => {
  const { metamask: { currentCurrency, conversionRate } } = state

  return {
    fromAsset: getSwapFromAsset(state),
    toAsset: getSwapToAsset(state),
    amount: getSwapAmount(state),
    quote: getSwapQuote(state),
    gasLimit: getSwapQuoteGas(state),
    estimatedGasPrice: getSwapQuoteGasPrice(state),
    currentCurrency,
    conversionRate,
  }
}

const mapDispatchToProps = () => ({})

export default connect(mapStateToProps, mapDispatchToProps)(SwapFees)