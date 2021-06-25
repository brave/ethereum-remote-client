import React, { Component } from 'react'
import PageContainer from '../../../components/ui/page-container'
import { SWAP_ROUTE } from '../../../helpers/constants/routes'
import PropTypes from 'prop-types'
import {
  CANCELLED_STATUS,
  CONFIRMED_STATUS,
  FAILED_STATUS,
  REJECTED_STATUS,
} from '../../../helpers/constants/transactions'
import { getBlockExplorerUrlForTx } from '../../../helpers/utils/transactions.util'
import { getEtherScanNetworkIdentifier } from '../../../../lib/etherscan-prefix-for-network'


const FAILURE_STATUSES = [
  FAILED_STATUS,
  CANCELLED_STATUS,
  REJECTED_STATUS,
]

const TERMINAL_STATUSES = [
  CONFIRMED_STATUS,
  ...FAILURE_STATUSES,
]

const EVM_SUCCESS_STATUS = '0x1'

export default class WaitForTransaction extends Component {
  static propTypes = {
    transaction: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    network: PropTypes.string.isRequired,
    rpcPrefs: PropTypes.object.isRequired,
    history: PropTypes.object,
    hideLoadingIndication: PropTypes.func.isRequired,
    showLoadingIndication: PropTypes.func.isRequired,
    updateSwapTokenApprovalTxId: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = { timeout: false }

    setTimeout(() => {
      props.hideLoadingIndication()
      this.setState({ timeout: true })
    }, 600000)
  }

  componentDidMount () {
    const { transaction, showLoadingIndication } = this.props
    const { t } = this.context

    showLoadingIndication(transaction ? t(transaction.status) : undefined)
  }

  componentDidUpdate (prevProps) {
    const {
      transaction,
      showLoadingIndication,
      hideLoadingIndication,
      isLoading,
    } = this.props
    const { t } = this.context
    const { transaction: prevTransaction } = prevProps

    if (transaction?.status !== prevTransaction?.status) {
      showLoadingIndication(transaction ? t(transaction.status) : undefined)

      if (TERMINAL_STATUSES.includes(transaction?.status) && isLoading) {
        hideLoadingIndication()
        return
      }
    }

    if (
      transaction &&
      !TERMINAL_STATUSES.includes(transaction.status) &&
      !transaction.txReceipt &&
      !isLoading
    ) {
      showLoadingIndication(
        `${t(transaction.status)}. ${t('waitingForConfirmation')}`,
      )
    }
  }

  render () {
    const {
      transaction,
      history,
      updateSwapTokenApprovalTxId,
      network,
      rpcPrefs,
    } = this.props
    const { timeout } = this.state
    const { t } = this.context

    if (!transaction) {
      return null
    }

    const { status, txReceipt } = transaction
    const transactionHash = txReceipt?.transactionHash
    const evmStatus = txReceipt?.status

    const networkId = getEtherScanNetworkIdentifier(network)

    return (
      <PageContainer
        title={t('approve')}
        contentComponent={
          (TERMINAL_STATUSES.includes(status) || timeout) && (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
              <div
                style={{
                  fontSize: '100px',
                  color:
                    evmStatus === EVM_SUCCESS_STATUS
                      ? 'green'
                      : 'red',
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
              <div>
                <p>
                  {evmStatus === EVM_SUCCESS_STATUS
                    ? t(status)
                    : !transactionHash && timeout
                      ? t('timeout')
                      : t('failed')}
                </p>
                {transactionHash && (
                  <p
                    onClick={() =>
                      global.platform.openTab({
                        url: getBlockExplorerUrlForTx(
                          networkId,
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
                        rpcPrefs.blockExplorerUrl.match(
                          /^https?:\/\/(.+)/,
                        )[1],
                      ])
                      : this.context.t('viewOnEtherscan')}
                  </p>
                )}
              </div>
            </div>
          )
        }
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
