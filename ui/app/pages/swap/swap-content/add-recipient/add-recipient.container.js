import { connect } from 'react-redux'
import {
  getSwapEnsResolution,
  getSwapEnsResolutionError,
  accountsWithSwapEtherInfoSelector,
  getAddressBook,
  getAddressBookEntry,
} from '../../../../selectors'

import {
  updateSwapTo,
} from '../../../../store/actions'
import AddRecipient from './add-recipient.component'

export default connect(mapStateToProps, mapDispatchToProps)(AddRecipient)

function mapStateToProps (state) {
  const ensResolution = getSwapEnsResolution(state)

  let addressBookEntryName = ''
  if (ensResolution) {
    const addressBookEntry = getAddressBookEntry(state, ensResolution) || {}
    addressBookEntryName = addressBookEntry.name
  }

  const addressBook = getAddressBook(state)

  return {
    ownedAccounts: accountsWithSwapEtherInfoSelector(state),
    addressBook,
    ensResolution,
    addressBookEntryName,
    ensResolutionError: getSwapEnsResolutionError(state),
    contacts: addressBook.filter(({ name }) => !!name),
    nonContacts: addressBook.filter(({ name }) => !name),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateSwapTo: (to, nickname) => dispatch(updateSwapTo(to, nickname)),
  }
}
