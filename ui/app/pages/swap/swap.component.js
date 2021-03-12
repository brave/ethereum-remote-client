import React, { Component, useState, } from 'react'
import PropTypes from 'prop-types'
import SwapHeader from './swap-header'
import SwapContent from './swap-content'
import SwapFooter from './swap-footer'

export default class SwapScreen extends Component {
  static propTypes = {
    history: PropTypes.object,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  renderSwapContent () {
    const { history } = this.props

    return [
      <SwapContent key="swap-content" />,
      <SwapFooter key="swap-footer" history={history} />,
    ]
  }

  render () {
    const { history } = this.props
    return (
      <div className="page-container">
        <SwapHeader history={history} />
        { this.renderSwapContent() }
      </div>
    )
  }
}
 
//   ReduxFormSelect = props => {
//     const { input, options } = props;
//     return(
//       <Select
//         {...input}
//         onChange={value => input.onChange(value)}
//         onBlur={() => input.onBlur(input.value)}
//         options={options}
//       />
//       )
//     }

//   return() {
//    Form = props => {
//       const { handleSubmit } = props
//       return (
//         <form onSubmit={handleSubmit}>
//           <Field name="currentUser" component={ReduxFormSelect} options={userOptions} />
//         </form>
//       )
//     }
//   }
// }
  // renderSelectOptions = (person) => (
  //   <option key={person} value={person}>{person}</option>
  // )
  // render() {
  //   const { input, label } = this.props;
  //   return (
  //     <div>
  //       {/* <label htmlFor={label}>{label}</label> */}
  //       <select {...input}>
  //         <option value="">Select</option>
  //         {this.props.people.map(this.renderSelectOptions)}
  //       </select>
  //     </div>
  //   );
  // }

  // static propTypes = {
  //   people: PropTypes.array,
  //   input: PropTypes.object,
  //   label: PropTypes.string,
  // };
  // static propTypes = {
  //   addressBook: PropTypes.arrayOf(PropTypes.object),
  //   amount: PropTypes.string,
  //   blockGasLimit: PropTypes.string,
  //   conversionRate: PropTypes.number,
  //   editingTransactionId: PropTypes.string,
  //   fetchBasicGasEstimates: PropTypes.func.isRequired,
  //   from: PropTypes.object,
  //   gasLimit: PropTypes.string,
  //   gasPrice: PropTypes.string,
  //   gasTotal: PropTypes.string,
  //   hasHexData: PropTypes.bool,
  //   history: PropTypes.object,
  //   network: PropTypes.string,
  //   primaryCurrency: PropTypes.string,
  //   resetSendState: PropTypes.func.isRequired,
  //   selectedAddress: PropTypes.string,
  //   sendToken: PropTypes.object,
  //   showHexData: PropTypes.bool,
  //   to: PropTypes.string,
  //   toNickname: PropTypes.string,
  //   tokens: PropTypes.array,
  //   tokenBalance: PropTypes.string,
  //   tokenContract: PropTypes.object,
  //   updateAndSetGasLimit: PropTypes.func.isRequired,
  //   updateSendEnsResolution: PropTypes.func.isRequired,
  //   updateSendEnsResolutionError: PropTypes.func.isRequired,
  //   updateSendErrors: PropTypes.func.isRequired,
  //   updateSendTo: PropTypes.func.isRequired,
  //   updateSendTokenBalance: PropTypes.func.isRequired,
  //   updateToNicknameIfNecessary: PropTypes.func.isRequired,
  //   scanQrCode: PropTypes.func.isRequired,
  //   qrCodeDetected: PropTypes.func.isRequired,
  //   qrCodeData: PropTypes.object,
  // }

  // static contextTypes = {
  //   t: PropTypes.func,
  //   metricsEvent: PropTypes.func,
  // }

  // state = {
  //   query: '',
  //   toError: null,
  //   toWarning: null,
  // }

  // constructor (props) {
  //   super(props)
  //   this.dValidate = debounce(this.validate, 1000)
  // } 

  // componentDidUpdate (prevProps) {
  //   const {
  //     amount,
  //     conversionRate,
  //     from: { address, balance },
  //     gasTotal,
  //     network,
  //     primaryCurrency,
  //     sendToken,
  //     tokenBalance,
  //     updateSendErrors,
  //     updateSendTo,
  //     updateSendTokenBalance,
  //     tokenContract,
  //     to,
  //     toNickname,
  //     addressBook,
  //     updateToNicknameIfNecessary,
  //     qrCodeData,
  //     qrCodeDetected,
  //   } = this.props

  //   let updateGas = false
  //   const {
  //     from: { balance: prevBalance },
  //     gasTotal: prevGasTotal,
  //     tokenBalance: prevTokenBalance,
  //     network: prevNetwork,
  //     sendToken: prevSendToken,
  //     to: prevTo,
  //   } = prevProps

  //   const uninitialized = [prevBalance, prevGasTotal].every((n) => n === null)

  //   const amountErrorRequiresUpdate = doesAmountErrorRequireUpdate({
  //     balance,
  //     gasTotal,
  //     prevBalance,
  //     prevGasTotal,
  //     prevTokenBalance,
  //     sendToken,
  //     tokenBalance,
  //   })

