import { connect } from 'react-redux'
import SwapAssetRow from './swap-asset-row.component'
import {
  getSelectedAccount,
  getSwapFromAsset,
  getSwapFromTokenAssetBalance,
  getSwapQuote,
  getSwapToAsset,
} from '../../../../selectors'
import { updateSwapFromAsset, updateSwapToAsset } from '../../../../store/actions'

function mapStateToProps (state) {
  return {
    selectedAccount: getSelectedAccount(state),
    assets: state.metamask.swap.assets,
    fromAsset: getSwapFromAsset(state),
    toAsset: getSwapToAsset(state),
    quote: getSwapQuote(state),
    fromTokenAssetBalance: getSwapFromTokenAssetBalance(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setFromAsset: (asset) => dispatch(updateSwapFromAsset(asset)),
    setToAsset: (asset) => dispatch(updateSwapToAsset(asset)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SwapAssetRow)
