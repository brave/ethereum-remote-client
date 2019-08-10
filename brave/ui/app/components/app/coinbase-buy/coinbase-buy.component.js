import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import AccountDropdown from '../../ui/account-dropdown'

export default class CoinbaseBuy extends PureComponent {
  static propTypes = {
    accounts: PropTypes.object.isRequired,
    selectedAccount: PropTypes.string.isRequired,
    selectAccount: PropTypes.func.isRequired,
  }

  cryptoAccounts () {
    const { accounts } = this.props
    const ret = {}

    for (const accountId of Object.keys(accounts)) {
      const account = accounts[accountId]

      const fiat = new Intl.NumberFormat(window.navigator.language, {
        style: 'currency',
        currency: account.exchangeRate.currency,
      }).format(account.exchangeRate.amount * Number(account.balance))

      ret[accountId] = {
        name: account.currencyName,
        details: account.currency,
        rates: [`@ ${fiat}`]
      }
    }

    return ret
  }

  render () {
    const { selectedAccount, selectAccount } = this.props

    const cryptoAccounts = this.cryptoAccounts()

    return (
      <div>
        <AccountDropdown
          label={'Cryptocurrency'}
          accounts={cryptoAccounts}
          selected={selectedAccount}
          select={selectAccount}
        />
        <AccountDropdown
          label={'Payment method'}
          accounts={{
            'visa': {
              name: 'Visa',
              details: 'Card number ************1234',
            },
            'chase': {
              name: 'Chase',
              details: 'Checking *******1234',
            },
          }}
          selected={'chase'}
          select={(id) => null}
        />
      </div>
    )
  }
}
