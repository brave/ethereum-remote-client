import { connect } from 'react-redux'
import EnsInput from './ens-input.component'
import {
  getCurrentNetwork,
  getSwapTo,
  getSwapToNickname,
  getAddressBookEntry,
} from '../../../../selectors'

export default connect(
  (state) => {
    const selectedAddress = getSwapTo(state)
    return {
      network: parseInt(getCurrentNetwork(state)).toString(),
      selectedAddress,
      selectedName: getSwapToNickname(state),
      contact: getAddressBookEntry(state, selectedAddress),
    }
  },
)(EnsInput)
