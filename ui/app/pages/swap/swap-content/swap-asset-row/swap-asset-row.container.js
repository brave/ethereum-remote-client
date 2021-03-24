import { connect } from 'react-redux'
import SwapAssetRow from './swap-asset-row.component'
import { getMetaMaskAccounts, getSwapTokenAddress } from '../../../../selectors'
import { updateSwapToken } from '../../../../store/actions'

function mapStateToProps (state) {
  return {
    tokens: state.metamask.tokens,
    selectedAddress: state.metamask.selectedAddress,
    swapTokenAddress: getSwapTokenAddress(state),
    accounts: getMetaMaskAccounts(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSwapToken: (token) => dispatch(updateSwapToken(token)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SwapAssetRow)
