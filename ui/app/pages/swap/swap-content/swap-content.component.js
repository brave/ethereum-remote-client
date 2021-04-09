import React, { Component, ReactText } from 'react'
import PropTypes from 'prop-types'
import PageContainerContent from '../../../components/ui/page-container/page-container-content.component'
import SwapAmountRow from './swap-amount-row'
import SwapGasRow from './swap-gas-row'
import SwapHexDataRow from './swap-hex-data-row'
import SwapAssetRow from './swap-asset-row'
import Dialog from '../../../components/ui/dialog'
import TextField from '../../../components/ui/text-field'
import TransformText from './transform-text'
import ReactDOMServer from 'react-dom/server'


export default class SwapContent extends Component {

  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    updateGas: PropTypes.func,
    showAddToAddressBookModal: PropTypes.func,
    showHexData: PropTypes.bool,
    contact: PropTypes.object,
    isOwnedAccount: PropTypes.bool,
    toToken: PropTypes.object,
    toFrom: PropTypes.object,
    isContractAddress: PropTypes.bool,
  }

  updateGas = (updateData) => this.props.updateGas(updateData)
  c

  getSwapQuotes = () => {
    this.props.getSwapQuotes(amount, "ETH", toToken.symbol)
  }

  getSwapsText = () => {
    const swapText = ReactDOMServer.renderToString(this.renderQuote())
    return swapText
  }

  render () {
    console.log(`The swap component props are ${JSON.stringify(this.props)}`)
    return (
      <PageContainerContent>
        <div className="swap-v2__form">
          { this.maybeRenderContractWarning() }
          <SwapAssetRow />
          <SwapAmountRow updateGas={this.updateGas} />
            {this.getSwapsText()}
          <SwapGasRow />
          {
            this.props.showHexData && (
              <SwapHexDataRow
                updateGas={this.updateGas}
              />
            )
          }
        </div>
      </PageContainerContent>
    )
  }

  renderQuote(){
    const { t } = this.context
    const { amount, toToken } = this.props
    console.log(`The amount is ${amount}`)

    if (amount === "0"){
      return
    }
        return (
          <p>
         {this.getSwapQuotes.bind(this)}
         </p>
        )
  }

  maybeRenderContractWarning () {
    const { t } = this.context
    const { isContractAddress } = this.props

    if (!isContractAddress) {
      return
    }

    return (
      <div className="contract-error-dialog">
        <Dialog
          type="error"
          className="error__dialog"
          onClick={undefined}
        >
          {t('contractErrorMessage')}
        </Dialog>
      </div>
    )
  }

  // maybeRenderAddContact () {
  //   const { t } = this.context
  //   const { isOwnedAccount, showAddToAddressBookModal, contact = {} } = this.props

  //   if (isOwnedAccount || contact.name) {
  //     return
  //   }

  //   return (
  //     <Dialog
  //       type="message"
  //       className="swap__dialog"
  //       onClick={showAddToAddressBookModal}
  //     >
  //       {t('newAccountDetectedDialogMessage')}
  //     </Dialog>
  //   )
  // }
}
