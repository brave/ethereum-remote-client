import { connect } from 'react-redux'
import SendContent from './send-content.component'
import {
  getSendTo,
  accountsWithSendEtherInfoSelector,
  getAddressBookEntry,
  getIsContractAddress,
  isEIP1559Active,
} from '../../../selectors'

import * as actions from '../../../store/actions'

function mapStateToProps (state) {
  const ownedAccounts = accountsWithSendEtherInfoSelector(state)
  const to = getSendTo(state)
  return {
    isOwnedAccount: !!ownedAccounts.find(({ address }) => address.toLowerCase() === to.toLowerCase()),
    contact: getAddressBookEntry(state, to),
    to,
    isContractAddress: getIsContractAddress(state),
    isEIP1559Active: isEIP1559Active(state),
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SendContent)
