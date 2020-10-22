import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import {
  getBitGoWalletBalance,
  getBitGoWalletTransfers,
  sendBitGoTransaction
} from '../../../../../ui/app/store/actions'
import ProviderWallet from './provider-wallet.component'

const mapStateToProps = ({ brave }) => {
  const {
    bitGoBalances,
    bitGoTransfers,
    bitGoCreatedWallets
  } = brave

  return {
    bitGoBalances,
    bitGoTransfers,
    bitGoCreatedWallets
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getBitGoWalletBalance: (coin) => dispatch(getBitGoWalletBalance(coin)),
    getBitGoWalletTransfers: (coin) => dispatch(getBitGoWalletTransfers(coin)),
    sendBitGoTransaction: (coin, amount, recipientAddress) => dispatch(sendBitGoTransaction(coin, amount, recipientAddress)),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ProviderWallet)
