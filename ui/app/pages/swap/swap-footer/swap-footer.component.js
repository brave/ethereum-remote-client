import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../../components/ui/page-container/page-container-footer'
import { CONFIRM_TRANSACTION_ROUTE } from '../../../helpers/constants/routes'

export default class SwapFooter extends Component {

  static propTypes = {
    addToAddressBookIfNew: PropTypes.func,
    amount: PropTypes.string,
    data: PropTypes.string,
    clearSwap: PropTypes.func,
    editingTransactionId: PropTypes.string,
    from: PropTypes.object,
    gasLimit: PropTypes.string,
    gasPrice: PropTypes.string,
    gasTotal: PropTypes.string,
    history: PropTypes.object,
    inError: PropTypes.bool,
    swapToken: PropTypes.object,
    sign: PropTypes.func,
    to: PropTypes.string,
    toAccounts: PropTypes.array,
    tokenBalance: PropTypes.string,
    unapprovedTxs: PropTypes.object,
    update: PropTypes.func,
    swapErrors: PropTypes.object,
    gasEstimateType: PropTypes.string,
    gasIsLoading: PropTypes.bool,
    mostRecentOverviewPage: PropTypes.string.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  onCancel () {
    const { clearSwap, history, mostRecentOverviewPage } = this.props
    clearSwap()
    history.push(mostRecentOverviewPage)
  }

  async onSubmit (event) {
    event.preventDefault()
    const {
      addToAddressBookIfNew,
      amount,
      data,
      editingTransactionId,
      from: { address: from },
      gasLimit: gas,
      gasPrice,
      swapToken,
      sign,
      to,
      unapprovedTxs,
      // updateTx,
      update,
      toAccounts,
      history,
      gasEstimateType,
    } = this.props
    const { metricsEvent } = this.context

    // Should not be needed because submit should be disabled if there are errors.
    // const noErrors = !amountError && toError === null

    // if (!noErrors) {
    //   return
    // }

    // TODO: add nickname functionality
    await addToAddressBookIfNew(to, toAccounts)
    const promise = editingTransactionId
      ? update({
        amount,
        data,
        editingTransactionId,
        from,
        gas,
        gasPrice,
        swapToken,
        to,
        unapprovedTxs,
      })
      : sign({ data, swapToken, to, amount, from, gas, gasPrice })

    Promise.resolve(promise)
      .then(() => {
        metricsEvent({
          eventOpts: {
            category: 'Transactions',
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

  formShouldBeDisabled () {
    const { data, inError, swapToken, tokenBalance, gasTotal, to, gasLimit, gasIsLoading } = this.props
    const missingTokenBalance = swapToken && !tokenBalance
    const gasLimitTooLow = gasLimit < 5208 // 5208 is hex value of 21000, minimum gas limit
    const shouldBeDisabled = inError || !gasTotal || missingTokenBalance || !(data || to) || gasLimitTooLow || gasIsLoading
    return shouldBeDisabled
  }

  componentDidUpdate (prevProps) {
    const { inError, swapErrors } = this.props
    const { metricsEvent } = this.context
    if (!prevProps.inError && inError) {
      const errorField = Object.keys(swapErrors).find((key) => swapErrors[key])
      const errorMessage = swapErrors[errorField]

      metricsEvent({
        eventOpts: {
          category: 'Transactions',
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

  render () {
    return (
      <PageContainerFooter
        onCancel={() => this.onCancel()}
        onSubmit={(e) => this.onSubmit(e)}
        disabled={this.formShouldBeDisabled()}
      />
    )
  }

}
