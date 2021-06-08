import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../../components/ui/page-container/page-container-footer'
import { AssetPropTypes } from '../prop-types'
import { CONFIRM_TRANSACTION_ROUTE } from '../../../helpers/constants/routes'

export default class SwapFooter extends Component {
  static propTypes = {
    transaction: PropTypes.object,
    inError: PropTypes.bool,
    swapErrors: PropTypes.object,
    customAllowance: PropTypes.string,
    fromAsset: AssetPropTypes,
    isSwapFromTokenAssetAllowanceEnough: PropTypes.bool,
    approve: PropTypes.func.isRequired,
    sign: PropTypes.func.isRequired,
    history: PropTypes.object,
    unapprovedTxs: PropTypes.object.isRequired,
    hideLoadingIndication: PropTypes.func.isRequired,
    updateSwapTokenApprovalTxId: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  async onSubmit (event) {
    event.preventDefault()
    const {
      transaction,
      sign,
      approve,
      isSwapFromTokenAssetAllowanceEnough,
      customAllowance,
      fromAsset,
    } = this.props
    const { metricsEvent } = this.context

    let promise
    if (fromAsset.address && !isSwapFromTokenAssetAllowanceEnough) {
      promise = approve(customAllowance)
    } else {
      promise = sign(transaction)
    }

    Promise.resolve(promise).then(() => {
      metricsEvent({
        eventOpts: {
          category: 'Swap',
          action: 'Edit Screen',
          name: 'Complete',
        },
        customVariables: {
          gasChanged: '???',
        },
      })
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
    } = this.props
    const {
      inError: prevInError,
      unapprovedTxs: prevUnapprovedTxs,
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

  render () {
    return (
      <PageContainerFooter
        onSubmit={(e) => this.onSubmit(e)}
        submitText="Review Swap"
        disabled={this.reviewSwapButtonShouldBeDisabled()}
        hideCancel
      />
    )
  }
}
