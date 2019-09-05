import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { setRewardsDisclosureAccepted } from '../../../store/actions'
import WelcomeModal from './welcome-modal.component'

const mapStateToProps = ({ metamask }) => {
  const { rewardsDisclosureAccepted } = metamask

  return {
    rewardsDisclosureAccepted,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setRewardsDisclosureAccepted: () => dispatch(setRewardsDisclosureAccepted()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(WelcomeModal)
