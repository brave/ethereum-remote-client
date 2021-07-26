import React, { Component } from 'react'
import PageContainer from '../../../components/ui/page-container'
import { SWAP_ROUTE } from '../../../helpers/constants/routes'
import PropTypes from 'prop-types'
import {
  CANCELLED_STATUS,
  CONFIRMED_STATUS,
  FAILED_STATUS,
  REJECTED_STATUS,
  SUBMITTED_STATUS,
} from '../../../helpers/constants/transactions'
import { getBlockExplorerUrlForTx } from '../../../helpers/utils/transactions.util'

const FAILURE_STATUSES = [FAILED_STATUS, CANCELLED_STATUS, REJECTED_STATUS]

const TERMINAL_STATUSES = [CONFIRMED_STATUS, ...FAILURE_STATUSES]

const EVM_SUCCESS_STATUS = '0x1'

export default class WaitForTransaction extends Component {
  static propTypes = {
    transaction: PropTypes.object,
    network: PropTypes.string.isRequired,
    rpcPrefs: PropTypes.object.isRequired,
    history: PropTypes.object,
    updateSwapTokenApprovalTxId: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = { timeout: false }

    setTimeout(() => {
      this.setState({ timeout: true })
    }, 600000)
  }

  renderTransactionHash () {
    const { transaction, network, rpcPrefs } = this.props

    const { txReceipt, hash } = transaction
    const transactionHash = txReceipt?.transactionHash || hash

    return (
      transactionHash && (
        <p
          onClick={() =>
            global.platform.openTab({
              url: getBlockExplorerUrlForTx(
                network,
                transactionHash,
                rpcPrefs,
              ),
            })
          }
          style={{
            fontSize: '0.8rem',
            color: '#037dd6',
            cursor: 'pointer',
          }}
        >
          {rpcPrefs.blockExplorerUrl
            ? this.context.t('blockExplorerView', [
              rpcPrefs.blockExplorerUrl.match(/^https?:\/\/(.+)/)[1],
            ])
            : this.context.t('viewOnEtherscan')}
        </p>
      )
    )
  }

  renderEvmStatus () {
    const { transaction } = this.props
    const { t } = this.context

    if (!transaction) {
      return null
    }

    const { txReceipt } = transaction
    const { status } = transaction
    const evmStatus = txReceipt?.status

    return (
      <>
        <div
          style={{
            fontSize: '100px',
            color: evmStatus === EVM_SUCCESS_STATUS ? 'green' : 'red',
          }}
        >
          <i
            className={
              evmStatus === EVM_SUCCESS_STATUS
                ? 'fas fa-check-circle'
                : 'fas fa-times-circle'
            }
          />
        </div>
        <p>{evmStatus === EVM_SUCCESS_STATUS ? t(status) : t('failed')}</p>
      </>
    )
  }

  renderTimeout () {
    const { t } = this.context
    return (
      <>
        <div
          style={{
            fontSize: '100px',
            color: 'yellow',
          }}
        >
          <i className="fas fa-exclamation-triangle" />
        </div>
        <p>{t('timeout')}</p>
      </>
    )
  }

  loader () {
    return (
      <svg
        version="1.1"
        id="L9"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 0 0"
        xmlSpace="preserve"
        style={{ height: '100px' }}
      >
        <path
          fill="#000"
          d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="1s"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    )
  }

  renderProgress () {
    const { t } = this.context
    const { transaction } = this.props

    const displayProgress =
      transaction &&
      !TERMINAL_STATUSES.includes(transaction.status) &&
      !transaction.txReceipt

    return (
      displayProgress && (
        <>
          {this.loader()}
          <p>
            {transaction.status === SUBMITTED_STATUS
              ? `${t(transaction.status)}. ${t('waitingForConfirmation')}`
              : t(transaction.status)}
          </p>
        </>
      )
    )
  }

  render () {
    const { transaction, history, updateSwapTokenApprovalTxId } = this.props
    const { timeout } = this.state
    const { t } = this.context

    if (!transaction) {
      return null
    }

    const { status } = transaction

    return (
      <PageContainer
        title={t('approve')}
        contentComponent={(
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            {timeout &&
              !TERMINAL_STATUSES.includes(status) &&
              this.renderTimeout()}
            {TERMINAL_STATUSES.includes(status) && this.renderEvmStatus()}
            {this.renderProgress()}
            {this.renderTransactionHash()}
          </div>
        )}
        submitText={t('continueToSwap')}
        onSubmit={() => {
          history.push(SWAP_ROUTE)
          updateSwapTokenApprovalTxId(null)
        }}
        onCancel={() => {
          updateSwapTokenApprovalTxId(null)
        }}
        cancelText={t('home')}
      />
    )
  }
}
