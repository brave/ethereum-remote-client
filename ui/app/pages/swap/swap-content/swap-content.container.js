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

} from '../../../selectors'

import * as actions from '../../../store/actions'

function mapStateToProps (state) {
  const ownedAccounts = accountsWithSwapEtherInfoSelector(state)
  const to = getSwapTo(state)
  return {
    isOwnedAccount: !!ownedAccounts.find(({ address }) => address.toLowerCase() === to.toLowerCase()),
    contact: getAddressBookEntry(state, to),
    to,
    isContractAddress: getIsContractAddress(state),
    toToken : getSwapToTokenSymbol(state),
    fromToken: getSwapFromTokenSymbol(state),
    amount: getSwapAmount(state),  
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showAddToAddressBookModal: (recipient) => dispatch(actions.showModal({
      name: 'ADD_TO_ADDRESSBOOK',
      recipient,
    })),
    getSwapQuotes: (sellAmount, buyToken, sellToken) => dispatch(actions.getQuote(sellAmount, buyToken, sellToken))
    ,
  }
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { to, sellAmount, buyToken, sellToken, ...restStateProps } = stateProps
  return {
    ...ownProps,
    ...restStateProps,
    showAddToAddressBookModal: () => dispatchProps.showAddToAddressBookModal(to),
    getSwapQuotes: () => dispatchProps.getSwapQuotes(sellAmount, buyToken, sellToken),
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SwapContent)
