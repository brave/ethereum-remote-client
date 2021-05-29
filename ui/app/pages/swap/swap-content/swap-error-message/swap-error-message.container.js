import { connect } from 'react-redux'
import { getSwapErrors } from '../../../../selectors'
import SwapRowErrorMessage from './swap-error-message.component'


function mapStateToProps (state, ownProps) {
  return {
    errors: getSwapErrors(state),
    errorType: ownProps.errorType,
  }
}

export default connect(mapStateToProps)(SwapRowErrorMessage)
