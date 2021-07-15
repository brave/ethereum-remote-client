import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../../components/ui/page-container/page-container-footer'
import { AssetPropTypes } from '../prop-types'
import { CONFIRM_TRANSACTION_ROUTE } from '../../../helpers/constants/routes'

export default class SwapFooter extends Component {
  static propTypes = {
    inError: PropTypes.bool,
    swapErrors: PropTypes.object,
    customAllowance: PropTypes.string,
    fromAsset: AssetPropTypes,
    toAsset: AssetPropTypes,
    isSwapFromTokenAssetAllowanceEnough: PropTypes.bool,
    approve: PropTypes.func.isRequired,
    sign: PropTypes.func.isRequired,
    history: PropTypes.object,
    unapprovedTxs: PropTypes.object.isRequired,
    hideLoadingIndication: PropTypes.func.isRequired,
    showLoadingIndication: PropTypes.func.isRequired,
    updateSwapTokenApprovalTxId: PropTypes.func.isRequired,
    refreshQuote: PropTypes.func.isRequired,
    transaction: PropTypes.object,
    amount: PropTypes.string,
    quote: PropTypes.object,
    clearSwap: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  async onSubmit (event) {
    event.preventDefault()
    const {
      approve,
      isSwapFromTokenAssetAllowanceEnough,
      customAllowance,
      fromAsset,
      toAsset,
      refreshQuote,
    } = this.props
    const { metricsEvent } = this.context

    if (fromAsset.address && !isSwapFromTokenAssetAllowanceEnough) {
      approve(customAllowance)
    } else {
      this.props.showLoadingIndication()
      await refreshQuote(fromAsset, toAsset)

      // signing to be in the componentDidUpdate
    }

    metricsEvent({
      eventOpts: {
        category: 'Swap',
        action: 'Edit Screen',
        name: 'Complete',
      },
      customVariables: {
        fromAsset,
        toAsset,
      },
    })
  }

  componentDidUpdate (prevProps) {
    const {
      inError,
      swapErrors,
      unapprovedTxs,
      history,
      hideLoadingIndication,
      updateSwapTokenApprovalTxId,
      fromAsset,
      isSwapFromTokenAssetAllowanceEnough,
      sign,
      transaction,
      clearSwap,
    } = this.props
    const {
      inError: prevInError,
      unapprovedTxs: prevUnapprovedTxs,
      transaction: prevTransaction,
    } = prevProps

    const { metricsEvent } = this.context
    if (!prevInError && inError) {
      const errorField = Object.keys(swapErrors).find((key) => swapErrors[key])
      const errorMessage = swapErrors[errorField]

      metricsEvent({
        eventOpts: {
          category: 'Swap',
          action: 'Edit Screen',
          name: 'Error',
        },
        customVariables: {
          errorField,
          errorMessage,
        },
      })
    }

    // This is uniquely the case when the full quote is fetched.
    if (prevTransaction?.data === undefined && transaction?.data) {
      sign(transaction)
    }

    const newTransactions = Object.keys(unapprovedTxs).filter(
      (id) => prevUnapprovedTxs[id] === undefined,
    )

    if (newTransactions.length > 0) {
      const id = newTransactions[0]

      if (fromAsset.address && !isSwapFromTokenAssetAllowanceEnough) {
        updateSwapTokenApprovalTxId(id)
      } else {
        clearSwap()
      }
      history.push(`${CONFIRM_TRANSACTION_ROUTE}/${id}`)
      hideLoadingIndication()
    }
  }

  reviewSwapButtonShouldBeDisabled () {
    const { inError, fromAsset, toAsset, amount, quote } = this.props

    const isAmountInvalid = !amount || parseFloat(amount) <= 0

    return (
      inError ||
      !fromAsset || !toAsset || // check if asset pairs are set
      fromAsset.address === toAsset.address || // check if asset pairs are the same
      isAmountInvalid || // check if amount is valid
      !quote // check if quote is set
    )
  }

  renderFooterExtra () {
    const { t } = this.context

    const zeroX = (
      `<a href="https://0x.org" target="_blank" rel="noreferrer">
        0x
      </a>`
    )

    const security = (
      `<span>
        ${t('securityAndPrivacy')}
      </span>`
    )

    const msg = t('swapFooterPrivacyNotice', [
      zeroX,
      security,
    ])

    return (
      <div
        className="swap-v2__form-row-footer-secondary"
        dangerouslySetInnerHTML={{ __html: msg }}
      />
    )
  }

  render () {
    const { t } = this.context

    return (
      <div className="swap-v2">
        <PageContainerFooter
          onSubmit={(e) => this.onSubmit(e)}
          submitText={t('reviewSwap')}
          disabled={this.reviewSwapButtonShouldBeDisabled()}
          hideCancel
        >
          {this.renderFooterExtra()}
        </PageContainerFooter>
      </div>
    )
  }
}
