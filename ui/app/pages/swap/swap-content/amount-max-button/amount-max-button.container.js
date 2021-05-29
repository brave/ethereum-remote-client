import { connect } from 'react-redux'
import {
  getSelectedAccount,
  getSwapFromAsset,
  getSwapFromTokenAssetBalance,
  getSwapQuoteEstimatedGasCost,
  getSwapToAsset,
} from '../../../../selectors'
import { computeSwapErrors, updateSwapAmount } from '../../../../store/actions'
import AmountMaxButton from './amount-max-button.component'

function mapStateToProps (state) {
  return {
    account: getSelectedAccount(state),
    fromAsset: getSwapFromAsset(state),
    toAsset: getSwapToAsset(state),
    estimatedGasCost: getSwapQuoteEstimatedGasCost(state),
    fromTokenAssetBalance: getSwapFromTokenAssetBalance(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setAmount: async (value) => {
      await dispatch(updateSwapAmount(value))
      await dispatch(computeSwapErrors({ amount: value }))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AmountMaxButton)
