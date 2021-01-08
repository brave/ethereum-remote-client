import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { createBitGoWallet } from '../../../../../ui/app/store/actions'
import ConnectAccounts from './connect-accounts.component'

const mapStateToProps = ({ metamask }) => {
  const { bitGoCreatedWallets } = metamask

  return {
    bitGoCreatedWallets
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createBitGoWallet: (coin) => dispatch(createBitGoWallet(coin)),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ConnectAccounts)
