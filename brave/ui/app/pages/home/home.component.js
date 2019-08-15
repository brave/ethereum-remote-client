import Home from '../../../../../ui/app/pages/home/home.component'
import PropTypes from 'prop-types'

const BraveHome = class BraveHome extends Home {

  componentDidMount () {
    super.componentDidMount()

    const { batTokenAdded, addBatToken } = this.props

    if (!batTokenAdded) {
      addBatToken()
    }
  }
}

BraveHome.propTypes.batTokenAdded = PropTypes.bool
BraveHome.propTypes.addBatToken = PropTypes.func

module.exports = BraveHome
