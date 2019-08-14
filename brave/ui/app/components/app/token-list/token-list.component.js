import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import CurrencyDisplayComponent from '../../../../../../ui/app/components/ui/currency-display/currency-display.component'
import Identicon from '../../../../../../ui/app/components/ui/identicon'
import TokenList from '../../../../../../ui/app/components/app/token-list'

export default class BraveTokenList extends PureComponent {
  static propTypes = {
    viewingCoinbase: PropTypes.bool.isRequired,
    accounts: PropTypes.objectOf(PropTypes.shape({
      currency: PropTypes.string.isRequired,
      balance: PropTypes.string.isRequired,
      exchangeRate: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
      }).isRequired,
    })).isRequired,
    selectedAccount: PropTypes.string.isRequired,
    setSelectedAccount: PropTypes.func.isRequired,
  }

  renderAccount (accountId) {
    const { accounts, selectedAccount, setSelectedAccount } = this.props
    const account = accounts[accountId]

    const fiat = new Intl.NumberFormat(window.navigator.language, {
      style: 'currency',
      currency: account.exchangeRate.currency,
    }).format(account.exchangeRate.amount * Number(account.balance))

    // TODO(cg505): display fiat as primary depending on settings

    return (
      <div
        key={accountId}
        className={classnames({
          'wallet-balance-wrapper': true,
          'wallet-balance-wrapper--active': accountId === selectedAccount,
        })}
      >
        <div
          className="wallet-balance cb-wallet-balance"
          onClick={() => setSelectedAccount(accountId)}
        >
          <div className="balance-container">
            <Identicon
              diameter={50}
              address={accountId}
            />
            <div className="flex-column balance-display">
              <CurrencyDisplayComponent
                className="token-amount"
                displayValue={account.balance}
                suffix={account.currency}
              />
              <CurrencyDisplayComponent
                displayValue={fiat}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const {
      viewingCoinbase,
      accounts,
      ...metamaskProps
    } = this.props

    if (!viewingCoinbase) {
      return (
        <TokenList {...metamaskProps} />
      )
    }

    return (
      <div>
        {Object.keys(accounts).map(accountId => this.renderAccount(accountId))}
      </div>
    )
  }
}
