import React from 'react'
import PasswordWarning from '../password-warning'
import NewAccount from '../../../../../../../ui/app/pages/first-time-flow/create-password/new-account/new-account.component'

module.exports = class BraveNewAccount extends NewAccount {

  componentDidMount () {
    this.setState({ termsChecked: true })
  }

  render () {
    return (
      <div>
        {super.render()}
        <PasswordWarning />
      </div>
    )
  }
}
