import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import AccountDropdown from '../../ui/account-dropdown'
import ProviderAmount from '../provider-amount'
import ProviderSubmit from '../provider-submit'

export default class ProviderSell extends PureComponent {
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
        name: `${account.currency} Wallet`,
        rates: [
          `${account.balance} ${account.currency}`,
          `= ${fiat}`,
        ],
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
          label={'Sell From'}
          accounts={cryptoAccounts}
          selected={selectedAccount}
          select={selectAccount}
        />
        <AccountDropdown
          label={'Deposit To'}
          accounts={{
            'usd': {
              name: 'USD Wallet',
              details: '$0.00',
              image: 'images/usd.svg',
            },
          }}
          selected={'usd'}
          select={_ => null}
        />
        <ProviderAmount
          type={'sell'}
          currency={currency}
          exchangeRate={exchangeRate}
        />
        <ProviderSubmit
          text={`Sell ${currencyName} Instantly`}
          onClick={() => null}
        />
      </div>
    )
  }
}
