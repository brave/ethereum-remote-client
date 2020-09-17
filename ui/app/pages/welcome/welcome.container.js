import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setHardwareConnect } from '../../../ui/app/store/actions' // eslint-disable-line import/named
import BraveWelcome from './welcome.component'

const mapDispatchToProps = (dispatch) => {
  return {
    setHardwareConnect: (value) => dispatch(setHardwareConnect(value)),
  }
}

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
)(BraveWelcome)
