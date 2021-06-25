import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../../components/ui/page-container/page-container-footer'
import { AssetPropTypes } from '../prop-types'
import { CONFIRM_TRANSACTION_ROUTE, SECURITY_ROUTE } from '../../../helpers/constants/routes'

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
      }

      history.push(`${CONFIRM_TRANSACTION_ROUTE}/${id}`)
      hideLoadingIndication()
    }
  }

  reviewSwapButtonShouldBeDisabled () {
    /**
     * TODO (@onyb): add the following checks.
     *  - Swap token pairs are set.
     *  - Swap token pairs are NOT the same.
     *  - Amount is greater than 0.
     *  - Amount is less than asset balance.
     *  - Estimated gas price is set (reject non-zero values).
     *  - Swap quote from 0x is available.
     *  - Slippage tolerance is set.
     *  - Gas limit is greater than 21000.
     */

    const { inError } = this.props
    return inError
  }

  renderFooterExtra () {
    const { history } = this.props
    const zeroX = (
      <a href="https://0x.org" target="_blank" rel="noreferrer">
        0x
      </a>
    )

    const security = (
      <span onClick={() => history.push(SECURITY_ROUTE)}>
        Security &amp; Privacy
      </span>
    )

    return (
      <div className="swap-v2__form-row-footer-secondary">
        Brave uses {zeroX} as a DEX aggregator.
        Please see {security} for more information.
      </div>
    )
  }

  render () {
    return (
      <PageContainerFooter
        onSubmit={(e) => this.onSubmit(e)}
        submitText="Review Swap"
        disabled={this.reviewSwapButtonShouldBeDisabled()}
        hideCancel
      >
        {this.renderFooterExtra()}
      </PageContainerFooter>
    )
  }
}
