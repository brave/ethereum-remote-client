import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  getAmountErrorObject,
  getGasFeeErrorObject,
  getToAddressForGasUpdate,
  doesAmountErrorRequireUpdate,
} from './swap.utils'
import { debounce } from 'lodash'
import SwapHeader from './swap-header'
import SwapContent from './swap-content'
import SwapFooter from './swap-footer'

export default class SwapTransactionScreen extends Component {

  static propTypes = {
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
    showHexData: PropTypes.bool,
    to: PropTypes.string,
    toNickname: PropTypes.string,
    tokensFrom: PropTypes.array,
    tokensTo: PropTypes.array,
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
      
      tokenToBalance,
      tokenFromBalance,
      updateSwapErrors,
      updateSwapTo,
      updateSwapTokenBalance,
      tokenToContract,
      to,
    } = this.props

    let updateGas = false
    const {
      from: { balance: prevBalance },
      gasTotal: prevGasTotal,
      tokenFromBalance: prevTokenFromBalance,
      tokenToBalance: prevTokenToBalance,
      network: prevNetwork,
      swapFromToken: prevSwapFromToken,
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
        updateSwapToTokenBalance({
          
          tokenFromContract,
          address,
        })
      }
    }

    const prevFromTokenAddress = prevSwapFromToken && prevSwapFromToken.address
    const swapTokenFromAddress = swapFromToken && swapFromToken.address

    if (swapTokenFromAddress && prevFromTokenAddress !== swapFromTokenAddress) {
      this.updateSwapFromToken()
      updateGas = true
    }

    // const prevToTokenAddress = prevSwapToToken && prevSwapToToken.address
    // const swapTokenToAddress = swapToToken && swapToToken.address
    // if (swapTokenToAddress && prevToTokenAddress !== swapToTokenAddress) {
    //   this.updateSwapToToken()
    //   updateGas = true
    // }

    // let scannedAddress
    // if (qrCodeData) {
    //   if (qrCodeData.type === 'address') {
    //     scannedAddress = qrCodeData.values.address.toLowerCase()
    //     const currentAddress = prevTo && prevTo.toLowerCase()
    //     if (currentAddress !== scannedAddress) {
    //       updateSwapTo(scannedAddress)
    //       updateGas = true
    //       // Clean up QR code data after handling
    //       qrCodeDetected(null)
    //     }
    //   }
    // }

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
      tokensFrom,
      tokensTo,
      swapFromToken,
      
      network,
    } = this.props

    if (!query) {
      return this.setState({ toError: '', toWarning: '' })
    }


    // FIXME (@onyb): leftover from ui/app/pages/swap/swap-content/add-recipient
    //
    // const toErrorObject = getToErrorObject(query, hasHexData, network)
    // const toWarningObject = getToWarningObject(query, tokensFrom, swapFromToken, swapToToken)
    this.setState({
      toError: "", // toErrorObject.to,
      toWarning: "", // toWarningObject.to,
    })
  }

  updateSwapFromToken () {
    const {
      from: { address },
      swapFromToken,
      tokenFromContract,
      updateSwapTokenBalance,
    } = this.props

    updateSwapTokenBalance({
      swapFromToken,
      tokenFromContract,
      address,
    })
  }

  updateSwapToToken () {
    const {
      from: { address },
      
      tokenToContract,
      updateSwapTokenBalance,
    } = this.props

    updateSwapTokenBalance({
      
      tokenToContract,
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

  renderSwapContent () {
    const { history, showHexData } = this.props

    return [
      <SwapContent
        key="swap-content"
        updateGas={({  amount, data } = {}) => this.updateGas({ amount, data })}
        showHexData={showHexData}
      />,
      <SwapFooter key="swap-footer" history={history} />,
    ]
  }

}
