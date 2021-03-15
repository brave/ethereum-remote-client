import { connect } from 'react-redux'
import { clearSwap } from '../../store/actions'
import Swap from './swap.component'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

function mapStateToProps () {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    clearSwap: () => dispatch(clearSwap()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Swap)
