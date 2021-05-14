import { connect } from 'react-redux'
import SwapAssetRow from './swap-asset-row.component'
import { getMetaMaskAccounts, getSwapFromAsset, getSwapToAsset } from '../../../../selectors'
import { updateSwapFromAsset, updateSwapToAsset, getQuote } from '../../../../store/actions'

function mapStateToProps (state) {
  return {
    accounts: getMetaMaskAccounts(state),
    assets: state.metamask.swap.assets,
    selectedAddress: state.metamask.selectedAddress,
    fromAsset: getSwapFromAsset(state),
    toAsset: getSwapToAsset(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setFromAsset: (asset) => dispatch(updateSwapFromAsset(asset)),
    setToAsset: (asset) => dispatch(updateSwapToAsset(asset)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SwapAssetRow)
