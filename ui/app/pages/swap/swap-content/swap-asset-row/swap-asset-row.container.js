import { connect } from 'react-redux'
import SwapAssetRow from './swap-asset-row.component'
import { getMetaMaskAccounts, getSwapFromTokenAddress, getSwapToTokenAddress } from '../../../../selectors'
import { updateSwapFromToken, updateSwapToToken } from '../../../../store/actions'

function mapStateToProps (state) {
  return {
    tokensFrom: state.metamask.swap.tokensFrom,
    tokensTo: state.metamask.swap.tokensTo,
    selectedAddress: state.metamask.selectedAddress,
    swapFromTokenAddress: getSwapFromTokenAddress(state),
    swapToTokenAddress: getSwapToTokenAddress(state),
    accounts: getMetaMaskAccounts(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSwapFromToken: (token) => dispatch(updateSwapFromToken(token)),
    setSwapToToken: (token) => dispatch(updateSwapToToken(token)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SwapAssetRow)
