import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  getAmountErrorObject,
  getGasFeeErrorObject,
  getToAddressForGasUpdate,
  doesAmountErrorRequireUpdate,
} from './swap.utils'
import { debounce } from 'lodash'
import { getToWarningObject, getToErrorObject } from './swap-content/add-recipient/add-recipient'
import SwapHeader from './swap-header'
import SwapContent from './swap-content'
import SwapFooter from './swap-footer'

export default class SwapTransactionScreen extends Component {

  static propTypes = {
    addressBook: PropTypes.arrayOf(PropTypes.object),
    amount: PropTypes.string,
    blockGasLimit: PropTypes.string,
    conversionRate: PropTypes.number,
    editingTransactionId: PropTypes.string,
    fetchBasicGasEstimates: PropTypes.func.isRequired,
    from: PropTypes.object,
    gasLimit: PropTypes.string,
    gasPrice: PropTypes.string,
    gasTotal: PropTypes.string,
    hasHexData: PropTypes.bool,
    history: PropTypes.object,
    network: PropTypes.string,
    primaryCurrency: PropTypes.string,
    resetSwapState: PropTypes.func.isRequired,
    selectedAddress: PropTypes.string,
    swapFromToken: PropTypes.object,
    swapToToken: PropTypes.object,
    showHexData: PropTypes.bool,
    to: PropTypes.string,
    toNickname: PropTypes.string,
    tokens: PropTypes.array,
    tokenFromBalance: PropTypes.string,
    tokenFromContract: PropTypes.object,
    tokenToBalance: PropTypes.string,
    tokenToContract: PropTypes.object,
    updateAndSetGasLimit: PropTypes.func.isRequired,
    updateSwapEnsResolution: PropTypes.func.isRequired,
    updateSwapEnsResolutionError: PropTypes.func.isRequired,
    updateSwapErrors: PropTypes.func.isRequired,
    updateSwapTo: PropTypes.func.isRequired,
    updateSwapTokenBalance: PropTypes.func.isRequired,
    updateToNicknameIfNecessary: PropTypes.func.isRequired,
    scanQrCode: PropTypes.func.isRequired,
    qrCodeDetected: PropTypes.func.isRequired,
    qrCodeData: PropTypes.object,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  state = {
    query: '',
    toError: null,
    toWarning: null,
  }

  constructor (props) {
    super(props)
    this.dValidate = debounce(this.validate, 1000)
  }

  componentDidUpdate (prevProps) {
    const {
      amount,
      conversionRate,
      from: { address, balance },
      gasTotal,
      network,
      primaryCurrency,
      swapFromToken,
      swapToToken,
      tokenToBalance,
      tokenFromBalance,
      updateSwapErrors,
      updateSwapTo,
      updateSwapTokenBalance,
      tokenContract,
      to,
      toNickname,
      addressBook,
      updateToNicknameIfNecessary,
      qrCodeData,
      qrCodeDetected,
    } = this.props

    let updateGas = false
    const {
      from: { balance: prevBalance },
      gasTotal: prevGasTotal,
      tokenFromBalance: prevTokenFromBalance,
      tokenToBalance: prevTokenToBalance,
      network: prevNetwork,
      swapFromToken: prevSwapFromToken,
      swapToToken: prevSwapToToken,
      to: prevTo,
    } = prevProps

    const uninitialized = [prevBalance, prevGasTotal].every((n) => n === null)

    const amountErrorRequiresUpdate = doesAmountErrorRequireUpdate({
      balance,
      gasTotal,
      prevBalance,
      prevGasTotal,
      prevTokenToBalance,
      prevTokenFromBalance,
      swapFromToken,
      swapToToken,
      tokenToBalance,
      tokenFromBalance
    })

    if (amountErrorRequiresUpdate) {
      const amountErrorObject = getAmountErrorObject({
        amount,
        balance,
        conversionRate,
        gasTotal,
        primaryCurrency,
        swapFromToken,
        swapToToken,
        tokenFromBalance,
        tokenToBalance
      })
      const gasFeeErrorObject = swapFromToken
        ? getGasFeeErrorObject({
          balance,
          conversionRate,
          gasTotal,
          primaryCurrency,
          swapFromToken,
        })
        : { gasFee: null }
      updateSwapErrors(Object.assign(amountErrorObject, gasFeeErrorObject))
    }

    if (!uninitialized) {

      if (network !== prevNetwork && network !== 'loading') {
        updateSwapTokenBalance({
          swapFromToken,
          tokenContract,
          address,
        })
        updateToNicknameIfNecessary(to, toNickname, addressBook)
        updateGas = true
      }
    }

    const prevFromTokenAddress = prevSwapFromToken && prevSwapFromToken.address
    const swapTokenFromAddress = swapFromToken && swapFromToken.address

    if (swapTokenFromAddress && prevFromTokenAddress !== swapFromTokenAddress) {
      this.updateSwapFromToken()
      updateGas = true
    }

    const prevToTokenAddress = prevSwapToToken && prevSwapToToken.address
    const swapTokenToAddress = swapToToken && swapToToken.address
    if (swapTokenToAddress && prevToTokenAddress !== swapToTokenAddress) {
      this.updateSwapToToken()
      updateGas = true
    }

    let scannedAddress
    if (qrCodeData) {
      if (qrCodeData.type === 'address') {
        scannedAddress = qrCodeData.values.address.toLowerCase()
        const currentAddress = prevTo && prevTo.toLowerCase()
        if (currentAddress !== scannedAddress) {
          updateSwapTo(scannedAddress)
          updateGas = true
          // Clean up QR code data after handling
          qrCodeDetected(null)
        }
      }
    }

    if (updateGas) {
      if (scannedAddress) {
        this.updateGas({ to: scannedAddress })
      } else {
        this.updateGas()
      }
    }
  }

  componentDidMount () {
    this.props.fetchBasicGasEstimates()
      .then(() => {
        this.updateGas()
      })
  }

  UNSAFE_componentWillMount () {
    this.updateSwapFromToken()
    this.updateSwapToToken()

    // Show QR Scanner modal  if ?scan=true
    if (window.location.search === '?scan=true') {
      this.props.scanQrCode()

      // Clear the queryString param after showing the modal
      const cleanUrl = window.location.href.split('?')[0]
      window.history.pushState({}, null, `${cleanUrl}`)
      window.location.hash = '#swap'
    }
  }

  componentWillUnmount () {
    this.props.resetSwapState()
  }

  onRecipientInputChange = (query) => {
    if (query) {
      this.dValidate(query)
    } else {
      this.validate(query)
    }

    this.setState({
      query,
    })
  }

  validate (query) {
    const {
      hasHexData,
      tokens,
      swapFromToken,
      network,
    } = this.props

    if (!query) {
      return this.setState({ toError: '', toWarning: '' })
    }

    const toErrorObject = getToErrorObject(query, hasHexData, network)
    const toWarningObject = getToWarningObject(query, tokens, swapFromToken)

    this.setState({
      toError: toErrorObject.to,
      toWarning: toWarningObject.to,
    })
  }

  updateSwapFromToken () {
    const {
      from: { address },
      swapFromToken,
      tokenContract,
      updateSwapTokenBalance,
    } = this.props

    updateSwapTokenBalance({
      swapFromToken,
      tokenContract,
      address,
    })
  }

  updateSwapToToken () {
    const {
      from: { address },
      swapToToken,
      tokenContract,
      updateSwapTokenBalance,
    } = this.props

    updateSwapTokenBalance({
      swapToToken,
      tokenContract,
      address,
    })
  }

  updateGas ({ to: updatedToAddress, amount: value, data } = {}) {
    const {
      amount,
      blockGasLimit,
      editingTransactionId,
      gasLimit,
      gasPrice,
      selectedAddress,
      swapFromToken,
      to: currentToAddress,
      updateAndSetGasLimit,
    } = this.props

    updateAndSetGasLimit({
      blockGasLimit,
      editingTransactionId,
      gasLimit,
      gasPrice,
      selectedAddress,
      swapFromToken,
      to: getToAddressForGasUpdate(updatedToAddress, currentToAddress),
      value: value || amount,
      data,
    })
  }

  render () {
    const { history } = this.props
    // TODO: HACK ; to is not been passed here.
    const to = "0x4F75D92c8BC5CbcD9D6BA5fc0D58A28089E48e37"

    let content = this.renderSwapContent()             

    // if (to) {
    //   content = this.renderSwapContent()
    // } else {
    //   content = this.renderAddRecipient()
    // }

    return (
      <div className="page-container">
        <SwapHeader history={history} />
        {/* { this.renderInput() } */}
        { content }
      </div>
    )
  }

  // renderInput () {
  //   return (
  //     <EnsInput
  //       className="swap__to-row"
  //       scanQrCode={(_) => {
  //         this.context.metricsEvent({
  //           eventOpts: {
  //             category: 'Transactions',
  //             action: 'Edit Screen',
  //             name: 'Used QR scanner',
  //           },
  //         })
  //         this.props.scanQrCode()
  //       }}
  //       onChange={this.onRecipientInputChange}
  //       onValidAddressTyped={(address) => this.props.updateSwapTo(address, '')}
  //       onPaste={(text) => {
  //         console.log("pasted address in swap component")
  //         console.log(text)
  //         this.props.updateSwapTo(text) && this.updateGas()
  //         console.log(this.state)
  //       }}
  //       onReset={() => this.props.updateSwapTo('', '')}
  //       updateEnsResolution={this.props.updateSwapEnsResolution}
  //       updateEnsResolutionError={this.props.updateSwapEnsResolutionError}
  //     />
  //   )
  // }

  // renderAddRecipient () {
  //   const { toError, toWarning } = this.state

  //   return (
  //     <AddRecipient
  //       updateGas={({ to, amount, data } = {}) => this.updateGas({ to, amount, data })}
  //       query={this.state.query}
  //       toError={toError}
  //       toWarning={toWarning}
  //     />
  //   )
  // }

  renderSwapContent () {
    const { history, showHexData } = this.props

    return [
      <SwapContent
        key="swap-content"
        updateGas={({ to, amount, data } = {}) => this.updateGas({ to, amount, data })}
        showHexData={showHexData}
      />,
      <SwapFooter key="swap-footer" history={history} />,
    ]
  }

}
