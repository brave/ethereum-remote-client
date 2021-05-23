import { connect } from 'react-redux'
import {
  getSelectedAccount,
  getSwapFromAsset,
  getSwapFromTokenAssetBalance,
  getSwapQuoteEstimatedGasCost,
  getSwapToAsset,
} from '../../../../selectors'
import { updateSwapAmount } from '../../../../store/actions'
import AmountMaxButton from './amount-max-button.component'
import { updateSwapErrors } from '../../../../ducks/swap/swap.duck'


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
    setAmount: (value) => {
      dispatch(updateSwapErrors({ amount: null }))
      dispatch(updateSwapAmount(value))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AmountMaxButton)
