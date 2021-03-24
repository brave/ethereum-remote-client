import { connect } from 'react-redux'
import { getSendErrors } from '../../../../../selectors'
import SwapRowErrorMessage from './swap-row-error-message.component'

export default connect(mapStateToProps)(SwapRowErrorMessage)

function mapStateToProps (state, ownProps) {
  return {
    errors: getSwapErrors(state),
    errorType: ownProps.errorType,
  }
}
