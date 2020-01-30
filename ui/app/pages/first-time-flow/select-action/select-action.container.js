import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { setFirstTimeFlowType } from '~/brave/ui/app/store/actions'
import { getFirstTimeFlowTypeRoute } from '../first-time-flow.selectors'
import Welcome from '~/brave/ui/app/pages/first-time-flow/welcome/welcome.component'

const mapStateToProps = (state) => {
  return {
    nextRoute: getFirstTimeFlowTypeRoute(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setFirstTimeFlowType: type => dispatch(setFirstTimeFlowType(type)),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Welcome)
