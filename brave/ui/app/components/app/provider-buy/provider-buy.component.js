import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import AccountDropdown from '../../ui/account-dropdown'
import ProviderAmount from '../provider-amount'
import ProviderSubmit from '../provider-submit'

export default class ProviderBuy extends PureComponent {
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
      }).format(account.exchangeRate.amount)

      ret[accountId] = {
        name: account.currencyName,
        details: account.currency,
        rates: [`@ ${fiat}`],
        image: account.logo,
      }
    }

    return ret
  }

  render () {
    const {
      accounts,
      selectedAccount,
      selectAccount,
    } = this.props

    const {
      currency,
      currencyName,
      exchangeRate,
    } = accounts[selectedAccount]

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
              image: 'images/chase-testing.png',
            },
          }}
          selected={'chase'}
          select={_ => null}
        />
        <ProviderAmount
          type={'buy'}
          currency={currency}
          exchangeRate={exchangeRate}
          limit={{
            label: 'Daily Bank Limit',
            amount: 25000,
            used: 10000,
          }}
        />
        <ProviderSubmit
          text={'Buy  ' + currencyName}
          onClick={() => null}
        />
      </div>
    )
  }
}
