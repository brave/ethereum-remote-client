import Home from '../../../../../ui/app/pages/home/home.component'
import PropTypes from 'prop-types'
import actions from '../../store/actions'
import batToken from '../../store/bat-token'

const BraveHome = class BraveHome extends Home {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    super.componentDidMount()

    const { batTokenAdded } = this.props

    if (!batTokenAdded) {
      this.props.dispatch(actions.addTokens(batToken))
    }    
  }
}

BraveHome.propTypes.batTokenAdded = PropTypes.bool

module.exports = BraveHome