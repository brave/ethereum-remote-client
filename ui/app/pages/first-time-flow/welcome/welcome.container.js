import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { closeWelcomeScreen } from '~/brave/ui/app/store/actions'
import Welcome from '~/brave/ui/app/pages/first-time-flow/welcome/welcome.component'

const mapStateToProps = ({ metamask }) => {
  const { welcomeScreenSeen, isInitialized, participateInMetaMetrics } = metamask

  return {
    welcomeScreenSeen,
    isInitialized,
    participateInMetaMetrics,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeWelcomeScreen: () => dispatch(closeWelcomeScreen()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Welcome)
