import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import AccountDetails from '../../../../../../ui/app/components/app/account-details'

export default class BraveAccountDetails extends PureComponent {
  static propTypes = {
    viewingProvider: PropTypes.bool.isRequired,
    providerName: PropTypes.string.isRequired,
    providerBalance: PropTypes.number.isRequired,
    toggleProvider: PropTypes.func,
  }

  render () {
    const {
      viewingProvider,
      providerName,
      providerBalance,
      toggleProvider,
      ...metamaskProps
    } = this.props

    if (!viewingProvider) {
      return <AccountDetails {...metamaskProps} />
    }

    const displayedBalance = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(providerBalance || 0)

    return (
      <div className="flex-column account-details provider-account-details">
        <div className="provider-account-details__name">
          {providerName}
        </div>
        <div className="provider-account-details__balance-label">
          Uphold Balance
        </div>
        <div className="provider-account-details__balance">
          {displayedBalance}
        </div>
        <button className="provider-account-details__button allcaps" onClick={toggleProvider}>
          details
        </button>
      </div>
    )
  }
}
