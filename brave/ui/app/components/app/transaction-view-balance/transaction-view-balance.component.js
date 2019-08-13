import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import CurrencyDisplayComponent from '../../../../../../ui/app/components/ui/currency-display/currency-display.component'
import Button from '../../../../../../ui/app/components/ui/button'
import Identicon from '../../../../../../ui/app/components/ui/identicon'
import TransactionViewBalance from '../../../../../../ui/app/components/app/transaction-view-balance'

export default class BraveTransactionViewBalance extends PureComponent {
  static propTypes = {
    viewingCoinbase: PropTypes.bool.isRequired,
    showBuySell: PropTypes.func.isRequired,
  }

  renderBalance () {
    const { account } = this.props

    const fiat = new Intl.NumberFormat(window.navigator.language, {
      style: 'currency',
      currency: account.exchangeRate.currency,
    }).format(account.exchangeRate.amount * Number(account.balance))

    // TODO(cg505): display fiat as primary depending on settings

    return (
      <div className="transaction-view-balance__balance">
        <div className="transaction-view-balance__primary-container">
          <CurrencyDisplayComponent
            className="transaction-view-balance__primary-balance"
            displayValue={account.balance}
            suffix={account.currency}
          />
        </div>
        <CurrencyDisplayComponent
          className="transaction-view-balance__secondary-balance"
          displayValue={fiat}
        />
      </div>
    )
  }

  renderButtons () {
    const { showBuySell } = this.props

    return (
      <div className="transaction-view-balance__buttons">
        <Button
          type="secondary"
          className="transaction-view-balance__button"
          onClick={showBuySell}
        >
          Buy/Sell
        </Button>
      </div>
    )
  }

  render () {
    const {
      viewingCoinbase,
      accountId,
      account,
      ...metamaskProps
    } = this.props

    if (!viewingCoinbase) {
      return <TransactionViewBalance {...metamaskProps} />
    }

    return (
      <div className="transaction-view-balance">
        <div className="transaction-view-balance__balance-container">
          <Identicon
            diameter={50}
            address={accountId}
          />
          { this.renderBalance() }
        </div>
        { this.renderButtons() }
      </div>
    )
  }
}
