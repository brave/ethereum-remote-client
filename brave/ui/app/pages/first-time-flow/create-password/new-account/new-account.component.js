import NewAccount from '../../../../../../../ui/app/pages/first-time-flow/create-password/new-account/new-account.component'

module.exports = class BraveNewAccount extends NewAccount {

  componentDidMount () {
    this.setState({ termsChecked: true })
  }
}
