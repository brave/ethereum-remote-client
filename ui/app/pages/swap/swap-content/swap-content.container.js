import { connect } from 'react-redux'
import SwapContent from './swap-content.component'
import {
  getSwapTo,
  accountsWithSwapEtherInfoSelector,
  getAddressBookEntry,
  getIsContractAddress,
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
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showAddToAddressBookModal: (recipient) => dispatch(actions.showModal({
      name: 'ADD_TO_ADDRESSBOOK',
      recipient,
    })),
  }
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { to, ...restStateProps } = stateProps
  return {
    ...ownProps,
    ...restStateProps,
    showAddToAddressBookModal: () => dispatchProps.showAddToAddressBookModal(to),
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SwapContent)
