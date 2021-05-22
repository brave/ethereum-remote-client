import { connect } from 'react-redux'
import {
  getSelectedAccount,
  getSwapFromAsset,
  getSwapFromTokenAssetBalance,
  getSwapQuoteEstimatedGasCost,
} from '../../../../selectors'
import { calcMaxAmount } from './amount-max-button.utils.js'
import { updateSwapAmount } from '../../../../store/actions'
import AmountMaxButton from './amount-max-button.component'
import { updateSwapErrors } from '../../../../ducks/swap/swap.duck'

export default connect(mapStateToProps, mapDispatchToProps)(AmountMaxButton)

function mapStateToProps (state) {
  return {
    account: getSelectedAccount(state),
    fromAsset: getSwapFromAsset(state),
    estimatedGasCost: getSwapQuoteEstimatedGasCost(state),
    fromTokenAssetBalance: getSwapFromTokenAssetBalance(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setAmountToMax: (maxAmountDataObject) => {
      dispatch(updateSwapErrors({ amount: null }))
      dispatch(updateSwapAmount(calcMaxAmount(maxAmountDataObject)))
    },
  }
}