  //   if (amountErrorRequiresUpdate) {
  //     const amountErrorObject = getAmountErrorObject({
  //       amount,
  //       balance,
  //       conversionRate,
  //       gasTotal,
  //       primaryCurrency,
  //       sendToken,
  //       tokenBalance,
  //     })
  //     const gasFeeErrorObject = sendToken
  //       ? getGasFeeErrorObject({
  //         balance,
  //         conversionRate,
  //         gasTotal,
  //         primaryCurrency,
  //         sendToken,
  //       })
  //       : { gasFee: null }
  //     updateSendErrors(Object.assign(amountErrorObject, gasFeeErrorObject))
  //   }

  //   if (!uninitialized) {

  //     if (network !== prevNetwork && network !== 'loading') {
  //       updateSendTokenBalance({
  //         sendToken,
  //         tokenContract,
  //         address,
  //       })
  //       updateToNicknameIfNecessary(to, toNickname, addressBook)
  //       updateGas = true
  //     }
  //   }

  //   const prevTokenAddress = prevSendToken && prevSendToken.address
  //   const sendTokenAddress = sendToken && sendToken.address

  //   if (sendTokenAddress && prevTokenAddress !== sendTokenAddress) {
  //     this.updateSendToken()
  //     updateGas = true
  //   }

  //   let scannedAddress
  //   if (qrCodeData) {
  //     if (qrCodeData.type === 'address') {
  //       scannedAddress = qrCodeData.values.address.toLowerCase()
  //       const currentAddress = prevTo && prevTo.toLowerCase()
  //       if (currentAddress !== scannedAddress) {
  //         updateSendTo(scannedAddress)
  //         updateGas = true
  //         // Clean up QR code data after handling
  //         qrCodeDetected(null)
  //       }
  //     }
  //   }

  //   if (updateGas) {
  //     if (scannedAddress) {
  //       this.updateGas({ to: scannedAddress })
  //     } else {
  //       this.updateGas()
  //     }
  //   }
  // }

  // componentDidMount () {
  //   this.props.fetchBasicGasEstimates()
  //     .then(() => {
  //       this.updateGas()
  //     })
  // }

  // UNSAFE_componentWillMount () {
  //   this.updateSendToken()

  //   // Show QR Scanner modal  if ?scan=true
  //   if (window.location.search === '?scan=true') {
  //     this.props.scanQrCode()

  //     // Clear the queryString param after showing the modal
  //     const cleanUrl = window.location.href.split('?')[0]
  //     window.history.pushState({}, null, `${cleanUrl}`)
  //     window.location.hash = '#send'
  //   }
  // }

  // componentWillUnmount () {
  //   this.props.resetSendState()
  // }

  // onRecipientInputChange = (query) => {
  //   if (query) {
  //     this.dValidate(query)
  //   } else {
  //     this.validate(query)
  //   }

  //   this.setState({
  //     query,
  //   })
  // }

  // validate (query) {
  //   const {
  //     hasHexData,
  //     tokens,
  //     sendToken,
  //     network,
  //   } = this.props

  //   if (!query) {
  //     return this.setState({ toError: '', toWarning: '' })
  //   }

  //   const toErrorObject = getToErrorObject(query, hasHexData, network)
  //   const toWarningObject = getToWarningObject(query, tokens, sendToken)

  //   this.setState({
  //     toError: toErrorObject.to,
  //     toWarning: toWarningObject.to,
  //   })
  // }

  // updateSendToken () {
  //   const {
  //     from: { address },
  //     sendToken,
  //     tokenContract,
  //     updateSendTokenBalance,
  //   } = this.props

  //   updateSendTokenBalance({
  //     sendToken,
  //     tokenContract,
  //     address,
  //   })
  // }

  // updateGas ({ to: updatedToAddress, amount: value, data } = {}) {
  //   const {
  //     amount,
  //     blockGasLimit,
  //     editingTransactionId,
  //     gasLimit,
  //     gasPrice,
  //     selectedAddress,
  //     sendToken,
  //     to: currentToAddress,
  //     updateAndSetGasLimit,
  //   } = this.props

  //   updateAndSetGasLimit({
  //     blockGasLimit,
  //     editingTransactionId,
  //     gasLimit,
  //     gasPrice,
  //     selectedAddress,
  //     sendToken,
  //     to: getToAddressForGasUpdate(updatedToAddress, currentToAddress),
  //     value: value || amount,
  //     data,
  //   })
  // }

  // render () {
  //   const { history, to } = this.props
  //   let content

  //   if (to) {
  //     content = this.renderSendContent()
  //   } else {
  //     content = this.renderAddRecipient()
  //   }

  //   return (
  //     <div className="page-container">
  //       <SendHeader history={history} />
  //       { this.renderInput() }
  //       { content }
  //     </div>
  //   )
  // }

  // renderInput () {
  //   return (
  //     <EnsInput
  //       className="send__to-row"
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
  //       onValidAddressTyped={(address) => this.props.updateSendTo(address, '')}
  //       onPaste={(text) => {
  //         this.props.updateSendTo(text) && this.updateGas()
  //       }}
  //       onReset={() => this.props.updateSendTo('', '')}
  //       updateEnsResolution={this.props.updateSendEnsResolution}
  //       updateEnsResolutionError={this.props.updateSendEnsResolutionError}
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

  // renderSendContent () {
  //   const { history, showHexData } = this.props

  //   return [
  //     <SendContent
  //       key="send-content"
  //       updateGas={({ to, amount, data } = {}) => this.updateGas({ to, amount, data })}
  //       showHexData={showHexData}
  //     />,
  //     <SendFooter key="send-footer" history={history} />,
  //   ]
  // }

// }
// }