import SelectAction from '../../../../../../ui/app/pages/first-time-flow/select-action/select-action.component'
import {
  INITIALIZE_CREATE_PASSWORD_ROUTE
} from '../../../../../../ui/app/helpers/constants/routes'


module.exports = class BraveSelectAction extends SelectAction {
  constructor (props) {
    super(props)
  }

  handleCreate = () => {
    this.props.setFirstTimeFlowType('create')
    this.props.history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
  }

  handleImport = () => {
    this.props.setFirstTimeFlowType('import')
    this.props.history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
  }
}
