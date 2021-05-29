import { connect } from 'react-redux'
import SwapAssetRow from './swap-asset-row.component'
import {
  getSelectedAccount,
  getSwapFromAsset,
  getSwapFromTokenAssetBalance,
  getSwapQuote,
  getSwapToAsset,
} from '../../../../selectors'
import { computeSwapErrors, updateSwapFromAsset, updateSwapToAsset } from '../../../../store/actions'

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
    setFromAsset: async (asset) => {
      await dispatch(updateSwapFromAsset(asset))
      await dispatch(computeSwapErrors({ fromAsset: asset }))
    },
    setToAsset: (asset) => dispatch(updateSwapToAsset(asset)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SwapAssetRow)
