import { connect } from 'react-redux'
import { getSwapErrors } from '../../../../selectors'
import SwapRowErrorMessage from './swap-error-message.component'

export default connect(mapStateToProps)(SwapRowErrorMessage)

function mapStateToProps (state, ownProps) {
  return {
    errors: getSwapErrors(state),
    errorType: ownProps.errorType,
  }
}
