import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../../components/ui/page-container/page-container-footer'
import { CONFIRM_TRANSACTION_ROUTE } from '../../../helpers/constants/routes'

export default class SwapFooter extends Component {

  static propTypes = {
    amount: PropTypes.string,
    data: PropTypes.string,
    from: PropTypes.object,
    gasLimit: PropTypes.string,
    gasPrice: PropTypes.string,
    gasTotal: PropTypes.string,
    history: PropTypes.object,
    inError: PropTypes.bool,
    swapFromToken: PropTypes.object,
    sign: PropTypes.func,
    to: PropTypes.string,
    toAccounts: PropTypes.array,
    tokenFromBalance: PropTypes.string,
    tokenToBalance: PropTypes.string,
    unapprovedTxs: PropTypes.object,
    swapErrors: PropTypes.object,
    gasEstimateType: PropTypes.string,
    gasIsLoading: PropTypes.bool,
    mostRecentOverviewPage: PropTypes.string.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  async onSubmit (event) {
    event.preventDefault()
    const {
      amount,
      data,
      from: { address: from },
      gasLimit: gas,
      gasPrice,
      swapFromToken,
      sign,
      to,
      history,
      gasEstimateType,
    } = this.props
    const { metricsEvent } = this.context

    const promise = sign({ data, swapFromToken, to, amount, from, gas, gasPrice })

    Promise.resolve(promise)
      .then(() => {
        metricsEvent({
          eventOpts: {
            category: 'Swap',
            action: 'Edit Screen',
            name: 'Complete',
          },
          customVariables: {
            gasChanged: gasEstimateType,
          },
        })
        history.push(CONFIRM_TRANSACTION_ROUTE)
      })
  }

  componentDidUpdate (prevProps) {
    const { inError, swapErrors } = this.props
    const { metricsEvent } = this.context
    if (!prevProps.inError && inError) {
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

    const { inError, gasIsLoading } = this.props
    return inError || gasIsLoading
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
