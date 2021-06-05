import { connect } from 'react-redux'
import SwapAssetRow from './swap-asset-row.component'
import {
  getSelectedAccount,
  getSwapAmount,
  getSwapFromAsset,
  getSwapFromTokenAssetAllowance,
  getSwapFromTokenAssetBalance,
  getSwapQuote,
  getSwapToAsset,
} from '../../../../selectors'
import { computeSwapErrors, showModal, updateSwapFromAsset, updateSwapToAsset } from '../../../../store/actions'
import { hexAmountToDecimal } from '../../swap.utils'
import { ethers } from 'ethers'

function mapStateToProps (state) {
  return {
    selectedAccount: getSelectedAccount(state),
    fromAsset: getSwapFromAsset(state),
    toAsset: getSwapToAsset(state),
    quote: getSwapQuote(state),
    fromTokenAssetBalance: getSwapFromTokenAssetBalance(state),
    fromTokenAssetAllowance: getSwapFromTokenAssetAllowance(state),
    amount: getSwapAmount(state),
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

      const divisor = ethers.BigNumber.from(10).pow(fromAsset.decimals)
      const maxAllowance = ethers.BigNumber.from(2).pow(256).sub(1).div(divisor)

      dispatch(
        showModal({
          name: 'EDIT_APPROVAL_PERMISSION',
          customTokenAmount: customAllowance,
          decimals: fromAsset.decimals,
          origin: '0x Exchange Proxy',
          setCustomAmount: setCustomAllowance,
          tokenAmount: maxAllowance,
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
