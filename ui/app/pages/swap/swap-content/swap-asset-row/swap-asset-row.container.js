import { connect } from 'react-redux'
import SwapAssetRow from './swap-asset-row.component'
import {
  getSelectedAccount,
  getSwapFromAsset,
  getSwapFromTokenAssetBalance,
  getSwapQuote,
  getSwapToAsset,
} from '../../../../selectors'
import { computeSwapErrors, showModal, updateSwapFromAsset, updateSwapToAsset } from '../../../../store/actions'
import { hexAmountToDecimal } from '../../swap.utils'

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

    setAllowance: (fromAsset, fromTokenAssetBalance, customAllowance, setCustomAllowance) => {
      // Allowance can be set only for tokens
      if (!fromAsset?.address) {
        return
      }

      const fromTokenAssetBalanceDecimal = fromTokenAssetBalance
        ? hexAmountToDecimal(fromTokenAssetBalance, fromAsset)
        : '0'

      dispatch(
        showModal({
          name: 'EDIT_APPROVAL_PERMISSION',
          customTokenAmount: customAllowance,
          decimals: fromAsset.decimals,
          origin: '0x: Exchange Proxy',
          setCustomAmount: setCustomAllowance,
          tokenAmount: fromTokenAssetBalanceDecimal,
          tokenBalance: fromTokenAssetBalanceDecimal,
          tokenSymbol: fromAsset.symbol,
        }),
      )
    },
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { fromAsset, fromTokenAssetBalance } = stateProps
  const { setAllowance } = dispatchProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    setAllowance: (customAllowance, setCustomAllowance) =>
      setAllowance(fromAsset, fromTokenAssetBalance, customAllowance, setCustomAllowance),
  }
}


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SwapAssetRow)
