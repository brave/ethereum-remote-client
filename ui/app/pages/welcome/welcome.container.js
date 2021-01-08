import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  createBitGoWallet,
  setHardwareConnect,
  setHomeRedirectRoute,
} from '../../store/actions'
import BraveWelcome from './welcome.component'

/*const mapStateToProps = ({ brave }) => {
  const { bitGoCreatedWallets } = brave

  return {
    bitGoCreatedWallets
  }
}*/

const mapDispatchToProps = (dispatch) => {
  return {
    setHardwareConnect: (value) => dispatch(setHardwareConnect(value)),
    setHomeRedirectRoute: (value) => dispatch(setHomeRedirectRoute(value)),
    createBitGoWallet: (coin) => dispatch(createBitGoWallet(coin)),
  }
}

export default compose(
  withRouter,
  connect(null/*mapStateToProps*/, mapDispatchToProps),
)(BraveWelcome)
