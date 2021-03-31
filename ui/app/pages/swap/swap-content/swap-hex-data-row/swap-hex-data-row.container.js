import { connect } from 'react-redux'
import {
  updateSwapHexData,
} from '../../../../store/actions'
import SwapHexDataRow from './swap-hex-data-row.component'

export default connect(mapStateToProps, mapDispatchToProps)(SwapHexDataRow)

function mapStateToProps (state) {
  return {
    data: state.metamask.swap.data,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateSwapHexData (data) {
      return dispatch(updateSwapHexData(data))
    },
  }
}
