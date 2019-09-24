import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { setHardwareConnect } from '../../../store/actions'
import ConnectWallet from './connect-wallet.component'

const mapDispatchToProps = dispatch => {
  return {
    setHardwareConnect: (value) => dispatch(setHardwareConnect(value)),
  }
}

export default compose(
  withRouter,
  connect(null, mapDispatchToProps)
)(ConnectWallet)
