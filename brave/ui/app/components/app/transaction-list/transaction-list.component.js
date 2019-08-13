import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  UNAPPROVED_STATUS,
  REJECTED_STATUS,
  APPROVED_STATUS,
  SIGNED_STATUS,
  SUBMITTED_STATUS,
  CONFIRMED_STATUS,
  FAILED_STATUS,
  DROPPED_STATUS,
  CANCELLED_STATUS,
} from '../../../../../../ui/app/helpers/constants/transactions'
import Identicon from '../../../../../../ui/app/components/ui/identicon'
import TransactionStatus from '../../../../../../ui/app/components/app/transaction-status'
import TransactionList from '../../../../../../ui/app/components/app/transaction-list'

export default class BraveTransactionList extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    viewingCoinbase: PropTypes.bool.isRequired,
  }

  renderTransactions () {
    const { t } = this.context
    const { account: { transactions } } = this.props
    const pendingTransactions = transactions.filter(tx => tx.status === 'pending')
    const completedTransactions = transactions.filter(tx => tx.status !== 'pending')

    return (
      <div className="transaction-list__transactions">
        {
          pendingTransactions.length > 0 && (
            <div className="transaction-list__pending-transactions">
              <div className="transaction-list__header">
                { `${t('queue')} (${pendingTransactions.length})` }
              </div>
              {
                pendingTransactions.map((transaction) => (
                  this.renderTransaction(transaction, true)
                ))
              }
            </div>
          )
        }
        <div className="transaction-list__completed-transactions">
          <div className="transaction-list__header">
            { t('history') }
          </div>
          {
            completedTransactions.length > 0
              ? completedTransactions.map((transaction) => (
                  this.renderTransaction(transaction)
                ))
              : <div className="transaction-list__empty">
                  <div className="transaction-list__empty-text">
                    { t('noTransactions') }
                  </div>
                </div>
          }
        </div>
      </div>
    )
  }

  renderTransaction (transaction, isPendingTx = false) {
    const {
      id,
      to,
      created_at,
      status,
      details: { title },
      amount,
      native_amount,
    } = transaction
    // TODO(cg505)
    // - some transaction types do have have to/from.
    //   fix identicons for these.
    // - we should determine whether to use created_at, updated_at,
    //   or some other time for each type.
    // - we should make the time human-readable

    const coinbaseToMetamaskStatusHash = {
      pending: SUBMITTED_STATUS,
      completed: CONFIRMED_STATUS,
      failed: FAILED_STATUS,
      expired: DROPPED_STATUS, // this is not great
      canceled: CANCELLED_STATUS,
      // these are only for vaults, so we might not need them
      waiting_for_signature: SUBMITTED_STATUS,
      waiting_for_clearing: SUBMITTED_STATUS,
    }


    return (
      <div
        className="transaction-list-item"
        key={id}
      >
        <div className="transaction-list-item__grid">
          <Identicon
            className="transaction-list-item__identicon"
            address={to.id}
            diameter={36}
          />
          <div className="transaction-action transaction-list-item__action">
            { title }
          </div>
          <div
            className="transaction-list-item__nonce"
            title={created_at}
          >
            { created_at }
          </div>
          <TransactionStatus
            className="transaction-list-item__status"
            statusKey={coinbaseToMetamaskStatusHash[status]}
            title={status}
          />
          <div className="currency-display-component transaction-list-item__amount transaction-list-item__amount--primary">
            <span className="currency-display-component__text">
              {amount.amount}
            </span>
            <span className="currency-display-component__suffix">
              {amount.currency}
            </span>
          </div>
          <div className="currency-display-component transaction-list-item__amount transaction-list-item__amount--secondary">
            <span className="currency-display-component__text">
              {native_amount.amount}
            </span>
            <span className="currency-display-component__suffix">
              {native_amount.currency}
            </span>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const {
      viewingCoinbase,
      account,
      ...metamaskProps
    } = this.props

    if (!viewingCoinbase) {
      return <TransactionList {...metamaskProps} />
    }

    return (
      <div className="transaction-list">
        {this.renderTransactions()}
      </div>
    )
  }
}
