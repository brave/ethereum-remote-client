import { connect } from 'react-redux'
import SwapContent from './swap-content.component'
import {
  getSwapTo,
  accountsWithSwapEtherInfoSelector,
  getAddressBookEntry,
  getIsContractAddress,
  getSwapAmount,
  getSwapToTokenSymbol,
  getSwapFromTokenSymbol,
  getSwapQuote,
} from '../../../selectors'

import * as actions from '../../../store/actions'

const mapStateToProps = (state) => {
  const ownedAccounts = accountsWithSwapEtherInfoSelector(state)
  const to = getSwapTo(state)
  return {
    isOwnedAccount: !!ownedAccounts.find(({ address }) => address.toLowerCase() === to.toLowerCase()),
    contact: getAddressBookEntry(state, to),
    to,
    isContractAddress: getIsContractAddress(state),
    buyToken: getSwapToTokenSymbol(state),
    sellToken: getSwapFromTokenSymbol(state),
    sellAmount: getSwapAmount(state),
    quote: getSwapQuote(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSwapQuotes: (sellAmount, buyToken) => dispatch(actions.getQuote(parseInt(sellAmount, 16), buyToken, 'ETH')),
    updateSwapQuote: (quote) => dispatch(actions.updateSwapQuote(quote))
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { to, sellAmount, buyToken, quote, ...restStateProps } = stateProps
  return {
    ...stateProps,
    ...ownProps,
    ...restStateProps,
    getSwapQuotes: () => dispatchProps.getSwapQuotes(sellAmount, buyToken),
    updateSwapQuote: () => dispatchProps.updateSwapQuote(quote)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SwapContent)
