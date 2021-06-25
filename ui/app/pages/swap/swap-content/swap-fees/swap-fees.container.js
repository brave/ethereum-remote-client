import { connect } from 'react-redux'
import SwapFees from './swap-fees.component'

import {
  getNetworkIdentifier,
  getSwapAmount,
  getSwapFromAsset,
  getSwapQuote,
  getSwapQuoteEstimatedGasCost,
  getSwapToAsset,
  getSwapQuoteGasPrice,
  getSwapSlippage,
} from '../../../../selectors'

import { updateSwapSlippage } from '../../../../store/actions'

const mapStateToProps = (state) => {
  const {
    metamask: { currentCurrency, conversionRate },
  } = state

  return {
    fromAsset: getSwapFromAsset(state),
    toAsset: getSwapToAsset(state),
    quote: getSwapQuote(state),
    estimatedGasCost: getSwapQuoteEstimatedGasCost(state),
    amount: getSwapAmount(state),
    currentCurrency,
    conversionRate,
    network: getNetworkIdentifier(state),
    quoteGasPrice: getSwapQuoteGasPrice(state),
    slippage: getSwapSlippage(state),
  }
}

const mapDispatchToProps = (dispatch) => ({
  setSlippage: (slippage) => dispatch(updateSwapSlippage(slippage)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SwapFees)
