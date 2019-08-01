import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import AccountDetails from '../../../../../../ui/app/components/app/account-details'

export default class BraveAccountDetails extends PureComponent {
  static propTypes = {
    viewingCoinbase: PropTypes.bool.isRequired,
    coinbaseName: PropTypes.string,
    coinbaseBalance: PropTypes.number,
  }

  render () {
    const {
      viewingCoinbase,
      coinbaseName,
      coinbaseBalance,
      toggleCoinbase,
      ...metamaskProps
    } = this.props

    if (!viewingCoinbase) {
      return <AccountDetails {...metamaskProps} />
    }

    const displayedBalance = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(coinbaseBalance || 0)

    return (
      <div className="flex-column account-details cb-account-details">
        <div className="cb-account-details__name">
          {coinbaseName}
        </div>
        <div className="cb-account-details__balance-label">
          Coinbase Balance
        </div>
        <div className="cb-account-details__balance">
          {displayedBalance}
        </div>
        <button className="cb-account-details__button allcaps" onClick={toggleCoinbase}>
          details
        </button>
      </div>
    )
  }
}
