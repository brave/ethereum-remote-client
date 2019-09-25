import Home from '../../../../../ui/app/pages/home/home.component'
import PropTypes from 'prop-types'
import { CONNECT_HARDWARE_ROUTE } from '../../helpers/constants/routes'

const BraveHome = class BraveHome extends Home {

  componentDidMount () {
    super.componentDidMount()

    const {
      batTokenAdded,
      addBatToken,
      hardwareConnect,
    } = this.props

    if (!batTokenAdded) {
      addBatToken()
    }

    if (hardwareConnect) {
      this.props.setHardwareConnect(false)
      this.props.history.push(CONNECT_HARDWARE_ROUTE)
    }
  }
}

BraveHome.propTypes.batTokenAdded = PropTypes.bool
BraveHome.propTypes.addBatToken = PropTypes.func
BraveHome.propTypes.setHardwareConnect = PropTypes.func

module.exports = BraveHome
